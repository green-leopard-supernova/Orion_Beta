// Orion Beta HubSpot Serverless Function
// WhatsApp Webhook Integration

const axios = require('axios');

exports.main = async (event, callback) => {
  try {
    console.log('Orion Beta serverless function triggered');
    console.log('Event:', JSON.stringify(event, null, 2));

    // Handle different event types
    if (event.eventType === 'contact.creation') {
      await handleContactCreation(event);
    } else if (event.eventType === 'contact.propertyChange') {
      await handleContactPropertyChange(event);
    } else if (event.eventType === 'deal.creation') {
      await handleDealCreation(event);
    } else if (event.eventType === 'deal.propertyChange') {
      await handleDealPropertyChange(event);
    }

    callback({
      outputFields: {
        status: 'success',
        message: 'Event processed successfully',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in serverless function:', error);
    callback({
      outputFields: {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
};

async function handleContactCreation(event) {
  console.log('Handling contact creation event');
  
  // Get contact details
  const contactId = event.objectId;
  console.log(`New contact created: ${contactId}`);
  
  // You can add custom logic here, such as:
  // - Send welcome message via WhatsApp
  // - Create timeline event
  // - Trigger n8n workflow
}

async function handleContactPropertyChange(event) {
  console.log('Handling contact property change event');
  
  const contactId = event.objectId;
  const propertyName = event.propertyName;
  const newValue = event.propertyValue;
  
  console.log(`Contact ${contactId} property ${propertyName} changed to: ${newValue}`);
  
  // You can add custom logic here, such as:
  // - Update WhatsApp contact info
  // - Trigger specific workflows based on property changes
}

async function handleDealCreation(event) {
  console.log('Handling deal creation event');
  
  const dealId = event.objectId;
  console.log(`New deal created: ${dealId}`);
  
  // You can add custom logic here, such as:
  // - Send notification via WhatsApp
  // - Update contact timeline
  // - Trigger sales workflow
}

async function handleDealPropertyChange(event) {
  console.log('Handling deal property change event');
  
  const dealId = event.objectId;
  const propertyName = event.propertyName;
  const newValue = event.propertyValue;
  
  console.log(`Deal ${dealId} property ${propertyName} changed to: ${newValue}`);
  
  // You can add custom logic here, such as:
  // - Update deal stage notifications
  // - Trigger follow-up actions
}
