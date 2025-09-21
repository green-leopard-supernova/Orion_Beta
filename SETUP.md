# Orion Beta Setup Guide

This guide will help you set up the complete Orion Beta integration with WhatsApp, HubSpot, n8n, and MCP.

## 🚀 **Quick Start**

### 1. Prerequisites
- Node.js 18+
- GitHub account
- HubSpot account
- WhatsApp Business API access
- n8n instance (optional)

### 2. Clone and Install
```bash
git clone https://github.com/yourusername/Orion_Beta.git
cd Orion_Beta
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. HubSpot Setup
```bash
# Install HubSpot CLI globally
npm i -g @hubspot/cli

# Initialize HubSpot project
hs init

# Authenticate with HubSpot
hs auth

# Upload to HubSpot
hs project upload
```

## 🔑 **Required API Keys**

### HubSpot API Key
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create a new private app
3. Grant these scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.companies.read`
   - `crm.objects.companies.write`
   - `timeline.events.write`
4. Copy the Access Token

### WhatsApp API Key
1. Go to Meta for Developers
2. Create a WhatsApp Business app
3. Get your Access Token and Phone Number ID

### n8n Webhook (Optional)
1. Create a webhook in your n8n instance
2. Copy the webhook URL and token

## ⚙️ **Environment Variables**

Create a `.env` file with:

```bash
# WhatsApp Configuration
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
PORT=3000

# HubSpot Integration
HUBSPOT_API_KEY=your_hubspot_private_app_token

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
N8N_TOKEN=your_n8n_token

# MCP Server Configuration
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key
```

## 🧪 **Testing**

### Test All Components
```bash
# Test MCP functionality
npm run test:mcp-server
npm run test:mcp-client

# Test integrations
npm run test:n8n
npm run test:hubspot
```

### Test Individual Components
```bash
# Test WhatsApp sending
node test-send.js

# Test webhook
node test-webhook.js
```

## 🚀 **Running the Application**

### Start Integrated Webhook
```bash
npm run start:mcp
```

### Development Mode
```bash
npm run dev:mcp
```

### Individual Components
```bash
# Original webhook only
npm start

# MCP server only
npm run mcp:server

# HubSpot MCP server
npm run mcp:hubspot
```

## 📊 **API Endpoints**

Once running, you'll have these endpoints:

- `GET /orion_beta1.0.0` - Health check
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - WhatsApp events (with full integration)
- `GET /mcp/servers` - MCP server management
- `GET /hubspot/contacts/search` - HubSpot contact search
- `GET /events` - Event history

## 🔄 **Workflow**

### Incoming WhatsApp Message
1. WhatsApp webhook receives message
2. Find/create HubSpot contact
3. Update contact activity
4. Create timeline event
5. Check for lead qualification
6. Create deal if qualified
7. Send to n8n workflow
8. Make available to AI assistants

### AI Assistant Request
1. AI requests data via MCP
2. MCP server processes request
3. Query appropriate API (HubSpot, WhatsApp, etc.)
4. Return formatted data
5. AI processes and responds

## 🛠️ **HubSpot Integration**

### Automatic Features
- **Contact Management**: Auto-create/update contacts
- **Timeline Events**: Log all WhatsApp interactions
- **Lead Qualification**: Auto-create deals for qualified leads
- **Phone Matching**: Find contacts by phone number

### MCP Tools Available
- `create_contact` - Create HubSpot contact
- `get_contact` - Get contact by ID/email
- `update_contact` - Update contact properties
- `search_contacts` - Search contacts
- `create_deal` - Create deal
- `create_timeline_event` - Log activity

## 🔧 **Troubleshooting**

### Common Issues

1. **HubSpot API Errors**
   - Check API key and permissions
   - Verify scopes are granted
   - Check rate limits

2. **WhatsApp Webhook Issues**
   - Verify webhook URL is accessible
   - Check signature verification
   - Ensure proper response format

3. **n8n Integration Problems**
   - Verify webhook URL and token
   - Check n8n workflow is active
   - Review webhook payload format

4. **MCP Server Issues**
   - Check MCP SDK installation
   - Verify server configuration
   - Review tool definitions

### Debug Mode
```bash
DEBUG=mcp:* npm run start:mcp
```

## 📈 **Monitoring**

### Logs
- WhatsApp message processing
- HubSpot API calls
- n8n workflow triggers
- MCP tool usage
- Error tracking

### Health Checks
- `GET /orion_beta1.0.0` - Basic health
- `GET /mcp/servers` - MCP server status
- `GET /events` - Recent activity

## 🚀 **Deployment**

### GitHub Actions
The project includes automated deployment via GitHub Actions:
- Runs tests on every push
- Deploys to HubSpot on main branch
- Notifies on deployment status

### Manual Deployment
```bash
# Deploy to HubSpot
npm run hubspot:upload

# Deploy with HubSpot CLI
hs project deploy
```

## 📞 **Support**

For issues or questions:
1. Check the logs for errors
2. Verify all API keys are correct
3. Test individual components
4. Review the documentation
5. Create a GitHub issue

## 🎉 **Success!**

Once everything is set up, you'll have:
- ✅ WhatsApp webhook processing
- ✅ HubSpot CRM integration
- ✅ n8n workflow automation
- ✅ AI assistant integration via MCP
- ✅ Central orchestration hub

Your Orion Beta project is now ready to handle the complete customer journey from WhatsApp to CRM to AI! 🚀
