// test-webhook.js
import axios from "axios";

// Simulate a WhatsApp webhook call locally
async function testWebhookLocally() {
  try {
    console.log("🧪 Testing webhook locally...\n");
    
    // Test the webhook verification endpoint
    const verifyResponse = await axios.get('http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=orion_webhook_token&hub.challenge=test_challenge_123');
    console.log("✅ Webhook verification test:", verifyResponse.data);
    
    // Test sending a message event to the webhook
    const messageEvent = {
      object: "whatsapp_business_account",
      entry: [{
        id: "123456789",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "1234567890",
              phone_number_id: "651802014691104"
            },
            messages: [{
              from: "27765275317",
              id: "wamid.test123",
              timestamp: "1234567890",
              type: "text",
              text: {
                body: "🧪 This is a test message from local testing!"
              }
            }]
          },
          field: "messages"
        }]
      }]
    };
    
    console.log("\n📩 Sending test message event to webhook...");
    const webhookResponse = await axios.post('http://localhost:3000/webhook', messageEvent, {
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'sha256=test_signature_for_local_testing'
      }
    });
    
    console.log("✅ Webhook response status:", webhookResponse.status);
    console.log("\n🎉 Check your webhook console for the message log!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testWebhookLocally();

