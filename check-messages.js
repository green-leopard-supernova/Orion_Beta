

// check-messages.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

async function checkWebhookStatus() {
  try {
    console.log("🔌 Checking webhook configuration...\n");
    
    // Check if we can access the phone number (this verifies our token works)
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${phoneNumberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          fields: 'id,verified_name,code_verification_status,quality_rating'
        }
      }
    );

    console.log("✅ WhatsApp Business Phone Number Status:");
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.verified_name || 'Not verified'}`);
    console.log(`   Verification: ${response.data.code_verification_status || 'Unknown'}`);
    console.log(`   Quality: ${response.data.quality_rating || 'Unknown'}`);

  } catch (error) {
    console.error("❌ Error checking phone number status:", error.response?.data || error.message);
  }
}

async function checkRecentActivity() {
  try {
    console.log("\n📊 Checking recent activity...\n");
    
    // Note: WhatsApp Business API doesn't provide direct access to message history
    // Messages are only received via webhook in real-time
    console.log("ℹ️ WhatsApp Business API provides messages only via webhook");
    console.log("ℹ️ To see incoming messages, check your webhook console logs");
    console.log("ℹ️ Your webhook is currently running and logging all activity");
    
    // Check if webhook is accessible locally
    try {
      const webhookResponse = await axios.get('http://localhost:3000/orion_beta1.0.0');
      console.log(`✅ Local webhook is running: ${webhookResponse.data}`);
    } catch (webhookError) {
      console.log("❌ Local webhook is not accessible");
    }

  } catch (error) {
    console.error("❌ Error checking activity:", error.message);
  }
}

// Run checks
async function main() {
  await checkWebhookStatus();
  await checkRecentActivity();
  
  console.log("\n" + "=".repeat(60));
  console.log("💡 TIP: To see incoming messages in real-time:");
  console.log("   1. Keep your webhook running (npm start)");
  console.log("   2. Send a message to your WhatsApp number");
  console.log("   3. Watch the console for incoming message logs");
  console.log("   4. Messages are logged with timestamps and details");
  console.log("=".repeat(60));
}

main();
