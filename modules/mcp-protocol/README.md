# MCP Protocol Module

This module implements the Model Context Protocol (MCP) to expose functionality to AI assistants, enabling intelligent interactions with the Orion Beta system.

## Files

- `mcp-server.js` - WhatsApp MCP server exposing webhook functionality
- `mcp-client.js` - MCP client for connecting to external MCP servers
- `mcp-rest-server.js` - Generic REST API MCP server

## Features

### MCP Server (Exposes WhatsApp to AI)
- **Send WhatsApp Messages** - AI can send messages programmatically
- **Retrieve Webhook Events** - Get recent WhatsApp activity
- **Contact Management** - Look up and manage WhatsApp contacts
- **Template Creation** - Create WhatsApp message templates

### MCP Client (Connects to External Systems)
- **CRM Integration** - Connect to Salesforce, HubSpot, and other CRMs
- **Database Access** - PostgreSQL, MongoDB integration
- **File System Access** - Secure file system operations
- **Generic REST API** - Connect to any REST API

### REST API MCP Server
- **Generic HTTP Requests** - Make requests to any API
- **Contact Operations** - CRUD operations for contacts
- **Search Functionality** - Find contacts by various criteria
- **Custom Headers** - Support for authentication and custom headers

## MCP Tools Available

### WhatsApp Tools (MCP Server)
- `send_whatsapp_message` - Send messages to WhatsApp
- `get_webhook_events` - Retrieve recent webhook events
- `get_contact_info` - Get WhatsApp contact information
- `create_whatsapp_template` - Create message templates

### CRM Tools (MCP Client)
- `get_contacts` - Retrieve contacts from CRM
- `create_contact` - Create new contact
- `update_contact` - Update existing contact
- `get_contact_by_phone` - Find contact by phone number

### REST API Tools
- `make_api_request` - Make generic HTTP requests
- `get_contacts` - Get contacts from API
- `create_contact` - Create contact via API
- `update_contact` - Update contact via API
- `get_contact_by_phone` - Find contact by phone

## Configuration

### MCP Server Configuration
```bash
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
```

### MCP Client Configuration
```bash
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key

# CRM Integration
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
HUBSPOT_API_KEY=your_hubspot_api_key

# Database Integration
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/database
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/database
```

## Usage

### Start MCP Servers
```bash
# WhatsApp MCP Server
node mcp-server.js

# REST API MCP Server
node mcp-rest-server.js
```

### AI Assistant Integration

Connect to Cursor by adding to settings:
```json
{
  "mcp": {
    "servers": {
      "whatsapp-webhook": {
        "command": "node",
        "args": ["./modules/mcp-protocol/mcp-server.js"],
        "cwd": "/path/to/Orion_Beta"
      }
    }
  }
}
```

## Available AI Commands

- "Send a WhatsApp message to +27765275317"
- "Get recent webhook events"
- "Create a new contact in the CRM"
- "Find contact by phone number"
- "Create a WhatsApp template"
- "Make API request to external service"

## Transport Protocols

- **Stdio** - Standard input/output for local development
- **HTTP** - REST API for remote connections
- **WebSockets** - Real-time communication (future)

## Security Considerations

- **Authentication** - Proper API key management
- **Authorization** - Scope-based access control
- **Rate Limiting** - Prevent abuse of external APIs
- **Input Validation** - Sanitize all inputs
- **Error Handling** - Secure error messages

## Integration Points

This module integrates with:
- **WhatsApp Webhook** - Exposes webhook functionality to AI
- **HubSpot Integration** - Provides CRM access to AI
- **n8n Integration** - Enables workflow automation via AI
- **External APIs** - Connects to any REST API
