// Test script for MCP Client functionality
import { MCPClientManager, PredefinedServers, N8nIntegration } from './mcp-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testMCPClient() {
  console.log('🧪 Testing MCP Client functionality...\n');

  const mcpClient = new MCPClientManager();
  const n8nIntegration = new N8nIntegration(mcpClient);

  try {
    // Register servers
    console.log('1. Registering MCP servers...');
    const serverConfigs = PredefinedServers.getAllConfigs();
    
    for (const [name, config] of Object.entries(serverConfigs)) {
      mcpClient.registerServer(name, config);
      console.log(`   ✅ Registered: ${name} - ${config.description}`);
    }

    // Test connecting to REST API server
    console.log('\n2. Testing connection to REST API server...');
    try {
      await mcpClient.connectToServer('rest_api');
      console.log('   ✅ Connected to REST API server');
      
      // Test getting tools
      const tools = await mcpClient.getServerTools('rest_api');
      console.log(`   📋 Available tools: ${tools.map(t => t.name).join(', ')}`);
      
    } catch (error) {
      console.log(`   ⚠️ Could not connect to REST API server: ${error.message}`);
    }

    // Test n8n integration
    console.log('\n3. Testing n8n integration...');
    try {
      const testData = {
        type: 'test_message',
        message: 'Hello from MCP client test',
        timestamp: new Date().toISOString()
      };

      const n8nResult = await n8nIntegration.sendToN8n(testData, 'test-workflow');
      
      if (n8nResult.success) {
        console.log('   ✅ Successfully sent data to n8n');
        console.log('   📊 Response:', n8nResult.data);
      } else {
        console.log('   ⚠️ n8n integration not configured or failed:', n8nResult.error);
      }
    } catch (error) {
      console.log(`   ⚠️ n8n integration error: ${error.message}`);
    }

    // Test WhatsApp message processing
    console.log('\n4. Testing WhatsApp message processing...');
    try {
      const messageData = {
        from: '27765275317',
        type: 'text',
        text: { body: 'Test message from MCP client' },
        timestamp: new Date().toISOString()
      };

      const processResult = await n8nIntegration.processWhatsAppMessage(messageData);
      
      if (processResult.success) {
        console.log('   ✅ Successfully processed WhatsApp message');
      } else {
        console.log('   ⚠️ WhatsApp message processing failed:', processResult.error);
      }
    } catch (error) {
      console.log(`   ⚠️ WhatsApp message processing error: ${error.message}`);
    }

    // List connected servers
    console.log('\n5. Connected servers:');
    const connectedServers = mcpClient.getConnectedServers();
    if (connectedServers.length > 0) {
      connectedServers.forEach(serverName => {
        const status = mcpClient.getServerStatus(serverName);
        console.log(`   📡 ${serverName}: ${status.connected ? 'Connected' : 'Disconnected'}`);
      });
    } else {
      console.log('   📡 No servers connected');
    }

    // Cleanup
    console.log('\n6. Cleaning up connections...');
    await mcpClient.disconnectAll();
    console.log('   ✅ All connections closed');

    console.log('\n🎉 All MCP client tests completed!');

  } catch (error) {
    console.error('❌ MCP client test failed:', error.message);
  }
}

testMCPClient();

