// MCP Server - Exposes WhatsApp functionality to AI assistants
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class WhatsAppMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'whatsapp-webhook-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'send_whatsapp_message',
            description: 'Send a WhatsApp message to a specific phone number',
            inputSchema: {
              type: 'object',
              properties: {
                to: {
                  type: 'string',
                  description: 'Phone number in international format (e.g., 27765275317)',
                },
                message: {
                  type: 'string',
                  description: 'Message content to send',
                },
                type: {
                  type: 'string',
                  enum: ['text', 'template', 'interactive'],
                  description: 'Type of message to send',
                  default: 'text',
                },
              },
              required: ['to', 'message'],
            },
          },
          {
            name: 'get_webhook_events',
            description: 'Retrieve recent webhook events from WhatsApp',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of events to retrieve',
                  default: 10,
                },
                event_type: {
                  type: 'string',
                  enum: ['messages', 'statuses', 'all'],
                  description: 'Filter by event type',
                  default: 'all',
                },
              },
            },
          },
          {
            name: 'get_contact_info',
            description: 'Get information about a WhatsApp contact',
            inputSchema: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  description: 'Phone number to look up',
                },
              },
              required: ['phone_number'],
            },
          },
          {
            name: 'create_whatsapp_template',
            description: 'Create a new WhatsApp message template',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Template name',
                },
                category: {
                  type: 'string',
                  enum: ['AUTHENTICATION', 'MARKETING', 'UTILITY'],
                  description: 'Template category',
                },
                language: {
                  type: 'string',
                  description: 'Template language code (e.g., en_US)',
                  default: 'en_US',
                },
                components: {
                  type: 'array',
                  description: 'Template components',
                },
              },
              required: ['name', 'category', 'components'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'send_whatsapp_message':
            return await this.sendWhatsAppMessage(args);
          case 'get_webhook_events':
            return await this.getWebhookEvents(args);
          case 'get_contact_info':
            return await this.getContactInfo(args);
          case 'create_whatsapp_template':
            return await this.createWhatsAppTemplate(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async sendWhatsAppMessage(args) {
    const { to, message, type = 'text' } = args;
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    const messageData = {
      messaging_product: 'whatsapp',
      to: to,
      type: type,
    };

    if (type === 'text') {
      messageData.text = { body: message };
    } else if (type === 'template') {
      messageData.template = JSON.parse(message);
    }

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: [
        {
          type: 'text',
          text: `Message sent successfully. Message ID: ${response.data.messages[0].id}`,
        },
      ],
    };
  }

  async getWebhookEvents(args) {
    const { limit = 10, event_type = 'all' } = args;
    
    // In a real implementation, you'd retrieve from your database
    // For now, return a placeholder response
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${limit} webhook events of type: ${event_type}. In production, this would query your event storage.`,
        },
      ],
    };
  }

  async getContactInfo(args) {
    const { phone_number } = args;
    const token = process.env.WHATSAPP_TOKEN;

    if (!token) {
      throw new Error('WhatsApp credentials not configured');
    }

    try {
      const response = await axios.get(
        `https://graph.facebook.com/v21.0/${phone_number}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `Contact info for ${phone_number}: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Could not retrieve contact info for ${phone_number}: ${error.message}`,
          },
        ],
      };
    }
  }

  async createWhatsAppTemplate(args) {
    const { name, category, language = 'en_US', components } = args;
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    const templateData = {
      name,
      category,
      language,
      components,
    };

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/message_templates`,
      templateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: [
        {
          type: 'text',
          text: `Template created successfully. Template ID: ${response.data.id}`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('WhatsApp MCP Server running on stdio');
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new WhatsAppMCPServer();
  server.start().catch(console.error);
}

export default WhatsAppMCPServer;

