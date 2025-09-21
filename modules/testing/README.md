# Testing Module

This module contains comprehensive testing suites for all Orion Beta components, ensuring reliable functionality across all integrations.

## Files

- `test-mcp-server.js` - Test MCP server functionality
- `test-mcp-client.js` - Test MCP client functionality
- `test-n8n-integration.js` - Test n8n integration
- `test-hubspot-integration.js` - Test HubSpot integration
- `test-send.js` - Test WhatsApp message sending
- `test-webhook.js` - Test webhook functionality

## Test Categories

### MCP Testing
- **MCP Server Tests** - Verify WhatsApp MCP server functionality
- **MCP Client Tests** - Test external MCP server connections
- **Tool Validation** - Ensure all MCP tools work correctly

### Integration Testing
- **HubSpot Integration** - Test CRM API connections and operations
- **n8n Integration** - Verify workflow automation triggers
- **WhatsApp Integration** - Test message sending and receiving

### Webhook Testing
- **Webhook Verification** - Test webhook signature validation
- **Message Processing** - Verify message handling logic
- **Event Logging** - Test event tracking and storage

## Running Tests

### Individual Module Tests
```bash
# Test MCP functionality
node test-mcp-server.js
node test-mcp-client.js

# Test integrations
node test-hubspot-integration.js
node test-n8n-integration.js

# Test WhatsApp functionality
node test-send.js
node test-webhook.js
```

### All Tests via npm Scripts
```bash
# Test all MCP functionality
npm run test:mcp-server
npm run test:mcp-client

# Test all integrations
npm run test:hubspot
npm run test:n8n
```

## Test Scenarios

### MCP Server Tests
1. **Tool Registration** - Verify all tools are properly registered
2. **Message Sending** - Test WhatsApp message sending via MCP
3. **Event Retrieval** - Test webhook event retrieval
4. **Contact Management** - Test contact lookup and creation
5. **Error Handling** - Verify proper error responses

### HubSpot Integration Tests
1. **API Connection** - Test HubSpot API connectivity
2. **Contact Operations** - Test contact CRUD operations
3. **Deal Creation** - Test automatic deal creation
4. **Timeline Events** - Test timeline event creation
5. **Phone Matching** - Test contact lookup by phone

### n8n Integration Tests
1. **Webhook Connectivity** - Test n8n webhook connection
2. **Authentication** - Verify Bearer token authentication
3. **Data Payload** - Test payload structure and content
4. **Workflow Triggers** - Test different workflow types
5. **Error Handling** - Test timeout and error scenarios

### WhatsApp Tests
1. **Message Sending** - Test message delivery
2. **Webhook Processing** - Test incoming message handling
3. **Signature Verification** - Test webhook security
4. **Event Logging** - Test event tracking

## Test Configuration

### Environment Setup
Tests require the same environment variables as the main application:
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

### Test Data
- Uses test phone number: `27765275317`
- Creates test contacts and messages
- Uses safe test data that won't affect production

## Expected Test Results

### Successful Tests
- ✅ All API connections established
- ✅ Messages sent successfully
- ✅ Contacts created/updated in HubSpot
- ✅ n8n workflows triggered
- ✅ MCP tools functioning correctly

### Common Test Issues
- **API Key Errors** - Check environment variables
- **Network Timeouts** - Verify internet connectivity
- **Permission Errors** - Check API scopes and permissions
- **Webhook Issues** - Verify webhook URLs and tokens

## Debugging Tests

### Enable Debug Mode
```bash
DEBUG=mcp:* node test-mcp-server.js
DEBUG=hubspot:* node test-hubspot-integration.js
```

### Verbose Output
Most tests provide detailed output including:
- API request/response details
- Error messages and stack traces
- Performance metrics
- Success/failure indicators

## Continuous Integration

Tests are designed to run in CI/CD environments:
- No interactive prompts
- Clear success/failure indicators
- Detailed error reporting
- Environment variable validation
