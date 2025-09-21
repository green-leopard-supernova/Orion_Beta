// HubSpot Integration Service - Direct integration with WhatsApp webhook
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class HubSpotIntegration {
  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY;
    this.baseUrl = 'https://api.hubapi.com';
    this.contactCache = new Map(); // Simple cache for contact lookups
  }

  async makeRequest(method, endpoint, data = null, params = {}) {
    if (!this.apiKey) {
      throw new Error('HubSpot API key not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      params,
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('HubSpot API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Find or create contact by WhatsApp phone number
  async findOrCreateContactByPhone(phoneNumber, messageData = {}) {
    try {
      // First, try to find existing contact by phone
      let contact = await this.findContactByPhone(phoneNumber);
      
      if (!contact) {
        // Create new contact
        contact = await this.createContactFromWhatsApp(phoneNumber, messageData);
        console.log(`📞 Created new HubSpot contact for ${phoneNumber}`);
      } else {
        console.log(`📞 Found existing HubSpot contact for ${phoneNumber}`);
      }

      return contact;
    } catch (error) {
      console.error('Error finding/creating contact:', error.message);
      return null;
    }
  }

  // Find contact by phone number
  async findContactByPhone(phoneNumber) {
    const cacheKey = `phone_${phoneNumber}`;
    
    // Check cache first
    if (this.contactCache.has(cacheKey)) {
      return this.contactCache.get(cacheKey);
    }

    try {
      const searchData = {
        query: phoneNumber,
        limit: 10,
        properties: ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number', 'mobilephone', 'id'],
      };

      const result = await this.makeRequest('POST', '/crm/v3/objects/contacts/search', searchData);

      // Find exact phone match
      const matchingContact = result.results.find(contact => {
        const phoneFields = ['phone', 'whatsapp_number', 'mobilephone'];
        return phoneFields.some(field => {
          const value = contact.properties[field];
          return value && this.normalizePhone(value) === this.normalizePhone(phoneNumber);
        });
      });

      if (matchingContact) {
        this.contactCache.set(cacheKey, matchingContact);
        return matchingContact;
      }

      return null;
    } catch (error) {
      console.error('Error searching for contact:', error.message);
      return null;
    }
  }

  // Create contact from WhatsApp message data
  async createContactFromWhatsApp(phoneNumber, messageData = {}) {
    try {
      const contactData = {
        properties: {
          whatsapp_number: phoneNumber,
          phone: phoneNumber,
          firstname: `WhatsApp User`,
          lastname: phoneNumber,
          source: 'whatsapp',
          last_whatsapp_message: new Date().toISOString(),
          ...(messageData.type && { last_message_type: messageData.type }),
        },
      };

      const result = await this.makeRequest('POST', '/crm/v3/objects/contacts', contactData);
      
      // Cache the new contact
      this.contactCache.set(`phone_${phoneNumber}`, result);
      
      return result;
    } catch (error) {
      console.error('Error creating contact:', error.message);
      throw error;
    }
  }

  // Update contact with latest WhatsApp activity
  async updateContactActivity(contactId, messageData) {
    try {
      const updateData = {
        properties: {
          last_whatsapp_message: new Date().toISOString(),
          last_message_type: messageData.type,
          ...(messageData.text && { last_message_content: messageData.text.body?.substring(0, 100) }),
        },
      };

      await this.makeRequest('PATCH', `/crm/v3/objects/contacts/${contactId}`, updateData);
      console.log(`📝 Updated HubSpot contact ${contactId} with WhatsApp activity`);
    } catch (error) {
      console.error('Error updating contact activity:', error.message);
    }
  }

  // Create timeline event for WhatsApp message
  async createWhatsAppTimelineEvent(contactId, messageData) {
    try {
      const eventData = {
        eventType: 'whatsapp_message',
        subject: `WhatsApp Message from ${messageData.from}`,
        body: this.formatMessageBody(messageData),
        properties: {
          hs_timestamp: Date.now(),
          message_type: messageData.type,
          whatsapp_from: messageData.from,
        },
      };

      await this.makeRequest('POST', `/crm/v3/objects/contacts/${contactId}/timeline/events`, eventData);
      console.log(`📅 Created timeline event for contact ${contactId}`);
    } catch (error) {
      console.error('Error creating timeline event:', error.message);
    }
  }

  // Create deal for qualified leads
  async createDealForContact(contactId, dealData = {}) {
    try {
      const deal = {
        properties: {
          dealname: `WhatsApp Lead - ${new Date().toLocaleDateString()}`,
          dealstage: 'appointmentscheduled',
          pipeline: 'default',
          amount: '0',
          source: 'whatsapp',
          ...dealData,
        },
      };

      const result = await this.makeRequest('POST', '/crm/v3/objects/deals', deal);

      // Associate with contact
      await this.makeRequest('PUT', `/crm/v3/objects/deals/${result.id}/associations/contacts/${contactId}`, {
        inputs: [{ from: { id: result.id }, to: { id: contactId }, type: 'deal_to_contact' }]
      });

      console.log(`💰 Created deal ${result.id} for contact ${contactId}`);
      return result;
    } catch (error) {
      console.error('Error creating deal:', error.message);
      throw error;
    }
  }

  // Process incoming WhatsApp message
  async processWhatsAppMessage(messageData) {
    try {
      const phoneNumber = messageData.from;
      
      // Find or create contact
      const contact = await this.findOrCreateContactByPhone(phoneNumber, messageData);
      
      if (!contact) {
        console.log('❌ Could not find or create contact for', phoneNumber);
        return null;
      }

      // Update contact activity
      await this.updateContactActivity(contact.id, messageData);

      // Create timeline event
      await this.createWhatsAppTimelineEvent(contact.id, messageData);

      // Check if this should create a deal (e.g., specific keywords)
      if (this.shouldCreateDeal(messageData)) {
        await this.createDealForContact(contact.id, {
          dealname: `WhatsApp Lead - ${messageData.text?.body?.substring(0, 50) || 'New Lead'}`,
        });
      }

      return {
        contact,
        processed: true,
        actions: ['contact_updated', 'timeline_event_created'],
      };
    } catch (error) {
      console.error('Error processing WhatsApp message:', error.message);
      return { processed: false, error: error.message };
    }
  }

  // Check if message should trigger deal creation
  shouldCreateDeal(messageData) {
    if (messageData.type !== 'text' || !messageData.text?.body) {
      return false;
    }

    const body = messageData.text.body.toLowerCase();
    const dealKeywords = [
      'interested', 'buy', 'purchase', 'price', 'cost', 'quote',
      'demo', 'trial', 'meeting', 'call', 'schedule', 'appointment'
    ];

    return dealKeywords.some(keyword => body.includes(keyword));
  }

  // Format message body for timeline
  formatMessageBody(messageData) {
    switch (messageData.type) {
      case 'text':
        return `Text: ${messageData.text?.body || 'No content'}`;
      case 'button':
        return `Button: ${messageData.button?.text || 'Button clicked'}`;
      case 'image':
        return `Image: ${messageData.image?.caption || 'Image sent'}`;
      case 'document':
        return `Document: ${messageData.document?.filename || 'Document sent'}`;
      default:
        return `${messageData.type} message received`;
    }
  }

  // Normalize phone number for comparison
  normalizePhone(phone) {
    return phone.replace(/\D/g, '');
  }

  // Get contact by ID
  async getContact(contactId, properties = []) {
    try {
      const params = properties.length > 0 ? { properties: properties.join(',') } : {};
      return await this.makeRequest('GET', `/crm/v3/objects/contacts/${contactId}`, null, params);
    } catch (error) {
      console.error('Error getting contact:', error.message);
      return null;
    }
  }

  // Search contacts
  async searchContacts(query, limit = 10) {
    try {
      const searchData = {
        query,
        limit,
        properties: ['email', 'firstname', 'lastname', 'phone', 'whatsapp_number'],
      };

      return await this.makeRequest('POST', '/crm/v3/objects/contacts/search', searchData);
    } catch (error) {
      console.error('Error searching contacts:', error.message);
      return { results: [], total: 0 };
    }
  }

  // Clear cache
  clearCache() {
    this.contactCache.clear();
  }
}

export default HubSpotIntegration;
