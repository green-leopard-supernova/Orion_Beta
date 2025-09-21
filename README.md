# Orion Beta - Central Integration Hub

**WhatsApp Webhook with MCP, n8n, and HubSpot Integration**

A powerful central orchestration hub that connects WhatsApp Business API with HubSpot CRM, n8n workflows, and AI assistants through the Model Context Protocol (MCP).

## 🎯 **What This Does**

Orion Beta serves as a **central integration hub** that:

1. **Receives WhatsApp messages** via webhook
2. **Automatically syncs to HubSpot** - Creates/updates contacts, logs timeline events
3. **Triggers n8n workflows** - Sends structured data for automation
4. **Exposes functionality to AI assistants** - Via MCP protocol for intelligent interactions

## 🏗️ **Architecture**

```
WhatsApp Messages → Orion Beta → HubSpot CRM
                        ↓
                   n8n Workflows
                        ↓
                   AI Assistants (via MCP)
```

## 🚀 **Quick Start**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your API keys
```

### 3. Test the Integration
```bash
# Test HubSpot integration
npm run test:hubspot

# Test n8n integration  
npm run test:n8n

# Test MCP functionality
npm run test:mcp-server
```

### 4. Start the Webhook
```bash
# Start the integrated webhook
npm run start:mcp
```

## ⚙️ **Configuration**

### Required Environment Variables
```bash
# WhatsApp Configuration
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# HubSpot Integration
HUBSPOT_API_KEY=your_hubspot_private_app_token

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
N8N_TOKEN=your_n8n_token
```

## 📊 **API Endpoints**

- `GET /orion_beta1.0.0` - Health check
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - WhatsApp events (main integration point)
- `GET /mcp/servers` - MCP server management
- `GET /hubspot/contacts/search` - HubSpot contact search
- `GET /events` - Event history

## 🔄 **How It Works**

### Incoming WhatsApp Message Flow:
1. **WhatsApp webhook** receives message
2. **Find/create HubSpot contact** by phone number
3. **Update contact activity** and create timeline event
4. **Check for lead qualification** (keywords like "interested", "buy")
5. **Create HubSpot deal** if qualified
6. **Send to n8n workflow** with structured data
7. **Make available to AI assistants** via MCP

### AI Assistant Integration:
- AI assistants can request contact information
- Send WhatsApp messages programmatically
- Query HubSpot data
- Trigger n8n workflows

## 🧪 **Testing**

```bash
# Test all components
npm run test:hubspot    # HubSpot API integration
npm run test:n8n        # n8n webhook integration
npm run test:mcp-server # MCP server functionality
npm run test:mcp-client # MCP client functionality

# Test individual components
node test-send.js       # Send WhatsApp message
node test-webhook.js    # Test webhook locally
```

## 🚀 **Deployment Options**

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

### Option 3: Heroku
```bash
# Add to package.json:
"engines": {
  "node": "18.x"
}
# Then deploy via Heroku CLI
```

## 📁 **Project Structure**

```
Orion_Beta/
├── Core Webhook
│   ├── index.js                          # Original WhatsApp webhook
│   ├── webhook-mcp-integration.js        # Integrated webhook with MCP
│   └── test-send.js                      # WhatsApp message testing
├── MCP Integration
│   ├── mcp-server.js                     # WhatsApp MCP server
│   ├── mcp-client.js                     # External MCP client
│   ├── mcp-rest-server.js                # Generic REST API MCP server
│   └── hubspot-mcp-server.js             # HubSpot MCP server
├── HubSpot Integration
│   ├── hubspot-integration.js            # Direct HubSpot API service
│   └── test-hubspot-integration.js       # HubSpot testing
├── n8n Integration
│   └── test-n8n-integration.js           # n8n testing
├── Testing
│   ├── test-mcp-server.js                # MCP server tests
│   ├── test-mcp-client.js                # MCP client tests
│   └── test-webhook.js                   # Webhook testing
└── Configuration
    ├── .env.example                      # Environment template
    └── package.json                      # Dependencies and scripts
```

## 🎉 **What You Get**

- ✅ **Automatic contact management** in HubSpot
- ✅ **Timeline event logging** for all WhatsApp interactions
- ✅ **Intelligent lead qualification** and deal creation
- ✅ **n8n workflow automation** triggers
- ✅ **AI assistant integration** via MCP
- ✅ **Central orchestration hub** for all customer interactions

## 🔧 **Troubleshooting**

### Common Issues:
1. **HubSpot API errors** - Check API key and permissions
2. **WhatsApp webhook issues** - Verify webhook URL and signature
3. **n8n integration problems** - Check webhook URL and token
4. **MCP server issues** - Verify MCP SDK installation

### Debug Mode:
```bash
DEBUG=mcp:* npm run start:mcp
```

## 📞 **Support**

For issues or questions:
1. Check the test output for specific errors
2. Verify all API keys are correct
3. Review webhook logs
4. Create a GitHub issue

## 🎯 **Next Steps**

1. **Deploy to cloud service** (Vercel, Railway, etc.)
2. **Configure webhook URL** in WhatsApp Business API
3. **Set up n8n workflows** to process the data
4. **Connect AI assistants** via MCP protocol
5. **Test end-to-end flow** with real WhatsApp messages

Your Orion Beta project is ready to be your central integration hub! 🚀