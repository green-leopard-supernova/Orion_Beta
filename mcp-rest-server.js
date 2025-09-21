// Generic REST API MCP Server - For connecting to external APIs
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class RestAPIMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'rest-api-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.baseUrl = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'make_api_request',
            description: 'Make a generic HTTP request to the configured API',
            inputSchema: {
              type: 'object',
              properties: {
                method: {
                  type: 'string',
                  enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                  description: 'HTTP method',
                  default: 'GET',
                },
                endpoint: {
                  type: 'string',
                  description: 'API endpoint (relative to base URL)',
                },
                data: {
                  type: 'object',
                  description: 'Request body data (for POST/PUT/PATCH)',
                },
                headers: {
                  type: 'object',
                  description: 'Additional headers',
                },
                params: {
                  type: 'object',
                  description: 'Query parameters',
                },
              },
              required: ['endpoint'],
            },
          },
          {
            name: 'get_contacts',
            description: 'Get contacts from the API',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of contacts to retrieve',
                  default: 50,
                },
                search: {
                  type: 'string',
                  description: 'Search term for contacts',
                },
              },
            },
          },
          {
            name: 'create_contact',
            description: 'Create a new contact in the API',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Contact name',
                },
                email: {
                  type: 'string',
                  description: 'Contact email',
                },
                phone: {
                  type: 'string',
                  description: 'Contact phone number',
                },
                custom_fields: {
                  type: 'object',
                  description: 'Additional custom fields',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'update_contact',
            description: 'Update an existing contact',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Contact ID',
                },
                data: {
                  type: 'object',
                  description: 'Updated contact data',
                },
              },
              required: ['id', 'data'],
            },
          },
          {
            name: 'get_contact_by_phone',
            description: 'Find contact by phone number',
            inputSchema: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  description: 'Phone number to search for',
                },
              },
              required: ['phone'],
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
          case 'make_api_request':
            return await this.makeApiRequest(args);
          case 'get_contacts':
            return await this.getContacts(args);
          case 'create_contact':
            return await this.createContact(args);
          case 'update_contact':
            return await this.updateContact(args);
          case 'get_contact_by_phone':
            return await this.getContactByPhone(args);
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

  async makeApiRequest(args) {
    const { method = 'GET', endpoint, data, headers = {}, params } = args;

    if (!this.baseUrl) {
      throw new Error('API_BASE_URL not configured');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.apiKey) {
      requestHeaders.Authorization = `Bearer ${this.apiKey}`;
    }

    const config = {
      method,
      url,
      headers: requestHeaders,
    };

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    const response = await axios(config);

    return {
      content: [
        {
          type: 'text',
          text: `API Request successful:\nStatus: ${response.status}\nData: ${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  }

  async getContacts(args) {
    const { limit = 50, search } = args;
    const params = { limit };

    if (search) {
      params.search = search;
    }

    return await this.makeApiRequest({
      method: 'GET',
      endpoint: '/contacts',
      params,
    });
  }

  async createContact(args) {
    const { name, email, phone, custom_fields = {} } = args;
    const contactData = {
      name,
      ...(email && { email }),
      ...(phone && { phone }),
      ...custom_fields,
    };

    return await this.makeApiRequest({
      method: 'POST',
      endpoint: '/contacts',
      data: contactData,
    });
  }

  async updateContact(args) {
    const { id, data } = args;

    return await this.makeApiRequest({
      method: 'PUT',
      endpoint: `/contacts/${id}`,
      data,
    });
  }

  async getContactByPhone(args) {
    const { phone } = args;

    return await this.makeApiRequest({
      method: 'GET',
      endpoint: '/contacts/search',
      params: { phone },
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[REST API MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('REST API MCP Server running on stdio');
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new RestAPIMCPServer();
  server.start().catch(console.error);
}

export default RestAPIMCPServer;

