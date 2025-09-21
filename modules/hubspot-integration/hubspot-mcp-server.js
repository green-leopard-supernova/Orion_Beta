// HubSpot MCP Server - Exposes HubSpot functionality to AI assistants
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class HubSpotMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'hubspot-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.HUBSPOT_API_KEY;
    this.baseUrl = 'https://api.hubapi.com';
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_contact',
            description: 'Create a new contact in HubSpot',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Contact email address',
                },
                firstname: {
                  type: 'string',
                  description: 'Contact first name',
                },
                lastname: {
                  type: 'string',
                  description: 'Contact last name',
                },
                phone: {
                  type: 'string',
                  description: 'Contact phone number',
                },
                whatsapp_number: {
                  type: 'string',
                  description: 'WhatsApp phone number',
                },
                properties: {
                  type: 'object',
                  description: 'Additional contact properties',
                },
              },
              required: ['email'],
            },
          },
          {
            name: 'get_contact',
            description: 'Get contact information by email or ID',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Contact email or ID',
                },
                properties: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific properties to retrieve',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'update_contact',
            description: 'Update an existing contact in HubSpot',
            inputSchema: {
              type: 'object',
              properties: {
                contact_id: {
                  type: 'string',
                  description: 'HubSpot contact ID',
                },
                properties: {
                  type: 'object',
                  description: 'Properties to update',
                },
              },
              required: ['contact_id', 'properties'],
            },
          },
          {
            name: 'search_contacts',
            description: 'Search for contacts in HubSpot',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results',
                  default: 10,
                },
                properties: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Properties to include in results',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'create_deal',
            description: 'Create a new deal in HubSpot',
            inputSchema: {
              type: 'object',
              properties: {
                dealname: {
                  type: 'string',
                  description: 'Deal name',
                },
                amount: {
                  type: 'number',
                  description: 'Deal amount',
                },
                dealstage: {
                  type: 'string',
                  description: 'Deal stage',
                },
                pipeline: {
                  type: 'string',
                  description: 'Deal pipeline',
                },
                associated_contact: {
                  type: 'string',
                  description: 'Associated contact ID',
                },
                properties: {
                  type: 'object',
                  description: 'Additional deal properties',
                },
              },
              required: ['dealname'],
            },
          },
          {
            name: 'get_deal',
            description: 'Get deal information by ID',
            inputSchema: {
              type: 'object',
              properties: {
                deal_id: {
                  type: 'string',
                  description: 'HubSpot deal ID',
                },
                properties: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific properties to retrieve',
                },
              },
              required: ['deal_id'],
            },
          },
          {
            name: 'create_company',
            description: 'Create a new company in HubSpot',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Company name',
                },
                domain: {
                  type: 'string',
                  description: 'Company domain',
                },
                industry: {
                  type: 'string',
                  description: 'Company industry',
                },
                properties: {
                  type: 'object',
                  description: 'Additional company properties',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'get_company',
            description: 'Get company information by ID or domain',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Company ID or domain',
                },
                properties: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific properties to retrieve',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'create_timeline_event',
            description: 'Create a timeline event for a contact',
            inputSchema: {
              type: 'object',
              properties: {
                contact_id: {
                  type: 'string',
                  description: 'HubSpot contact ID',
                },
                event_type: {
                  type: 'string',
                  enum: ['whatsapp_message', 'phone_call', 'email', 'meeting', 'note'],
                  description: 'Type of timeline event',
                },
                subject: {
                  type: 'string',
                  description: 'Event subject',
                },
                body: {
                  type: 'string',
                  description: 'Event body/content',
                },
                properties: {
                  type: 'object',
                  description: 'Additional event properties',
                },
              },
              required: ['contact_id', 'event_type', 'subject'],
            },
          },
          {
            name: 'get_contact_by_phone',
            description: 'Find contact by phone number (including WhatsApp)',
            inputSchema: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  description: 'Phone number to search for',
                },
                search_fields: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Phone fields to search in',
                  default: ['phone', 'whatsapp_number', 'mobilephone'],
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
          case 'create_contact':
            return await this.createContact(args);
          case 'get_contact':
            return await this.getContact(args);
          case 'update_contact':
            return await this.updateContact(args);
          case 'search_contacts':
            return await this.searchContacts(args);
          case 'create_deal':
            return await this.createDeal(args);
          case 'get_deal':
            return await this.getDeal(args);
          case 'create_company':
            return await this.createCompany(args);
          case 'get_company':
            return await this.getCompany(args);
          case 'create_timeline_event':
            return await this.createTimelineEvent(args);
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

  async makeHubSpotRequest(method, endpoint, data = null, params = {}) {
    if (!this.apiKey) {
      throw new Error('HubSpot API key not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      params,
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  async createContact(args) {
    const { email, firstname, lastname, phone, whatsapp_number, properties = {} } = args;
    
    const contactData = {
      properties: {
        email,
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(phone && { phone }),
        ...(whatsapp_number && { whatsapp_number }),
        ...properties,
      },
    };

    const result = await this.makeHubSpotRequest('POST', '/crm/v3/objects/contacts', contactData);

    return {
      content: [
        {
          type: 'text',
          text: `Contact created successfully. Contact ID: ${result.id}`,
        },
      ],
    };
  }

  async getContact(args) {
    const { identifier, properties = [] } = args;
    
    const params = properties.length > 0 ? { properties: properties.join(',') } : {};
    const result = await this.makeHubSpotRequest('GET', `/crm/v3/objects/contacts/${identifier}`, null, params);

    return {
      content: [
        {
          type: 'text',
          text: `Contact found: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async updateContact(args) {
    const { contact_id, properties } = args;
    
    const updateData = { properties };
    const result = await this.makeHubSpotRequest('PATCH', `/crm/v3/objects/contacts/${contact_id}`, updateData);

    return {
      content: [
        {
          type: 'text',
          text: `Contact updated successfully. Contact ID: ${result.id}`,
        },
      ],
    };
  }

  async searchContacts(args) {
    const { query, limit = 10, properties = [] } = args;
    
    const searchData = {
      query,
      limit,
      properties: properties.length > 0 ? properties : ['email', 'firstname', 'lastname', 'phone'],
    };

    const result = await this.makeHubSpotRequest('POST', '/crm/v3/objects/contacts/search', searchData);

    return {
      content: [
        {
          type: 'text',
          text: `Found ${result.total} contacts: ${JSON.stringify(result.results, null, 2)}`,
        },
      ],
    };
  }

  async createDeal(args) {
    const { dealname, amount, dealstage, pipeline, associated_contact, properties = {} } = args;
    
    const dealData = {
      properties: {
        dealname,
        ...(amount && { amount }),
        ...(dealstage && { dealstage }),
        ...(pipeline && { pipeline }),
        ...properties,
      },
    };

    const result = await this.makeHubSpotRequest('POST', '/crm/v3/objects/deals', dealData);

    // Associate with contact if provided
    if (associated_contact) {
      await this.makeHubSpotRequest('PUT', `/crm/v3/objects/deals/${result.id}/associations/contacts/${associated_contact}`, {
        inputs: [{ from: { id: result.id }, to: { id: associated_contact }, type: 'deal_to_contact' }]
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: `Deal created successfully. Deal ID: ${result.id}`,
        },
      ],
    };
  }

  async getDeal(args) {
    const { deal_id, properties = [] } = args;
    
    const params = properties.length > 0 ? { properties: properties.join(',') } : {};
    const result = await this.makeHubSpotRequest('GET', `/crm/v3/objects/deals/${deal_id}`, null, params);

    return {
      content: [
        {
          type: 'text',
          text: `Deal found: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async createCompany(args) {
    const { name, domain, industry, properties = {} } = args;
    
    const companyData = {
      properties: {
        name,
        ...(domain && { domain }),
        ...(industry && { industry }),
        ...properties,
      },
    };

    const result = await this.makeHubSpotRequest('POST', '/crm/v3/objects/companies', companyData);

    return {
      content: [
        {
          type: 'text',
          text: `Company created successfully. Company ID: ${result.id}`,
        },
      ],
    };
  }

  async getCompany(args) {
    const { identifier, properties = [] } = args;
    
    const params = properties.length > 0 ? { properties: properties.join(',') } : {};
    const result = await this.makeHubSpotRequest('GET', `/crm/v3/objects/companies/${identifier}`, null, params);

    return {
      content: [
        {
          type: 'text',
          text: `Company found: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async createTimelineEvent(args) {
    const { contact_id, event_type, subject, body, properties = {} } = args;
    
    const eventData = {
      eventType: event_type,
      subject,
      body,
      properties: {
        ...properties,
        hs_timestamp: Date.now(),
      },
    };

    const result = await this.makeHubSpotRequest('POST', `/crm/v3/objects/contacts/${contact_id}/timeline/events`, eventData);

    return {
      content: [
        {
          type: 'text',
          text: `Timeline event created successfully. Event ID: ${result.id}`,
        },
      ],
    };
  }

  async getContactByPhone(args) {
    const { phone, search_fields = ['phone', 'whatsapp_number', 'mobilephone'] } = args;
    
    // Search for contacts with the phone number
    const searchData = {
      query: phone,
      limit: 10,
      properties: ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number', 'mobilephone'],
    };

    const result = await this.makeHubSpotRequest('POST', '/crm/v3/objects/contacts/search', searchData);

    // Filter results to find exact phone matches
    const matchingContacts = result.results.filter(contact => {
      return search_fields.some(field => {
        const value = contact.properties[field];
        return value && value.includes(phone.replace(/\D/g, ''));
      });
    });

    return {
      content: [
        {
          type: 'text',
          text: `Found ${matchingContacts.length} contacts with phone ${phone}: ${JSON.stringify(matchingContacts, null, 2)}`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[HubSpot MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('HubSpot MCP Server running on stdio');
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new HubSpotMCPServer();
  server.start().catch(console.error);
}

export default HubSpotMCPServer;
