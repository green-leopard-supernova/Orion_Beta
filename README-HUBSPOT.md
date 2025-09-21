# HubSpot Integration for Orion Endpoint

This document describes the comprehensive HubSpot integration added to your Orion Endpoint project, creating a powerful central hub for Meta (WhatsApp), n8n, and HubSpot communication.

## 🎯 **Strategic Benefits**

Your Orion Endpoint project now serves as a **central orchestration hub** that connects:
- **Meta (WhatsApp)** - Customer communication
- **HubSpot** - CRM and lead management  
- **n8n** - Workflow automation
- **AI Assistants** - Through MCP protocol

## 🏗️ **Architecture Overview**

```
WhatsApp Messages → Orion Endpoint → HubSpot CRM
                        ↓
                   n8n Workflows
                        ↓
                   AI Assistants (via MCP)
```

## 📁 **New Files Added**

### Core Integration
- `hubspot-integration.js` - Direct HubSpot API integration service
- `hubspot-mcp-server.js` - MCP server exposing HubSpot to AI assistants

### Testing & Documentation
- `test-hubspot-integration.js` - Comprehensive HubSpot testing
- `README-HUBSPOT.md` - This documentation

### Updated Files
- `webhook-mcp-integration.js` - Enhanced with HubSpot integration
- `package.json` - Added HubSpot test and MCP scripts
- `env.example` - Added HubSpot configuration

## 🚀 **Key Features**

### 1. **Automatic Contact Management**
- **Find or Create**: Automatically finds existing contacts or creates new ones
- **Phone Number Matching**: Searches across phone, whatsapp_number, and mobilephone fields
- **Contact Caching**: In-memory cache for performance optimization

### 2. **WhatsApp Message Processing**
- **Timeline Events**: Every WhatsApp message creates a timeline event in HubSpot
- **Activity Tracking**: Updates contact with latest message activity
- **Message Formatting**: Properly formats different message types (text, button, image, etc.)

### 3. **Intelligent Lead Qualification**
- **Deal Creation**: Automatically creates deals for qualified leads
- **Keyword Detection**: Identifies sales intent keywords
- **Pipeline Management**: Associates deals with contacts

### 4. **MCP Integration for AI Assistants**
- **Contact Operations**: Create, read, update, search contacts
- **Deal Management**: Create and manage deals
- **Company Management**: Handle company records
- **Timeline Events**: Create custom timeline events

## 🔧 **Configuration**

### Environment Variables
Add to your `.env` file:
```bash
# HubSpot Integration
HUBSPOT_API_KEY=your_hubspot_private_app_token
```

### Getting Your HubSpot API Key
1. Go to your HubSpot account
2. Navigate to Settings → Integrations → Private Apps
3. Create a new private app
4. Grant necessary scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.companies.read`
   - `crm.objects.companies.write`
   - `timeline.events.write`
5. Copy the access token

## 📊 **API Endpoints**

### HubSpot Management
- `GET /hubspot/contacts/search?query=test&limit=10` - Search contacts
- `GET /hubspot/contacts/:id` - Get contact by ID
- `POST /hubspot/contacts/find-by-phone` - Find contact by phone number

### Existing Endpoints (Enhanced)
- `POST /webhook` - WhatsApp webhook (now includes HubSpot sync)
- `GET /events` - Event history
- `GET /mcp/servers` - MCP server management

## 🤖 **MCP Tools Available**

### Contact Management
- `create_contact` - Create new HubSpot contact
- `get_contact` - Retrieve contact by ID or email
- `update_contact` - Update contact properties
- `search_contacts` - Search contacts with query
- `get_contact_by_phone` - Find contact by phone number

### Deal Management
- `create_deal` - Create new deal
- `get_deal` - Retrieve deal by ID

### Company Management
- `create_company` - Create new company
- `get_company` - Retrieve company by ID or domain

### Timeline Events
- `create_timeline_event` - Create timeline event for contact

## 🧪 **Testing**

### Run HubSpot Tests
```bash
# Test HubSpot integration
npm run test:hubspot

# Test HubSpot MCP server
npm run mcp:hubspot
```

### Test Scenarios Covered
1. **Contact Search** - Search existing contacts
2. **Phone Lookup** - Find contacts by phone number
3. **Contact Creation** - Create new contacts from WhatsApp
4. **Message Processing** - Process WhatsApp messages
5. **Deal Creation** - Test lead qualification
6. **MCP Tools** - Test all MCP server tools

## 🔄 **Workflow Examples**

### 1. New WhatsApp Contact
```
WhatsApp Message → Find Contact → Create if New → Update Activity → Timeline Event
```

### 2. Qualified Lead
```
WhatsApp Message → Find Contact → Check Keywords → Create Deal → Associate with Contact
```

### 3. AI Assistant Integration
```
AI Request → MCP Server → HubSpot API → Return Data → AI Response
```

## 📈 **Data Flow**

### Incoming WhatsApp Message
1. **Receive** - WhatsApp webhook receives message
2. **Process** - Extract phone number and message data
3. **Find/Create** - Look up contact in HubSpot or create new
4. **Update** - Update contact with latest activity
5. **Timeline** - Create timeline event
6. **Qualify** - Check for sales keywords
7. **Deal** - Create deal if qualified
8. **n8n** - Send to n8n workflow
9. **AI** - Make available to AI assistants via MCP

### Outgoing Actions
1. **AI Request** - AI assistant requests HubSpot data
2. **MCP Call** - MCP server processes request
3. **HubSpot API** - Query HubSpot API
4. **Response** - Return data to AI assistant

## 🛡️ **Security & Best Practices**

### API Security
- Uses Bearer token authentication
- Private app tokens (not developer keys)
- Proper error handling and logging

### Data Privacy
- Phone number normalization for matching
- Contact caching for performance
- Secure credential management

### Error Handling
- Graceful degradation if HubSpot is unavailable
- Comprehensive error logging
- Fallback to other CRM systems

## 🚀 **Getting Started**

1. **Configure HubSpot**:
   ```bash
   # Add to .env file
   HUBSPOT_API_KEY=your_private_app_token
   ```

2. **Test Integration**:
   ```bash
   npm run test:hubspot
   ```

3. **Start Integrated Webhook**:
   ```bash
   npm run start:mcp
   ```

4. **Test with WhatsApp**:
   - Send a message to your WhatsApp number
   - Check HubSpot for new contact and timeline event

## 🔮 **Future Enhancements**

### Planned Features
- **Bidirectional Sync** - Update WhatsApp from HubSpot changes
- **Custom Properties** - Map WhatsApp data to custom HubSpot properties
- **Workflow Triggers** - Advanced n8n workflow triggers
- **Analytics** - Message and conversion analytics
- **Multi-tenant** - Support for multiple HubSpot accounts

### Integration Opportunities
- **Salesforce** - Add Salesforce as alternative CRM
- **Pipedrive** - Additional CRM option
- **Custom Fields** - Dynamic property mapping
- **Webhooks** - Real-time HubSpot webhook processing

## 📞 **Support**

For issues or questions:
1. Check the test output for specific errors
2. Verify HubSpot API key and permissions
3. Review webhook logs for processing details
4. Test individual components separately

Your Orion Endpoint project is now a powerful central hub that seamlessly connects WhatsApp, HubSpot, n8n, and AI assistants! 🎉
