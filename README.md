# Orion Beta - Central Integration Hub

**WhatsApp Webhook with MCP, n8n, and HubSpot Integration**

A powerful, modular central orchestration hub that connects WhatsApp Business API with HubSpot CRM, n8n workflows, and AI assistants through the Model Context Protocol (MCP).

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

## 📁 **Project Structure**

```
Orion_Beta/
├── modules/
│   ├── whatsapp-webhook/          # WhatsApp Business API integration
│   │   ├── index.js               # Original webhook implementation
│   │   ├── webhook-mcp-integration.js  # Integrated webhook with MCP
│   │   └── README.md              # WhatsApp module documentation
│   ├── hubspot-integration/       # HubSpot CRM integration
│   │   ├── hubspot-integration.js # Direct HubSpot API service
│   │   ├── hubspot-mcp-server.js  # HubSpot MCP server for AI
│   │   ├── test-hubspot-integration.js  # HubSpot testing
│   │   └── README.md              # HubSpot module documentation
│   ├── n8n-integration/           # n8n workflow automation
│   │   ├── test-n8n-integration.js  # n8n testing
│   │   └── README.md              # n8n module documentation
│   ├── mcp-protocol/              # Model Context Protocol
│   │   ├── mcp-server.js          # WhatsApp MCP server
│   │   ├── mcp-client.js          # External MCP client
│   │   ├── mcp-rest-server.js     # Generic REST API MCP server
│   │   └── README.md              # MCP module documentation
│   └── testing/                   # Comprehensive testing suite
│       ├── test-*.js              # All test files
│       └── README.md              # Testing documentation
├── .env.example                   # Environment configuration template
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🚀 **Quick Start**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your API keys (see Configuration section)
```

### 3. Test the Integration
```bash
# Test all components
npm run test:hubspot    # HubSpot integration
npm run test:n8n        # n8n integration
npm run test:mcp-server # MCP server functionality
npm run test:whatsapp   # WhatsApp message sending
```

### 4. Start the Webhook
```bash
# Start the integrated webhook (recommended)
npm run start:mcp

# Or start the basic webhook
npm start
```

## ⚙️ **Configuration**

### Required Environment Variables
```bash
# WhatsApp Configuration
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
APP_SECRET=your_webhook_app_secret

# HubSpot Integration
HUBSPOT_API_KEY=your_hubspot_private_app_token

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
N8N_TOKEN=your_n8n_token

# MCP Server Configuration (optional)
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key
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

### Run All Tests
```bash
npm run test:hubspot    # HubSpot API integration
npm run test:n8n        # n8n webhook integration
npm run test:mcp-server # MCP server functionality
npm run test:mcp-client # MCP client functionality
npm run test:whatsapp   # WhatsApp message sending
npm run test:webhook    # Webhook functionality
```

### Individual Module Testing
Each module has its own comprehensive test suite. See individual README files in the `modules/` directory for detailed testing instructions.

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

## 🎉 **What You Get**

- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Automatic contact management** in HubSpot
- ✅ **Timeline event logging** for all WhatsApp interactions
- ✅ **Intelligent lead qualification** and deal creation
- ✅ **n8n workflow automation** triggers
- ✅ **AI assistant integration** via MCP
- ✅ **Central orchestration hub** for all customer interactions
- ✅ **Comprehensive testing** for all modules
- ✅ **Detailed documentation** for each component

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

### Module-Specific Help:
Each module has detailed documentation and troubleshooting guides in their respective README files.

## 📞 **Support**

For issues or questions:
1. Check the individual module README files
2. Run the test suites to identify specific issues
3. Verify all API keys are correct
4. Review webhook logs
5. Create a GitHub issue

## 🎯 **Next Steps**

1. **Configure environment variables** in `.env`
2. **Run tests** to verify all integrations work
3. **Deploy to cloud service** (Vercel, Railway, etc.)
4. **Configure webhook URL** in WhatsApp Business API
5. **Set up n8n workflows** to process the data
6. **Connect AI assistants** via MCP protocol
7. **Test end-to-end flow** with real WhatsApp messages

## 📚 **Module Documentation**

- [WhatsApp Webhook Module](modules/whatsapp-webhook/README.md)
- [HubSpot Integration Module](modules/hubspot-integration/README.md)
- [n8n Integration Module](modules/n8n-integration/README.md)
- [MCP Protocol Module](modules/mcp-protocol/README.md)
- [Testing Module](modules/testing/README.md)

Your Orion Beta project is ready to be your central integration hub! 🚀