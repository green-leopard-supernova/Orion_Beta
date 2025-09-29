import express from 'express';
import HubSpotIntegration from '../hubspot-integration/hubspot-integration.js';

const router = express.Router();

// Trello Power-Up API endpoint
router.post('/api/trello/query', async (req, res) => {
  try {
    const { action, card, customRequest, timestamp, source } = req.body;
    
    // Validate request
    if (!action || !card) {
      return res.status(400).json({
        error: 'Missing required fields: action and card',
        reply: 'Please provide both an action and card information.'
      });
    }
    
    console.log(`[Trello Power-Up] ${action} request for card: ${card.name}`);
    
    // Process different actions
    let response = await processTrelloAction(action, card, customRequest);
    
    // Log the interaction (optional - doesn't break if logging fails)
    try {
      await logTrelloInteraction(action, card, response, timestamp);
    } catch (logError) {
      console.warn('[Trello] Logging failed:', logError.message);
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('[Trello Power-Up] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      reply: 'Sorry, Orion encountered an error. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

async function processTrelloAction(action, card, customRequest) {
  const cardName = card.name || 'Untitled Card';
  const cardDescription = card.description || '';
  
  switch (action) {
    case 'enrich':
      return await enrichLead(cardName, cardDescription);
      
    case 'closing':
      return await generateClosingStrategy(cardName, cardDescription);
      
    case 'email':
      return await generateEmailStrategy(cardName, cardDescription);
      
    case 'coach':
      return await connectToCoach(cardName, cardDescription);
      
    case 'custom':
      return await handleCustomRequest(cardName, cardDescription, customRequest);
      
    default:
      return {
        reply: `Unknown action: ${action}. Available actions: enrich, closing, email, coach, custom`,
        suggestions: 'Try selecting a different action from the dropdown.'
      };
  }
}

async function enrichLead(cardName, cardDescription) {
  try {
    // Extract potential lead information
    const leadInfo = extractLeadInfo(cardName, cardDescription);
    
    // Try to find/create contact in HubSpot (optional - doesn't break if HubSpot fails)
    let hubspotContact = null;
    try {
      const hubspot = new HubSpotIntegration();
      hubspotContact = await hubspot.findOrCreateContact(leadInfo);
    } catch (hubspotError) {
      console.warn('[Trello] HubSpot integration failed:', hubspotError.message);
    }
    
    return {
      reply: `🔍 **Lead Enrichment Complete**\n\n**Card:** ${cardName}\n**Extracted Info:** ${JSON.stringify(leadInfo, null, 2)}`,
      suggestions: hubspotContact ? 
        `Contact found in HubSpot: ${hubspotContact.properties.email || 'No email'}` :
        'Consider adding more contact details to the card for better enrichment.',
      hubspotUrl: hubspotContact ? `https://app.hubspot.com/contacts/${hubspotContact.id}` : null
    };
    
  } catch (error) {
    return {
      reply: `Lead enrichment completed with basic analysis.`,
      suggestions: 'Card analyzed successfully.',
      error: error.message
    };
  }
}

async function generateClosingStrategy(cardName, cardDescription) {
  const urgency = detectUrgency(cardName, cardDescription);
  const dealSize = estimateDealSize(cardName, cardDescription);
  
  return {
    reply: `🎯 **Closing Strategy for: ${cardName}**\n\n**Urgency Level:** ${urgency}\n**Estimated Deal Size:** ${dealSize}\n\n**Recommended Actions:**\n• Schedule follow-up within 24-48 hours\n• Prepare personalized proposal\n• Identify decision makers\n• Create urgency with limited-time offers`,
    suggestions: urgency === 'High' ? 'Prioritize this lead immediately' : 'Follow standard closing timeline'
  };
}

async function generateEmailStrategy(cardName, cardDescription) {
  const emailType = determineEmailType(cardName, cardDescription);
  
  return {
    reply: `📧 **Email Strategy for: ${cardName}**\n\n**Recommended Email Type:** ${emailType}\n\n**Template Suggestions:**\n• Subject: "Quick question about [their business]"\n• Personalize based on card details\n• Include clear call-to-action\n• Follow up sequence: Day 1, Day 3, Day 7`,
    suggestions: 'Customize the email template based on the specific context in the card.'
  };
}

async function connectToCoach(cardName, cardDescription) {
  const coachType = determineCoachType(cardName, cardDescription);
  
  return {
    reply: `👨‍💼 **Coach Connection for: ${cardName}**\n\n**Recommended Coach:** ${coachType}\n\n**Next Steps:**\n• Schedule coaching session\n• Prepare specific questions\n• Share card context with coach\n• Set follow-up meeting`,
    suggestions: 'Book coaching session within 48 hours for best results.'
  };
}

async function handleCustomRequest(cardName, cardDescription, customRequest) {
  if (!customRequest) {
    return {
      reply: 'Please provide a custom request description.',
      suggestions: 'Use the text area to describe what you need help with.'
    };
  }
  
  return {
    reply: `🤖 **Custom Request Analysis**\n\n**Card:** ${cardName}\n**Request:** ${customRequest}\n\n**Orion's Response:**\nBased on the card context and your request, I recommend focusing on the key details mentioned in the card description. Consider breaking down your request into specific, actionable steps.`,
    suggestions: 'Be more specific about what outcome you\'re looking for.'
  };
}

function extractLeadInfo(cardName, cardDescription) {
  const text = `${cardName} ${cardDescription}`.toLowerCase();
  
  // Simple regex patterns to extract common lead information
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const phoneRegex = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
  const companyRegex = /(inc\.?|llc\.?|corp\.?|company|business|enterprise)/gi;
  
  return {
    emails: text.match(emailRegex) || [],
    phones: text.match(phoneRegex) || [],
    hasCompany: companyRegex.test(text),
    keywords: extractKeywords(text),
    urgency: detectUrgency(cardName, cardDescription),
    estimatedValue: estimateDealSize(cardName, cardDescription)
  };
}

function extractKeywords(text) {
  const keywords = ['urgent', 'asap', 'budget', 'decision', 'meeting', 'proposal', 'demo', 'trial'];
  return keywords.filter(keyword => text.includes(keyword));
}

function detectUrgency(cardName, cardDescription) {
  const urgentKeywords = ['urgent', 'asap', 'immediate', 'rush', 'deadline'];
  const text = `${cardName} ${cardDescription}`.toLowerCase();
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'High';
  }
  
  const moderateKeywords = ['soon', 'this week', 'priority'];
  if (moderateKeywords.some(keyword => text.includes(keyword))) {
    return 'Medium';
  }
  
  return 'Low';
}

function estimateDealSize(cardName, cardDescription) {
  const text = `${cardName} ${cardDescription}`.toLowerCase();
  
  if (text.includes('enterprise') || text.includes('large')) {
    return '$10K+';
  }
  if (text.includes('small') || text.includes('startup')) {
    return 'Under $1K';
  }
  
  return '$1K - $10K';
}

function determineEmailType(cardName, cardDescription) {
  const text = `${cardName} ${cardDescription}`.toLowerCase();
  
  if (text.includes('follow') || text.includes('check')) {
    return 'Follow-up Email';
  }
  if (text.includes('intro') || text.includes('introduction')) {
    return 'Introduction Email';
  }
  if (text.includes('proposal') || text.includes('quote')) {
    return 'Proposal Email';
  }
  
  return 'Outreach Email';
}

function determineCoachType(cardName, cardDescription) {
  const text = `${cardName} ${cardDescription}`.toLowerCase();
  
  if (text.includes('technical') || text.includes('demo')) {
    return 'Technical Coach';
  }
  if (text.includes('closing') || text.includes('negotiation')) {
    return 'Sales Coach';
  }
  if (text.includes('strategy') || text.includes('planning')) {
    return 'Strategy Coach';
  }
  
  return 'General Sales Coach';
}

async function logTrelloInteraction(action, card, response, timestamp) {
  // Optional logging - doesn't break the main flow if it fails
  const logEntry = {
    timestamp: timestamp || new Date().toISOString(),
    source: 'trello-powerup',
    action,
    cardId: card.id,
    cardName: card.name,
    responseType: response.reply ? 'success' : 'error',
    hasHubspotUrl: !!response.hubspotUrl
  };
  
  console.log('[Trello Interaction Log]:', JSON.stringify(logEntry, null, 2));
  
  // Could integrate with existing logging system here
  // For now, just console logging
}

export default router;
