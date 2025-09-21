// Orion Beta HubSpot App
// Main application file for HubSpot integration

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// Health check
app.get('/orion_beta1.0.0', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'orion-beta',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// WhatsApp webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// WhatsApp webhook handler
app.post('/webhook', async (req, res) => {
  if (!verifySignature(req)) {
    console.warn('⚠️ Invalid signature');
    return res.sendStatus(401);
  }

  // Always respond quickly to prevent Meta retries
  res.sendStatus(200);

  try {
    await processWebhookEvent(req.body);
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
});

// HubSpot contact management endpoints
app.get('/hubspot/contacts/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    const result = await searchHubSpotContacts(query, parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/hubspot/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await getHubSpotContact(id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process WhatsApp webhook events
async function processWebhookEvent(body) {
  const change = body?.entry?.[0]?.changes?.[0];
  const field = change?.field;
  const value = change?.value;

  if (field === 'messages') {
    await handleMessages(value);
  } else if (field === 'message_template_status_update') {
    console.log('Template status update:', JSON.stringify(value));
  }
}

async function handleMessages(value) {
  if (value?.messages?.length) {
    for (const msg of value.messages) {
      await processIncomingMessage(msg);
    }
  }
}

async function processIncomingMessage(msg) {
  const from = msg.from;
  const type = msg.type;
  
  console.log(`📩 ${type} message from ${from}`);

  // Find or create HubSpot contact
  try {
    const contact = await findOrCreateHubSpotContact(from, msg);
    if (contact) {
      console.log(`✅ HubSpot contact processed: ${contact.id}`);
    }
  } catch (error) {
    console.error('❌ HubSpot contact error:', error.message);
  }
}

// HubSpot API functions
async function findOrCreateHubSpotContact(phoneNumber, messageData) {
  try {
    // First, try to find existing contact
    let contact = await findHubSpotContactByPhone(phoneNumber);
    
    if (!contact) {
      // Create new contact
      contact = await createHubSpotContact(phoneNumber, messageData);
      console.log(`📞 Created new HubSpot contact for ${phoneNumber}`);
    } else {
      console.log(`📞 Found existing HubSpot contact for ${phoneNumber}`);
    }

    // Update contact with latest activity
    await updateHubSpotContactActivity(contact.id, messageData);

    return contact;
  } catch (error) {
    console.error('Error finding/creating contact:', error.message);
    return null;
  }
}

async function findHubSpotContactByPhone(phoneNumber) {
  try {
    const searchData = {
      query: phoneNumber,
      limit: 10,
      properties: ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number', 'mobilephone', 'id'],
    };

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      searchData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Find exact phone match
    const matchingContact = response.data.results.find(contact => {
      const phoneFields = ['phone', 'whatsapp_number', 'mobilephone'];
      return phoneFields.some(field => {
        const value = contact.properties[field];
        return value && normalizePhone(value) === normalizePhone(phoneNumber);
      });
    });

    return matchingContact || null;
  } catch (error) {
    console.error('Error searching for contact:', error.message);
    return null;
  }
}

async function createHubSpotContact(phoneNumber, messageData) {
  try {
    const contactData = {
      properties: {
        whatsapp_number: phoneNumber,
        phone: phoneNumber,
        firstname: 'WhatsApp User',
        lastname: phoneNumber,
        source: 'whatsapp',
        last_whatsapp_message: new Date().toISOString(),
        ...(messageData.type && { last_message_type: messageData.type }),
      },
    };

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      contactData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error.message);
    throw error;
  }
}

async function updateHubSpotContactActivity(contactId, messageData) {
  try {
    const updateData = {
      properties: {
        last_whatsapp_message: new Date().toISOString(),
        last_message_type: messageData.type,
        ...(messageData.text && { last_message_content: messageData.text.body?.substring(0, 100) }),
      },
    };

    await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`📝 Updated HubSpot contact ${contactId} with WhatsApp activity`);
  } catch (error) {
    console.error('Error updating contact activity:', error.message);
  }
}

async function searchHubSpotContacts(query, limit) {
  try {
    const searchData = {
      query,
      limit,
      properties: ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number'],
    };

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      searchData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error searching contacts:', error.message);
    return { results: [], total: 0 };
  }
}

async function getHubSpotContact(contactId) {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting contact:', error.message);
    return null;
  }
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

function verifySignature(req) {
  const appSecret = process.env.APP_SECRET;
  if (!appSecret) return true; // Allow while testing
  
  const sig = req.get('X-Hub-Signature-256');
  if (!sig) return false;
  
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(req.rawBody);
  const expected = 'sha256=' + hmac.digest('hex');
  
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Orion Beta HubSpot App listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/orion_beta1.0.0`);
  console.log(`🔗 Webhook: http://localhost:${PORT}/webhook`);
});

module.exports = app;
