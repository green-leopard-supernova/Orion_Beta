// Integrated WhatsApp Webhook with MCP functionality
import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { MCPClientManager, PredefinedServers, N8nIntegration } from './mcp-client.js';
import HubSpotIntegration from './hubspot-integration.js';
import trelloRouter from '../trello-powerup/trello-api.js';

dotenv.config();

class WhatsAppMCPWebhook {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.mcpClient = new MCPClientManager();
    this.n8nIntegration = new N8nIntegration(this.mcpClient);
    this.hubspotIntegration = new HubSpotIntegration();
    this.eventHistory = []; // Simple in-memory storage for demo
    
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeMCPServers();
  }

  setupMiddleware() {
    // Keep raw body for signature verification
    this.app.use(bodyParser.json({
      verify: (req, res, buf) => { req.rawBody = buf; }
    }));
  }

  setupRoutes() {
    // Health check
    this.app.get('/orion_beta1.0.0', (_, res) => res.status(200).send('ok'));

    // Webhook verification
    this.app.get('/webhook', (req, res) => {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      }
      return res.sendStatus(403);
    });

    // Enhanced webhook handler with MCP integration
    this.app.post('/webhook', async (req, res) => {
      if (!this.verifySignature(req)) {
        console.warn('⚠️ Invalid signature');
        return res.sendStatus(401);
      }

      // Always respond quickly to prevent Meta retries
      res.sendStatus(200);

      try {
        await this.processWebhookEvent(req.body);
      } catch (error) {
        console.error('Error processing webhook:', error);
      }
    });

    // MCP management endpoints
    this.app.get('/mcp/servers', (req, res) => {
      const servers = this.mcpClient.getConnectedServers().map(name => ({
        name,
        ...this.mcpClient.getServerStatus(name)
      }));
      res.json({ servers });
    });

    this.app.post('/mcp/connect/:serverName', async (req, res) => {
      try {
        const { serverName } = req.params;
        await this.mcpClient.connectToServer(serverName);
        res.json({ success: true, message: `Connected to ${serverName}` });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.post('/mcp/disconnect/:serverName', async (req, res) => {
      try {
        const { serverName } = req.params;
        await this.mcpClient.disconnectFromServer(serverName);
        res.json({ success: true, message: `Disconnected from ${serverName}` });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // n8n integration endpoint
    this.app.post('/n8n/send', async (req, res) => {
      try {
        const result = await this.n8nIntegration.sendToN8n(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Event history endpoint
    this.app.get('/events', (req, res) => {
      const limit = parseInt(req.query.limit) || 50;
      const events = this.eventHistory.slice(-limit).reverse();
      res.json({ events, total: this.eventHistory.length });
    });

    // HubSpot management endpoints
    this.app.get('/hubspot/contacts/search', async (req, res) => {
      try {
        const { query, limit = 10 } = req.query;
        const result = await this.hubspotIntegration.searchContacts(query, parseInt(limit));
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/hubspot/contacts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const contact = await this.hubspotIntegration.getContact(id);
        if (contact) {
          res.json(contact);
        } else {
          res.status(404).json({ error: 'Contact not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/hubspot/contacts/find-by-phone', async (req, res) => {
      try {
        const { phone } = req.body;
        const contact = await this.hubspotIntegration.findContactByPhone(phone);
        res.json({ contact, found: !!contact });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Trello Power-Up integration (optional)
    this.app.use('/', trelloRouter);
  }

  async initializeMCPServers() {
    // Register predefined servers
    const serverConfigs = PredefinedServers.getAllConfigs();
    
    for (const [name, config] of Object.entries(serverConfigs)) {
      this.mcpClient.registerServer(name, config);
    }

    // Auto-connect to available servers
    const autoConnectServers = ['rest_api']; // Add servers you want to auto-connect
    
    for (const serverName of autoConnectServers) {
      try {
        await this.mcpClient.connectToServer(serverName);
        console.log(`✅ Auto-connected to MCP server: ${serverName}`);
      } catch (error) {
        console.log(`⚠️ Could not auto-connect to ${serverName}: ${error.message}`);
      }
    }
  }

  async processWebhookEvent(body) {
    const event = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data: body,
    };

    // Store event in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-500); // Keep last 500 events
    }

    const change = body?.entry?.[0]?.changes?.[0];
    const field = change?.field;
    const value = change?.value;

    if (field === 'messages') {
      await this.handleMessages(value);
    } else if (field === 'message_template_status_update') {
      await this.handleTemplateStatusUpdate(value);
    } else if (field === 'message_template_quality_update') {
      await this.handleTemplateQualityUpdate(value);
    } else {
      console.log('ℹ️ Other field:', field, JSON.stringify(value));
    }
  }

  async handleMessages(value) {
    if (value?.messages?.length) {
      for (const msg of value.messages) {
        await this.processIncomingMessage(msg);
      }
    }

    if (value?.statuses?.length) {
      for (const status of value.statuses) {
        await this.processMessageStatus(status);
      }
    }
  }

  async processIncomingMessage(msg) {
    const from = msg.from;
    const type = msg.type;
    const messageData = {
      from,
      type,
      timestamp: new Date().toISOString(),
      ...msg,
    };

    console.log(`📩 ${type} message from ${from}`);

    // Send to n8n for processing
    try {
      const n8nResult = await this.n8nIntegration.processWhatsAppMessage(messageData);
      if (n8nResult.success) {
        console.log('✅ Message sent to n8n successfully');
      } else {
        console.log('⚠️ Failed to send to n8n:', n8nResult.error);
      }
    } catch (error) {
      console.error('❌ n8n integration error:', error.message);
    }

    // Sync with HubSpot
    try {
      const hubspotResult = await this.hubspotIntegration.processWhatsAppMessage(messageData);
      if (hubspotResult && hubspotResult.processed) {
        console.log('✅ HubSpot sync successful');
      } else {
        console.log('⚠️ HubSpot sync failed:', hubspotResult?.error);
      }
    } catch (error) {
      console.error('❌ HubSpot sync error:', error.message);
    }

    // Try to sync with other CRM systems if available
    try {
      await this.syncWithCRM(messageData);
    } catch (error) {
      console.error('❌ CRM sync error:', error.message);
    }

    // Log message details
    if (type === 'text') {
      console.log(`   Text: ${msg.text.body}`);
    } else if (type === 'button') {
      console.log(`   Button: ${msg.button.text}`);
    } else {
      console.log(`   Data: ${JSON.stringify(msg)}`);
    }
  }

  async processMessageStatus(status) {
    console.log(`📦 Status: ${status.status} for ${status.id}`);
    
    // Send status update to n8n
    try {
      await this.n8nIntegration.sendToN8n({
        type: 'whatsapp_status',
        status,
        metadata: {
          conversationId: status.conversation?.id,
          timestamp: new Date().toISOString(),
        },
      }, 'whatsapp-status-processor');
    } catch (error) {
      console.error('❌ Failed to send status to n8n:', error.message);
    }
  }

  async handleTemplateStatusUpdate(value) {
    console.log('🧾 Template status update:', JSON.stringify(value));
    
    // Send template status to n8n
    try {
      await this.n8nIntegration.sendToN8n({
        type: 'template_status',
        data: value,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      }, 'template-status-processor');
    } catch (error) {
      console.error('❌ Failed to send template status to n8n:', error.message);
    }
  }

  async handleTemplateQualityUpdate(value) {
    console.log('📊 Template quality update:', JSON.stringify(value));
    
    // Send quality update to n8n
    try {
      await this.n8nIntegration.sendToN8n({
        type: 'template_quality',
        data: value,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      }, 'template-quality-processor');
    } catch (error) {
      console.error('❌ Failed to send quality update to n8n:', error.message);
    }
  }

  async syncWithCRM(messageData) {
    // Try to find contact in CRM
    try {
      const contactResult = await this.mcpClient.callServerTool('rest_api', 'get_contact_by_phone', {
        phone: messageData.from,
      });

      if (contactResult.content && contactResult.content[0]) {
        console.log('📞 Contact found in CRM');
        
        // Update contact with latest message info
        await this.mcpClient.callServerTool('rest_api', 'update_contact', {
          id: 'contact_id_here', // Extract from contactResult
          data: {
            last_whatsapp_message: messageData.timestamp,
            last_message_type: messageData.type,
          },
        });
      } else {
        // Create new contact
        await this.mcpClient.callServerTool('rest_api', 'create_contact', {
          name: `WhatsApp User ${messageData.from}`,
          phone: messageData.from,
          source: 'whatsapp',
          last_whatsapp_message: messageData.timestamp,
        });
        console.log('📞 New contact created in CRM');
      }
    } catch (error) {
      console.log('⚠️ CRM sync not available:', error.message);
    }
  }

  verifySignature(req) {
    const appSecret = process.env.APP_SECRET;
    if (!appSecret) return true; // Allow while testing
    
    const sig = req.get('X-Hub-Signature-256');
    if (!sig) return false;
    
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(req.rawBody);
    const expected = 'sha256=' + hmac.digest('hex');
    
    try {
      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch {
      return false;
    }
  }

  async start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 WhatsApp MCP Webhook listening on port ${this.port}`);
      console.log(`📊 Event history available at: http://localhost:${this.port}/events`);
      console.log(`🔧 MCP management at: http://localhost:${this.port}/mcp/servers`);
    });
  }

  async stop() {
    await this.mcpClient.disconnectAll();
    console.log('🛑 WhatsApp MCP Webhook stopped');
  }
}

// Start the webhook if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const webhook = new WhatsAppMCPWebhook();
  webhook.start().catch(console.error);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await webhook.stop();
    process.exit(0);
  });
}

export default WhatsAppMCPWebhook;

