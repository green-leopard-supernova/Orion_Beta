# Orion Beta

**WhatsApp Webhook with MCP, n8n, and HubSpot Integration**

A comprehensive integration platform that connects WhatsApp Business API with HubSpot CRM, n8n workflows, and AI assistants through the Model Context Protocol (MCP).

## 🎯 **Overview**

Orion Beta serves as a central orchestration hub that enables seamless communication between:
- **Meta (WhatsApp)** - Customer communication platform
- **HubSpot** - CRM and lead management
- **n8n** - Workflow automation
- **AI Assistants** - Through MCP protocol

## 🏗️ **Architecture**

```
WhatsApp Messages → Orion Beta → HubSpot CRM
                        ↓
                   n8n Workflows
                        ↓
                   AI Assistants (via MCP)
```

## 🚀 **Features**

### Core Integration
- **WhatsApp Webhook** - Receive and process WhatsApp messages
- **HubSpot CRM** - Automatic contact management and lead qualification
- **n8n Workflows** - Advanced automation and data processing
- **MCP Protocol** - AI assistant integration

### WhatsApp Capabilities
- Send/receive text messages
- Handle button interactions
- Process media messages
- Template message support
- Contact management

### HubSpot Integration
- Automatic contact creation/updates
- Timeline event logging
- Deal creation for qualified leads
- Company management
- Custom property mapping

### MCP Tools
- Contact CRUD operations
- Deal management
- Company operations
- Timeline event creation
- Phone number lookup

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
├── Configuration
│   ├── .env.example                      # Environment template
│   └── package.json                      # Dependencies and scripts
└── Documentation
    ├── README.md                         # This file
    ├── README-MCP.md                     # MCP documentation
    └── README-HUBSPOT.md                 # HubSpot documentation
```

## 🛠️ **Setup & Installation**

### Prerequisites
- Node.js 18+ 
- WhatsApp Business API access
- HubSpot account with private app
- n8n instance (optional)
- GitHub account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Orion_Beta.git
cd Orion_Beta
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install HubSpot CLI
```bash
npm install -g @hubspot/cli@latest
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 5. HubSpot Setup
```bash
# Initialize HubSpot project
npm run hubspot:init

# Authenticate with HubSpot
npm run hubspot:auth

# Upload to HubSpot
npm run hubspot:upload
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

# MCP Server Configuration
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key
```

## 🚀 **Usage**

### Start the Integrated Webhook
```bash
npm run start:mcp
```

### Individual Components
```bash
# Original webhook only
npm start

# MCP server only
npm run mcp:server

# HubSpot MCP server
npm run mcp:hubspot

# REST API MCP server
npm run mcp:rest
```

### Development Mode
```bash
# Start with auto-reload
npm run dev:mcp

# HubSpot development
npm run hubspot:dev
```

## 🧪 **Testing**

### Run All Tests
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

## 📊 **API Endpoints**

### Webhook Endpoints
- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive WhatsApp events
- `GET /orion_beta1.0.0` - Health check

### MCP Management
- `GET /mcp/servers` - List connected MCP servers
- `POST /mcp/connect/:serverName` - Connect to MCP server
- `POST /mcp/disconnect/:serverName` - Disconnect from MCP server

### HubSpot Management
- `GET /hubspot/contacts/search` - Search contacts
- `GET /hubspot/contacts/:id` - Get contact by ID
- `POST /hubspot/contacts/find-by-phone` - Find contact by phone

### n8n Integration
- `POST /n8n/send` - Send data to n8n webhook

### Event Management
- `GET /events` - Get webhook event history

## 🔄 **Workflow Examples**

### New WhatsApp Contact
1. WhatsApp message received
2. Find/create HubSpot contact
3. Update contact activity
4. Create timeline event
5. Send to n8n workflow
6. Make available to AI assistants

### Qualified Lead
1. WhatsApp message with sales keywords
2. Find/create HubSpot contact
3. Create HubSpot deal
4. Associate deal with contact
5. Trigger n8n sales workflow
6. Notify AI assistants

### AI Assistant Request
1. AI requests contact information
2. MCP server processes request
3. Query HubSpot API
4. Return formatted data
5. AI processes and responds

## 🛡️ **Security**

### Authentication
- WhatsApp webhook signature verification
- HubSpot Bearer token authentication
- n8n webhook token validation
- MCP server access controls

### Data Protection
- Environment variable configuration
- Secure API key management
- Contact data caching
- Error handling and logging

## 📈 **Monitoring & Analytics**

### Logging
- WhatsApp message processing
- HubSpot API calls
- n8n workflow triggers
- MCP tool usage
- Error tracking

### Metrics
- Message volume
- Contact creation rate
- Deal conversion rate
- API response times
- Error rates

## 🔮 **Roadmap**

### Version 1.1.0
- [ ] Enhanced error handling
- [ ] Performance optimizations
- [ ] Additional CRM integrations
- [ ] Advanced analytics dashboard

### Version 1.2.0
- [ ] Real-time webhook processing
- [ ] Custom property mapping
- [ ] Multi-tenant support
- [ ] Advanced AI integrations

### Version 2.0.0
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced security features
- [ ] Enterprise features

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

ISC License - see LICENSE file for details

## 📞 **Support**

For issues or questions:
1. Check the documentation
2. Review test outputs
3. Check webhook logs
4. Create a GitHub issue

## 🎉 **Getting Started**

1. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/Orion_Beta.git
   cd Orion_Beta
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Test the integration**:
   ```bash
   npm run test:hubspot
   npm run test:n8n
   ```

4. **Start the webhook**:
   ```bash
   npm run start:mcp
   ```

5. **Deploy to HubSpot**:
   ```bash
   npm run hubspot:upload
   ```

Welcome to Orion Beta - your central hub for WhatsApp, HubSpot, n8n, and AI integration! 🚀
