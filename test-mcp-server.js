// Test script for MCP Server functionality
import WhatsAppMCPServer from './mcp-server.js';
import dotenv from 'dotenv';

dotenv.config();

async function testMCPServer() {
  console.log('🧪 Testing WhatsApp MCP Server...\n');

  try {
    // Test sending a WhatsApp message
    console.log('1. Testing send_whatsapp_message tool...');
    const server = new WhatsAppMCPServer();
    
    // Simulate tool call
    const sendResult = await server.sendWhatsAppMessage({
      to: '27765275317',
      message: 'Test message from MCP server',
      type: 'text'
    });
    
    console.log('✅ Send message result:', sendResult);

    // Test getting webhook events
    console.log('\n2. Testing get_webhook_events tool...');
    const eventsResult = await server.getWebhookEvents({
      limit: 5,
      event_type: 'messages'
    });
    
    console.log('✅ Events result:', eventsResult);

    // Test contact info
    console.log('\n3. Testing get_contact_info tool...');
    const contactResult = await server.getContactInfo({
      phone_number: '27765275317'
    });
    
    console.log('✅ Contact result:', contactResult);

    console.log('\n🎉 All MCP server tests completed successfully!');

  } catch (error) {
    console.error('❌ MCP server test failed:', error.message);
  }
}

testMCPServer();

