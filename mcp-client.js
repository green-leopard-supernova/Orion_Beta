// MCP Client - Connects to external MCP servers (CRM, databases, etc.)
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class MCPClientManager {
  constructor() {
    this.clients = new Map();
    this.availableServers = new Map();
  }

  // Register available MCP servers
  registerServer(name, config) {
    this.availableServers.set(name, {
      name,
      command: config.command,
      args: config.args || [],
      env: config.env || {},
      description: config.description || '',
      ...config,
    });
  }

  // Connect to an MCP server
  async connectToServer(serverName) {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName);
    }

    const serverConfig = this.availableServers.get(serverName);
    if (!serverConfig) {
      throw new Error(`Server ${serverName} not found. Available servers: ${Array.from(this.availableServers.keys()).join(', ')}`);
    }

    try {
      const transport = new StdioClientTransport({
        command: serverConfig.command,
        args: serverConfig.args,
        env: { ...process.env, ...serverConfig.env },
      });

      const client = new Client(
        {
          name: `whatsapp-webhook-client-${serverName}`,
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      await client.connect(transport);
      this.clients.set(serverName, client);
      
      console.log(`✅ Connected to MCP server: ${serverName}`);
      return client;
    } catch (error) {
      console.error(`❌ Failed to connect to ${serverName}:`, error.message);
      throw error;
    }
  }

  // Get available tools from a server
  async getServerTools(serverName) {
    const client = await this.connectToServer(serverName);
    const response = await client.listTools();
    return response.tools;
  }

  // Call a tool on a specific server
  async callServerTool(serverName, toolName, args = {}) {
    const client = await this.connectToServer(serverName);
    const response = await client.callTool({
      name: toolName,
      arguments: args,
    });
    return response;
  }

  // Disconnect from a server
  async disconnectFromServer(serverName) {
    const client = this.clients.get(serverName);
    if (client) {
      await client.close();
      this.clients.delete(serverName);
      console.log(`🔌 Disconnected from MCP server: ${serverName}`);
    }
  }

  // Disconnect from all servers
  async disconnectAll() {
    const disconnectPromises = Array.from(this.clients.keys()).map(serverName => 
      this.disconnectFromServer(serverName)
    );
    await Promise.all(disconnectPromises);
  }

  // List all connected servers
  getConnectedServers() {
    return Array.from(this.clients.keys());
  }

  // Get server status
  getServerStatus(serverName) {
    return {
      connected: this.clients.has(serverName),
      config: this.availableServers.get(serverName),
    };
  }
}

// Pre-configured server definitions for common integrations
class PredefinedServers {
  static getCRMConfigs() {
    return {
      // Salesforce MCP Server (if available)
      salesforce: {
        command: 'npx',
        args: ['@salesforce/mcp-server'],
        description: 'Salesforce CRM integration',
        env: {
          SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
          SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
          SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
          SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
        },
      },
      
      // HubSpot MCP Server (if available)
      hubspot: {
        command: 'npx',
        args: ['@hubspot/mcp-server'],
        description: 'HubSpot CRM integration',
        env: {
          HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
        },
      },

      // Generic REST API MCP Server
      rest_api: {
        command: 'node',
        args: ['./mcp-rest-server.js'],
        description: 'Generic REST API MCP server',
        env: {
          API_BASE_URL: process.env.API_BASE_URL,
          API_KEY: process.env.API_KEY,
        },
      },
    };
  }

  static getDatabaseConfigs() {
    return {
      // PostgreSQL MCP Server
      postgres: {
        command: 'npx',
        args: ['@modelcontextprotocol/server-postgres'],
        description: 'PostgreSQL database integration',
        env: {
          POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING,
        },
      },

      // MongoDB MCP Server
      mongodb: {
        command: 'npx',
        args: ['@modelcontextprotocol/server-mongodb'],
        description: 'MongoDB database integration',
        env: {
          MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
        },
      },
    };
  }

  static getFileSystemConfigs() {
    return {
      // File System MCP Server
      filesystem: {
        command: 'npx',
        args: ['@modelcontextprotocol/server-filesystem'],
        description: 'File system access',
        env: {
          ALLOWED_PATHS: process.env.ALLOWED_PATHS || '/tmp',
        },
      },
    };
  }

  static getAllConfigs() {
    return {
      ...this.getCRMConfigs(),
      ...this.getDatabaseConfigs(),
      ...this.getFileSystemConfigs(),
    };
  }
}

// n8n-specific integration helper
class N8nIntegration {
  constructor(mcpClient) {
    this.mcpClient = mcpClient;
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  }

  // Send data to n8n webhook
  async sendToN8n(data, workflowId = null) {
    if (!this.n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured');
    }

    if (!process.env.N8N_TOKEN) {
      throw new Error('N8N_TOKEN not configured');
    }

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'whatsapp-webhook-mcp',
      workflowId,
    };

    try {
      const response = await axios.post(this.n8nWebhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_TOKEN}`,
        },
        timeout: 10000,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Failed to send to n8n:', error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        response: error.response?.data,
      };
    }
  }

  // Process WhatsApp message through n8n workflow
  async processWhatsAppMessage(messageData, workflowId = 'whatsapp-message-processor') {
    const n8nData = {
      type: 'whatsapp_message',
      message: messageData,
      metadata: {
        phoneNumber: messageData.from,
        messageType: messageData.type,
        timestamp: messageData.timestamp,
      },
    };

    return await this.sendToN8n(n8nData, workflowId);
  }

  // Process CRM data through n8n workflow
  async processCRMData(crmData, workflowId = 'crm-sync') {
    const n8nData = {
      type: 'crm_data',
      data: crmData,
      metadata: {
        source: 'mcp-client',
        timestamp: new Date().toISOString(),
      },
    };

    return await this.sendToN8n(n8nData, workflowId);
  }
}

export { MCPClientManager, PredefinedServers, N8nIntegration };
export default MCPClientManager;
