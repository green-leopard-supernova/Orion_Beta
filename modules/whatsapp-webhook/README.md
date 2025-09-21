# WhatsApp Webhook Module

This module handles WhatsApp Business API webhook integration, receiving and processing incoming messages.

## Files

- `index.js` - Original WhatsApp webhook implementation
- `webhook-mcp-integration.js` - Integrated webhook with MCP functionality

## Features

- **Webhook Verification** - Validates WhatsApp webhook requests
- **Message Processing** - Handles text, button, image, and other message types
- **Signature Verification** - Ensures webhook authenticity
- **Event Logging** - Tracks all incoming messages
- **Health Check** - Provides status endpoint

## API Endpoints

- `GET /orion_beta1.0.0` - Health check endpoint
- `GET /webhook` - Webhook verification
- `POST /webhook` - Main webhook handler for incoming messages

## Configuration

Required environment variables:
```bash
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
APP_SECRET=your_webhook_app_secret
```

## Usage

```bash
# Start the webhook
node index.js

# Start integrated webhook with MCP
node webhook-mcp-integration.js
```

## Message Types Supported

- **Text messages** - Plain text content
- **Button responses** - Interactive button clicks
- **Media messages** - Images, documents, audio, video
- **Template messages** - Pre-approved message templates
- **Status updates** - Delivery and read receipts

## Integration Points

This module integrates with:
- **HubSpot Integration** - Sends contact data for CRM sync
- **n8n Integration** - Triggers workflow automation
- **MCP Protocol** - Exposes functionality to AI assistants
