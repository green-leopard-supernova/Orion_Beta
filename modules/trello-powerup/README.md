# Trello Power-Up Module

This module provides optional Trello Power-Up integration for Orion Beta, allowing users to enrich Trello cards with AI assistance without affecting the core Orion Beta functionality.

## 🎯 **Key Features**

- **Optional Integration** - Works independently of core Orion Beta
- **Card Enrichment** - AI-powered lead analysis and suggestions
- **HubSpot Integration** - Connects Trello cards to HubSpot contacts
- **Multiple Actions** - Enrich Lead, Closing Strategy, Email Strategy, Coach Connection
- **Custom Requests** - Handle specific user requests
- **Error Resilient** - Continues working even if HubSpot/n8n are unavailable

## 📁 **File Structure**

```
modules/trello-powerup/
├── public/
│   ├── index.html          # Main Power-Up connector
│   ├── client.js           # Trello Power-Up initialization
│   ├── orion-popup.html    # User interface
│   └── orion-popup.js      # Form handling and API calls
├── trello-api.js           # API endpoint handler
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## 🚀 **Deployment Options**

### Option 1: Vercel (Recommended)
1. Deploy the `public/` folder to Vercel
2. Add the API endpoint to your main Orion Beta server
3. Get connector URL: `https://your-orion-trello.vercel.app/index.html`

### Option 2: Integrated Deployment
1. Add Trello routes to main Orion Beta server
2. Serve static files from `public/` directory
3. Use same domain as main Orion Beta

## 🔧 **Integration with Orion Beta**

The Trello Power-Up integrates with existing Orion Beta modules:

- **HubSpot Integration** - Finds/creates contacts from Trello card data
- **MCP Protocol** - Can be extended to expose Trello functionality to AI assistants
- **n8n Workflows** - Can trigger workflows based on Trello actions

## 📋 **Available Actions**

### 1. Enrich Lead
- Extracts contact information from card
- Searches HubSpot for existing contacts
- Provides lead scoring and analysis

### 2. Closing Strategy
- Analyzes urgency and deal size
- Provides personalized closing recommendations
- Suggests follow-up timelines

### 3. Email Strategy
- Determines appropriate email type
- Provides template suggestions
- Creates follow-up sequences

### 4. Connect to Coach
- Recommends appropriate coach type
- Schedules coaching sessions
- Prepares context for coach

### 5. Custom Request
- Handles specific user requests
- Provides contextual AI responses
- Adapts to unique scenarios

## ⚙️ **Configuration**

### Environment Variables
```bash
# Optional - only needed if using separate deployment
NODE_ENV=production
TRELLO_API_ENDPOINT=https://your-orion-endpoint.vercel.app/api/trello/query
```

### Trello Power-Up Setup
1. Go to Trello Power-Up Admin
2. Add Iframe Connector URL: `https://your-orion-trello.vercel.app/index.html`
3. Enable card-buttons and card-badges capabilities

## 🧪 **Testing**

### Local Testing
```bash
# Start Orion Beta server
npm run dev:mcp

# Test Trello API endpoint
curl -X POST http://localhost:3000/api/trello/query \
  -H "Content-Type: application/json" \
  -d '{"action":"enrich","card":{"name":"Test Lead","description":"Test description"}}'
```

### Production Testing
1. Deploy to Vercel
2. Test Power-Up in Trello
3. Verify API responses
4. Check HubSpot integration

## 🔒 **Security Considerations**

- **CORS Headers** - Properly configured for Trello iframe
- **Input Validation** - All inputs are validated and sanitized
- **Error Handling** - Graceful degradation if integrations fail
- **Rate Limiting** - Consider implementing rate limiting for production

## 🚨 **Error Handling**

The module is designed to be resilient:

- **HubSpot Unavailable** - Continues with basic analysis
- **API Errors** - Provides fallback responses
- **Network Issues** - Shows user-friendly error messages
- **Invalid Data** - Validates inputs and provides guidance

## 📈 **Future Enhancements**

- **Real-time Updates** - Sync Trello changes to HubSpot
- **Advanced Analytics** - Track Power-Up usage and effectiveness
- **Custom Templates** - User-defined response templates
- **Multi-language Support** - Internationalization support
- **Advanced AI** - Integration with more sophisticated AI models

## 🤝 **Contributing**

When adding new features:

1. **Maintain Independence** - Don't break core Orion Beta functionality
2. **Error Resilience** - Always provide fallback behavior
3. **Documentation** - Update this README with new features
4. **Testing** - Add tests for new functionality
5. **Backward Compatibility** - Ensure existing functionality still works
