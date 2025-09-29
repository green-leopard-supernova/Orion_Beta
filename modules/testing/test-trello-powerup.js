// Test file for Trello Power-Up functionality
import axios from 'axios';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Test data
const testCard = {
  id: 'test-card-123',
  name: 'High Priority Lead - John Smith',
  description: 'Interested in enterprise solution. Email: john@company.com. Phone: +1-555-0123. Urgent - needs demo this week.',
  url: 'https://trello.com/c/test-card-123'
};

const testActions = [
  'enrich',
  'closing', 
  'email',
  'coach',
  'custom'
];

async function testTrelloAPI() {
  console.log('🧪 Testing Trello Power-Up API...\n');
  
  for (const action of testActions) {
    console.log(`\n📋 Testing action: ${action}`);
    console.log('─'.repeat(50));
    
    try {
      const payload = {
        action,
        card: testCard,
        customRequest: action === 'custom' ? 'Help me understand this lead better and suggest next steps' : undefined,
        timestamp: new Date().toISOString(),
        source: 'trello-powerup-test'
      };
      
      const response = await axios.post(`${BASE_URL}/api/trello/query`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Trello-Source': 'powerup-test'
        },
        timeout: 10000
      });
      
      console.log('✅ Status:', response.status);
      console.log('📝 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📝 Error Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function testErrorHandling() {
  console.log('\n\n🔍 Testing Error Handling...\n');
  
  const errorTests = [
    {
      name: 'Missing action',
      payload: { card: testCard }
    },
    {
      name: 'Missing card',
      payload: { action: 'enrich' }
    },
    {
      name: 'Invalid action',
      payload: { action: 'invalid', card: testCard }
    },
    {
      name: 'Empty payload',
      payload: {}
    }
  ];
  
  for (const test of errorTests) {
    console.log(`\n🚨 Testing: ${test.name}`);
    console.log('─'.repeat(30));
    
    try {
      const response = await axios.post(`${BASE_URL}/api/trello/query`, test.payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log('✅ Status:', response.status);
      console.log('📝 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📝 Error Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

async function testLeadExtraction() {
  console.log('\n\n🔍 Testing Lead Information Extraction...\n');
  
  const testCards = [
    {
      name: 'Enterprise Lead - Acme Corp',
      description: 'Contact: sarah@acme.com, Phone: +1-555-9999. Budget: $50K. Decision maker: Sarah Johnson. Urgent timeline.'
    },
    {
      name: 'Small Business Inquiry',
      description: 'Startup company interested in basic plan. Email: info@startup.io. Limited budget under $1K.'
    },
    {
      name: 'Demo Request',
      description: 'Mike from TechCorp wants to see the product demo. mike@techcorp.com. Large enterprise client.'
    }
  ];
  
  for (const card of testCards) {
    console.log(`\n📋 Testing card: ${card.name}`);
    console.log('─'.repeat(40));
    
    try {
      const payload = {
        action: 'enrich',
        card: {
          id: `test-${Date.now()}`,
          name: card.name,
          description: card.description,
          url: 'https://trello.com/c/test'
        },
        timestamp: new Date().toISOString(),
        source: 'trello-powerup-test'
      };
      
      const response = await axios.post(`${BASE_URL}/api/trello/query`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      console.log('✅ Status:', response.status);
      console.log('📝 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting Trello Power-Up Tests');
  console.log('='.repeat(60));
  
  try {
    await testTrelloAPI();
    await testErrorHandling();
    await testLeadExtraction();
    
    console.log('\n\n✅ All tests completed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { testTrelloAPI, testErrorHandling, testLeadExtraction };
