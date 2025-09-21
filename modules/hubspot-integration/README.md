# HubSpot Integration Module

This module provides direct HubSpot CRM integration via API calls, handling contact management, deal creation, and timeline events.

## Files

- `hubspot-integration.js` - Direct HubSpot API integration service
- `hubspot-mcp-server.js` - MCP server exposing HubSpot functionality to AI assistants
- `test-hubspot-integration.js` - Comprehensive testing suite

## Features

### Contact Management
- **Find or Create** - Automatically finds existing contacts or creates new ones
- **Phone Matching** - Searches across multiple phone fields
- **Activity Updates** - Updates contact with latest WhatsApp activity
- **Contact Caching** - In-memory cache for performance

### Deal Management
- **Automatic Creation** - Creates deals for qualified leads
- **Keyword Detection** - Identifies sales intent keywords
- **Pipeline Management** - Associates deals with contacts
- **Stage Tracking** - Monitors deal progression

### Timeline Events
- **Message Logging** - Creates timeline events for all WhatsApp interactions
- **Activity Tracking** - Records contact engagement history
- **Event Metadata** - Includes message type and content

## MCP Tools Available

- `create_contact` - Create new HubSpot contact
- `get_contact` - Retrieve contact by ID or email
- `update_contact` - Update contact properties
- `search_contacts` - Search contacts with query
- `get_contact_by_phone` - Find contact by phone number
- `create_deal` - Create new deal
- `get_deal` - Retrieve deal by ID
- `create_timeline_event` - Create timeline event for contact

## Configuration

Required environment variables:
```bash
HUBSPOT_API_KEY=your_hubspot_private_app_token
```

### HubSpot Private App Setup
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create a new private app
3. Grant these scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.companies.read`
   - `crm.objects.companies.write`
   - `timeline.events.write`

## Usage

```bash
# Test HubSpot integration
node test-hubspot-integration.js

# Start MCP server for AI assistants
node hubspot-mcp-server.js
```

## API Integration

The module makes direct API calls to:
- `https://api.hubapi.com/crm/v3/objects/contacts` - Contact management
- `https://api.hubapi.com/crm/v3/objects/deals` - Deal management
- `https://api.hubapi.com/crm/v3/objects/contacts/{id}/timeline/events` - Timeline events

## Lead Qualification

Automatically creates deals when WhatsApp messages contain keywords like:
- "interested", "buy", "purchase", "price", "cost", "quote"
- "demo", "trial", "meeting", "call", "schedule", "appointment"

## Error Handling

- Graceful degradation if HubSpot is unavailable
- Comprehensive error logging
- Fallback to other CRM systems
- Contact caching for performance
