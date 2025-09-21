// Test script for n8n integration with proper authentication
import { N8nIntegration } from './mcp-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testN8nIntegration() {
  console.log('🧪 Testing n8n Integration with Bearer Token Authentication...\n');

  // Check environment variables
  console.log('1. Checking environment configuration...');
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  const n8nToken = process.env.N8N_TOKEN;

  if (!n8nUrl) {
    console.error('❌ N8N_WEBHOOK_URL not configured in .env file');
    return;
  }

  if (!n8nToken) {
    console.error('❌ N8N_TOKEN not configured in .env file');
    return;
  }

  console.log(`   ✅ N8N_WEBHOOK_URL: ${n8nUrl}`);
  console.log(`   ✅ N8N_TOKEN: ${n8nToken.substring(0, 8)}...`);

  // Create n8n integration instance
  const n8nIntegration = new N8nIntegration(null);

  try {
    // Test 1: Basic webhook test
    console.log('\n2. Testing basic n8n webhook...');
    const basicTestData = {
      type: 'test_connection',
      message: 'Hello from WhatsApp MCP Integration',
      timestamp: new Date().toISOString(),
      test: true,
    };

    const basicResult = await n8nIntegration.sendToN8n(basicTestData, 'test-workflow');
    
    if (basicResult.success) {
      console.log('   ✅ Basic webhook test successful');
      console.log(`   📊 Response status: ${basicResult.status}`);
      console.log(`   📋 Response data:`, basicResult.data);
    } else {
      console.log('   ❌ Basic webhook test failed');
      console.log(`   🔍 Error: ${basicResult.error}`);
      console.log(`   📊 Status: ${basicResult.status}`);
      if (basicResult.response) {
        console.log(`   📋 Response:`, basicResult.response);
      }
    }

    // Test 2: WhatsApp message simulation
    console.log('\n3. Testing WhatsApp message processing...');
    const messageData = {
      from: '27765275317',
      type: 'text',
      text: { body: 'Test message from MCP integration' },
      timestamp: new Date().toISOString(),
    };

    const messageResult = await n8nIntegration.processWhatsAppMessage(messageData, 'whatsapp-message-processor');
    
    if (messageResult.success) {
      console.log('   ✅ WhatsApp message processing successful');
      console.log(`   📊 Response status: ${messageResult.status}`);
    } else {
      console.log('   ❌ WhatsApp message processing failed');
      console.log(`   🔍 Error: ${messageResult.error}`);
      console.log(`   📊 Status: ${messageResult.status}`);
    }

    // Test 3: CRM data processing
    console.log('\n4. Testing CRM data processing...');
    const crmData = {
      contact_id: 'test_contact_123',
      name: 'Test User',
      phone: '27765275317',
      email: 'test@example.com',
      source: 'whatsapp',
    };

    const crmResult = await n8nIntegration.processCRMData(crmData, 'crm-sync');
    
    if (crmResult.success) {
      console.log('   ✅ CRM data processing successful');
      console.log(`   📊 Response status: ${crmResult.status}`);
    } else {
      console.log('   ❌ CRM data processing failed');
      console.log(`   🔍 Error: ${crmResult.error}`);
      console.log(`   📊 Status: ${crmResult.status}`);
    }

    console.log('\n🎉 n8n integration tests completed!');

  } catch (error) {
    console.error('❌ n8n integration test failed:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Additional helper function to test different n8n endpoints
async function testN8nEndpoints() {
  console.log('\n🔧 Testing different n8n endpoint configurations...\n');

  const endpoints = [
    { name: 'Webhook URL', url: process.env.N8N_WEBHOOK_URL },
    // Add more endpoints if you have them
  ];

  for (const endpoint of endpoints) {
    if (!endpoint.url) continue;

    console.log(`Testing endpoint: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_TOKEN}`,
        },
        body: JSON.stringify({
          type: 'health_check',
          timestamp: new Date().toISOString(),
        }),
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
      
      const data = await response.text();
      console.log(`   Response: ${data.substring(0, 200)}...`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Run tests
testN8nIntegration().then(() => {
  console.log('\n' + '='.repeat(50));
  return testN8nEndpoints();
}).catch(console.error);

