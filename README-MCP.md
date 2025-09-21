# WhatsApp Webhook with MCP Integration

This project extends the WhatsApp webhook functionality with Model Context Protocol (MCP) integration, enabling AI assistants to interact with WhatsApp and external systems like CRMs.

## Features

### MCP Server (Exposes WhatsApp to AI)
- **Send WhatsApp Messages**: Send text, template, and interactive messages
- **Retrieve Webhook Events**: Get recent WhatsApp webhook events
- **Contact Management**: Look up and manage WhatsApp contacts
- **Template Creation**: Create WhatsApp message templates

### MCP Client (Connects to External Systems)
- **CRM Integration**: Connect to Salesforce, HubSpot, and other CRMs
- **Database Access**: PostgreSQL, MongoDB integration
- **File System Access**: Secure file system operations
- **Generic REST API**: Connect to any REST API

### n8n Integration
- **Workflow Automation**: Send WhatsApp events to n8n workflows
- **Message Processing**: Process incoming messages through n8n
- **CRM Synchronization**: Sync contact data with external systems

## Architecture

```
WhatsApp Webhook → MCP Integration → AI Assistants
                    ↓
                External Systems (CRM, Database, APIs)
                    ↓
                n8n Workflows
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Configure your environment variables in `.env`

## Configuration

### Required Environment Variables

```bash
# WhatsApp Configuration
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp

# MCP Server Configuration
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key
```

### Optional Environment Variables

```bash
# CRM Integration
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
HUBSPOT_API_KEY=your_hubspot_api_key

# Database Integration
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/database
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/database
```

## Usage

### Running the Integrated Webhook

```bash
# Start the integrated webhook with MCP functionality
npm run start:mcp

# Or run directly
node webhook-mcp-integration.js
```

### Running Individual Components

```bash
# MCP Server only (for AI assistant integration)
node mcp-server.js

# REST API MCP Server
node mcp-rest-server.js

# Original webhook (without MCP)
node index.js
```

### Testing

```bash
# Test MCP server functionality
node test-mcp-server.js

# Test MCP client functionality
node test-mcp-client.js

# Test WhatsApp message sending
node test-send.js
```

## API Endpoints

### Webhook Endpoints
- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive WhatsApp events

### MCP Management
- `GET /mcp/servers` - List connected MCP servers
- `POST /mcp/connect/:serverName` - Connect to MCP server
- `POST /mcp/disconnect/:serverName` - Disconnect from MCP server

### n8n Integration
- `POST /n8n/send` - Send data to n8n webhook

### Event Management
- `GET /events` - Get webhook event history

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

## n8n Workflow Integration

### Supported Workflow Types

1. **WhatsApp Message Processor** (`whatsapp-message-processor`)
   - Processes incoming WhatsApp messages
   - Receives message data, sender info, and metadata

2. **WhatsApp Status Processor** (`whatsapp-status-processor`)
   - Handles message delivery status updates
   - Tracks message delivery, read receipts, etc.

3. **Template Status Processor** (`template-status-processor`)
   - Manages template approval status
   - Handles template quality updates

### n8n Webhook Payload Format

```json
{
  "type": "whatsapp_message",
  "message": {
    "from": "27765275317",
    "type": "text",
    "text": { "body": "Hello World" },
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "metadata": {
    "phoneNumber": "27765275317",
    "messageType": "text",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "source": "whatsapp-webhook-mcp",
  "workflowId": "whatsapp-message-processor"
}
```

## AI Assistant Integration

### Connecting to Cursor
Add to your Cursor settings:

```json
{
  "mcp": {
    "servers": {
      "whatsapp-webhook": {
        "command": "node",
        "args": ["./mcp-server.js"],
        "cwd": "/path/to/your/project"
      }
    }
  }
}
```

### Available AI Commands
- "Send a WhatsApp message to +27765275317"
- "Get recent webhook events"
- "Create a new contact in the CRM"
- "Find contact by phone number"
- "Create a WhatsApp template"

## Security Considerations

1. **Webhook Signature Verification**: Always verify WhatsApp webhook signatures in production
2. **API Key Management**: Store sensitive credentials in environment variables
3. **MCP Server Access**: Limit MCP server access to trusted AI assistants
4. **Rate Limiting**: Implement rate limiting for webhook endpoints

## Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   - Check if required environment variables are set
   - Verify API credentials are correct
   - Ensure the target API is accessible

2. **n8n Integration Not Working**
   - Verify `N8N_WEBHOOK_URL` is correct
   - Check n8n webhook is active and accessible
   - Review n8n workflow configuration

3. **WhatsApp Messages Not Sending**
   - Verify `WHATSAPP_TOKEN` and `PHONE_NUMBER_ID`
   - Check phone number format (include country code)
   - Ensure WhatsApp Business API is properly configured

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=mcp:*
```

## Development

### Adding New MCP Tools

1. Add tool definition in `mcp-server.js` or `mcp-client.js`
2. Implement tool handler function
3. Test with appropriate test script
4. Update documentation

### Adding New CRM Integrations

1. Create new MCP server configuration in `PredefinedServers`
2. Add environment variables for authentication
3. Implement CRM-specific tools
4. Test integration

## License

ISC License - see package.json for details.

