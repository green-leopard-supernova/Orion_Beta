# Trello Power-Up Deployment Guide

This guide walks you through deploying the Orion Trello Power-Up to Vercel and configuring it with Trello.

## 🚀 **Quick Deployment**

### Step 1: Deploy to Vercel

```bash
# Navigate to Trello Power-Up directory
cd modules/trello-powerup

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Step 2: Get Your Connector URL

After deployment, Vercel will provide a URL like:
```
https://your-orion-trello.vercel.app
```

Your Trello Power-Up connector URL will be:
```
https://your-orion-trello.vercel.app/index.html
```

### Step 3: Configure Trello Power-Up

1. Go to [Trello Power-Up Admin](https://trello.com/power-ups/admin)
2. Click "Create a Power-Up"
3. Fill in the details:
   - **Name**: Orion Assistant
   - **Description**: AI-powered lead enrichment and sales assistance
   - **Iframe Connector URL**: `https://your-orion-trello.vercel.app/index.html`
4. Enable capabilities:
   - ✅ `card-buttons`
   - ✅ `card-badges`
5. Save and publish

## 🔧 **Advanced Configuration**

### Environment Variables

Set these in your Vercel dashboard:

```bash
# Optional - for production API endpoint
NODE_ENV=production
API_BASE_URL=https://your-orion-endpoint.vercel.app
```

### Custom Domain (Optional)

1. Add your custom domain in Vercel dashboard
2. Update Trello Power-Up with new connector URL
3. Update DNS records as instructed by Vercel

## 🧪 **Testing Your Deployment**

### Test the Connector URL

Visit your connector URL in a browser:
```
https://your-orion-trello.vercel.app/index.html
```

You should see a blank page (this is normal for Trello Power-Ups).

### Test the API Endpoint

```bash
curl -X POST https://your-orion-trello.vercel.app/api/trello/query \
  -H "Content-Type: application/json" \
  -d '{
    "action": "enrich",
    "card": {
      "name": "Test Lead",
      "description": "Test description"
    }
  }'
```

### Test in Trello

1. Install your Power-Up in a Trello board
2. Create a test card with lead information
3. Click the "Ask Orion" button
4. Try different actions (enrich, closing, email, coach)

## 🔗 **Integration with Orion Beta**

### Option 1: Separate Deployment (Recommended)

Deploy Trello Power-Up separately and connect to your main Orion Beta API:

```javascript
// In orion-popup.js
const apiEndpoint = "https://your-orion-endpoint.vercel.app/api/trello/query";
```

### Option 2: Integrated Deployment

Add Trello routes to your main Orion Beta server:

```javascript
// In your main server file
import trelloRouter from './modules/trello-powerup/trello-api.js';
app.use('/', trelloRouter);
```

## 📊 **Monitoring and Analytics**

### Vercel Analytics

Enable Vercel Analytics in your dashboard to monitor:
- Page views
- API requests
- Error rates
- Performance metrics

### Custom Logging

The Trello Power-Up logs all interactions:

```javascript
// Check Vercel function logs
vercel logs --follow
```

## 🚨 **Troubleshooting**

### Common Issues

1. **CORS Errors**
   - Ensure Vercel headers are configured correctly
   - Check `vercel.json` configuration

2. **API Not Responding**
   - Verify API endpoint URL
   - Check Vercel function logs
   - Test API endpoint directly

3. **Trello Power-Up Not Loading**
   - Verify connector URL is correct
   - Check Trello Power-Up capabilities
   - Ensure HTTPS is enabled

4. **HubSpot Integration Failing**
   - Verify HubSpot API key
   - Check environment variables
   - Review HubSpot integration logs

### Debug Mode

Enable debug mode by setting:
```bash
NODE_ENV=development
```

This will provide more detailed error messages.

## 🔄 **Updates and Maintenance**

### Updating the Power-Up

1. Make changes to your code
2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```
3. Test the updated functionality
4. No need to update Trello configuration

### Monitoring Performance

- Check Vercel dashboard for function performance
- Monitor API response times
- Review error logs regularly
- Set up alerts for critical failures

## 📈 **Scaling Considerations**

### High Traffic

- Vercel automatically scales functions
- Consider upgrading Vercel plan for higher limits
- Implement rate limiting if needed

### Multiple Organizations

- Each organization needs its own Power-Up installation
- Consider multi-tenant architecture for large deployments
- Use environment variables for organization-specific settings

## 🔒 **Security Best Practices**

1. **API Keys**: Store securely in Vercel environment variables
2. **CORS**: Configure proper CORS headers
3. **Rate Limiting**: Implement rate limiting for production
4. **Input Validation**: Validate all inputs from Trello
5. **Error Handling**: Don't expose sensitive information in errors

## 📞 **Support**

For issues with:
- **Vercel Deployment**: Check Vercel documentation
- **Trello Power-Up**: Review Trello Power-Up documentation
- **Orion Integration**: Check Orion Beta logs and documentation

## 🎯 **Next Steps**

After successful deployment:

1. **Test thoroughly** in different Trello boards
2. **Monitor performance** and user feedback
3. **Iterate and improve** based on usage patterns
4. **Scale as needed** for your user base
5. **Consider additional features** like real-time sync or advanced analytics
