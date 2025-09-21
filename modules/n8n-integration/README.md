# n8n Integration Module

This module handles integration with n8n workflow automation platform, sending structured data to trigger automated workflows.

## Files

- `test-n8n-integration.js` - Testing suite for n8n integration

## Features

- **Webhook Integration** - Sends data to n8n webhook endpoints
- **Bearer Token Authentication** - Secure communication with n8n
- **Structured Data** - Sends properly formatted payloads
- **Error Handling** - Comprehensive error management and logging
- **Multiple Workflow Support** - Different workflows for different data types

## Configuration

Required environment variables:
```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
N8N_TOKEN=your_n8n_token
```

## Supported Workflow Types

### 1. WhatsApp Message Processor (`whatsapp-message-processor`)
- Processes incoming WhatsApp messages
- Receives message data, sender info, and metadata
- Triggers customer communication workflows

### 2. WhatsApp Status Processor (`whatsapp-status-processor`)
- Handles message delivery status updates
- Tracks message delivery, read receipts, etc.
- Updates customer engagement metrics

### 3. Template Status Processor (`template-status-processor`)
- Manages template approval status
- Handles template quality updates
- Monitors template performance

### 4. CRM Data Processor (`crm-sync`)
- Processes CRM synchronization data
- Handles contact and deal updates
- Triggers follow-up workflows

## Data Payload Format

### WhatsApp Message Payload
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

### CRM Data Payload
```json
{
  "type": "crm_data",
  "data": {
    "contactId": "12345",
    "action": "created",
    "properties": { ... }
  },
  "metadata": {
    "source": "mcp-client",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "workflowId": "crm-sync"
}
```

## Usage

```bash
# Test n8n integration
node test-n8n-integration.js
```

## n8n Workflow Setup

1. **Create Webhook Node** in your n8n workflow
2. **Configure Webhook URL** to match your N8N_WEBHOOK_URL
3. **Set Authentication** to use Bearer token
4. **Process Data** based on the payload structure
5. **Trigger Actions** like sending emails, creating tasks, etc.

## Error Handling

- Timeout handling (10-second timeout)
- Authentication error handling
- Network error management
- Detailed error logging
- Graceful degradation

## Security

- Bearer token authentication
- HTTPS communication
- Request validation
- Error message sanitization

## Integration Points

This module integrates with:
- **WhatsApp Webhook** - Receives message data
- **HubSpot Integration** - Sends CRM sync data
- **MCP Protocol** - Exposes n8n functionality to AI assistants
