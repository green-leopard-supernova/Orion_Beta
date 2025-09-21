// Test script for HubSpot integration
import HubSpotIntegration from './hubspot-integration.js';
import dotenv from 'dotenv';

dotenv.config();

async function testHubSpotIntegration() {
  console.log('🧪 Testing HubSpot Integration...\n');

  // Check environment variables
  console.log('1. Checking HubSpot configuration...');
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    console.error('❌ HUBSPOT_API_KEY not configured in .env file');
    console.log('   Please add your HubSpot API key to the .env file');
    return;
  }

  console.log(`   ✅ HUBSPOT_API_KEY: ${apiKey.substring(0, 8)}...`);

  const hubspot = new HubSpotIntegration();

  try {
    // Test 1: Search for contacts
    console.log('\n2. Testing contact search...');
    const searchResult = await hubspot.searchContacts('test', 5);
    console.log(`   📊 Found ${searchResult.total} contacts`);
    if (searchResult.results.length > 0) {
      console.log(`   📋 Sample contact: ${searchResult.results[0].properties.email || 'No email'}`);
    }

    // Test 2: Find contact by phone
    console.log('\n3. Testing phone number lookup...');
    const testPhone = '27765275317';
    const contactByPhone = await hubspot.findContactByPhone(testPhone);
    
    if (contactByPhone) {
      console.log(`   ✅ Found contact by phone: ${contactByPhone.properties.email || 'No email'}`);
    } else {
      console.log(`   ℹ️ No existing contact found for ${testPhone}`);
    }

    // Test 3: Create test contact (if not exists)
    console.log('\n4. Testing contact creation...');
    if (!contactByPhone) {
      try {
        const newContact = await hubspot.createContactFromWhatsApp(testPhone, {
          type: 'text',
          text: { body: 'Test message for contact creation' }
        });
        console.log(`   ✅ Created new contact: ${newContact.id}`);
      } catch (error) {
        console.log(`   ⚠️ Contact creation failed: ${error.message}`);
      }
    } else {
      console.log(`   ℹ️ Contact already exists, skipping creation`);
    }

    // Test 4: Process WhatsApp message
    console.log('\n5. Testing WhatsApp message processing...');
    const messageData = {
      from: testPhone,
      type: 'text',
      text: { body: 'Hello from HubSpot integration test!' },
      timestamp: new Date().toISOString()
    };

    const processResult = await hubspot.processWhatsAppMessage(messageData);
    
    if (processResult && processResult.processed) {
      console.log('   ✅ WhatsApp message processed successfully');
      console.log(`   📊 Actions taken: ${processResult.actions.join(', ')}`);
    } else {
      console.log('   ❌ WhatsApp message processing failed');
      console.log(`   🔍 Error: ${processResult?.error || 'Unknown error'}`);
    }

    // Test 5: Test deal creation trigger
    console.log('\n6. Testing deal creation trigger...');
    const dealMessageData = {
      from: testPhone,
      type: 'text',
      text: { body: 'I am interested in buying your product, can we schedule a demo?' },
      timestamp: new Date().toISOString()
    };

    const dealProcessResult = await hubspot.processWhatsAppMessage(dealMessageData);
    
    if (dealProcessResult && dealProcessResult.processed) {
      console.log('   ✅ Deal-triggering message processed');
      if (dealProcessResult.actions.includes('deal_created')) {
        console.log('   💰 Deal was created for this lead!');
      }
    }

    // Test 6: Get contact details
    console.log('\n7. Testing contact retrieval...');
    if (contactByPhone || processResult?.contact) {
      const contactId = (contactByPhone || processResult.contact).id;
      const contactDetails = await hubspot.getContact(contactId, ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number']);
      
      if (contactDetails) {
        console.log('   ✅ Contact details retrieved:');
        console.log(`   📧 Email: ${contactDetails.properties.email || 'N/A'}`);
        console.log(`   📱 Phone: ${contactDetails.properties.phone || 'N/A'}`);
        console.log(`   📱 WhatsApp: ${contactDetails.properties.whatsapp_number || 'N/A'}`);
      }
    }

    console.log('\n🎉 HubSpot integration tests completed!');

  } catch (error) {
    console.error('❌ HubSpot integration test failed:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Test HubSpot MCP Server
async function testHubSpotMCPServer() {
  console.log('\n🔧 Testing HubSpot MCP Server...\n');

  try {
    const HubSpotMCPServer = (await import('./hubspot-mcp-server.js')).default;
    const server = new HubSpotMCPServer();

    // Test contact creation
    console.log('1. Testing MCP contact creation...');
    const createResult = await server.createContact({
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      phone: '27765275317',
      whatsapp_number: '27765275317'
    });
    console.log('   ✅ MCP contact creation result:', createResult.content[0].text);

    // Test contact search
    console.log('\n2. Testing MCP contact search...');
    const searchResult = await server.searchContacts({
      query: 'test',
      limit: 5
    });
    console.log('   ✅ MCP search result:', searchResult.content[0].text.substring(0, 100) + '...');

    console.log('\n🎉 HubSpot MCP Server tests completed!');

  } catch (error) {
    console.error('❌ HubSpot MCP Server test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testHubSpotIntegration();
  console.log('\n' + '='.repeat(60));
  await testHubSpotMCPServer();
}

runAllTests().catch(console.error);
