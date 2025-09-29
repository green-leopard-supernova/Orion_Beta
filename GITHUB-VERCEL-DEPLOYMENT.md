# GitHub + Vercel Deployment Guide

This guide walks you through deploying the Orion Trello Power-Up using GitHub and Vercel integration.

## 🚀 **Deployment Options**

You have two deployment options:

### Option 1: Deploy Entire Orion Beta (Recommended)
Deploy the complete Orion Beta project with Trello Power-Up integrated.

### Option 2: Deploy Only Trello Power-Up
Deploy just the Trello Power-Up module as a standalone service.

## 📋 **Prerequisites**

- GitHub repository: `https://github.com/green-leopard-supernova/Orion_Beta.git`
- Vercel account (free tier works fine)
- GitHub account connected to Vercel

## 🔧 **Option 1: Deploy Entire Orion Beta**

### Step 1: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `green-leopard-supernova/Orion_Beta`
4. Select the repository

### Step 2: Configure Project Settings

**Project Name:** `orion-beta` (or your preferred name)

**Framework Preset:** Other

**Root Directory:** `.` (leave as default)

**Build Command:** `npm install`

**Output Directory:** Leave empty (not needed for Node.js API)

**Install Command:** `npm install`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

```bash
# WhatsApp Configuration
VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
PORT=3000

# HubSpot Integration
HUBSPOT_API_KEY=your_hubspot_private_app_token

# n8n Integration (Optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
N8N_TOKEN=your_n8n_token

# MCP Server Configuration
API_BASE_URL=https://your-api.com/api/v1
API_KEY=your_api_key

# Production Settings
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your Trello Power-Up will be available at:
   ```
   https://your-project-name.vercel.app/modules/trello-powerup/public/index.html
   ```

### Step 5: Configure Trello Power-Up

1. Go to [Trello Power-Up Admin](https://trello.com/power-ups/admin)
2. Create new Power-Up with connector URL:
   ```
   https://your-project-name.vercel.app/modules/trello-powerup/public/index.html
   ```

## 🎯 **Option 2: Deploy Only Trello Power-Up**

### Step 1: Create Separate Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `green-leopard-supernova/Orion_Beta`

### Step 2: Configure for Trello Power-Up Only

**Project Name:** `orion-trello-powerup`

**Framework Preset:** Other

**Root Directory:** `modules/trello-powerup`

**Build Command:** `npm install`

**Output Directory:** Leave empty

**Install Command:** `npm install`

### Step 3: Environment Variables

```bash
NODE_ENV=production
HUBSPOT_API_KEY=your_hubspot_private_app_token
```

### Step 4: Deploy

1. Click "Deploy"
2. Your Trello Power-Up will be available at:
   ```
   https://orion-trello-powerup.vercel.app/index.html
   ```

## 🔗 **GitHub Integration Benefits**

### Automatic Deployments
- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments
- **Branch deployments** → Test different versions

### Version Control
- **Git history** → Track all changes
- **Rollback** → Easy to revert deployments
- **Collaboration** → Multiple developers can contribute

### CI/CD Pipeline
- **Build checks** → Automatic testing
- **Deployment status** → GitHub integration
- **Environment management** → Different settings per branch

## 🧪 **Testing Your Deployment**

### Test the Connector URL

Visit your deployed URL:
```
https://your-project-name.vercel.app/modules/trello-powerup/public/index.html
```

### Test the API Endpoint

```bash
curl -X POST https://your-project-name.vercel.app/api/trello/query \
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
2. Create a test card
3. Click "Ask Orion" button
4. Verify all actions work correctly

## 📊 **Monitoring and Analytics**

### Vercel Analytics

Enable in Vercel dashboard:
- **Page views** → Track Power-Up usage
- **API requests** → Monitor endpoint performance
- **Error rates** → Identify issues quickly
- **Performance metrics** → Optimize response times

### GitHub Integration

- **Deployment status** → See deployment history
- **Build logs** → Debug deployment issues
- **Environment variables** → Manage secrets securely

## 🔄 **Development Workflow**

### Making Changes

1. **Make changes** to your code locally
2. **Test locally** using `npm run dev:mcp`
3. **Commit changes** to GitHub:
   ```bash
   git add .
   git commit -m "feat: Add new Trello feature"
   git push origin main
   ```
4. **Automatic deployment** → Vercel deploys automatically
5. **Test production** → Verify changes work in production

### Branch Strategy

```bash
# Feature development
git checkout -b feature/new-trello-feature
# Make changes
git commit -m "feat: Add new feature"
git push origin feature/new-trello-feature
# Create pull request
# Merge to main → Automatic deployment
```

## 🚨 **Troubleshooting**

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Check Node.js version compatibility

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no typos in values

3. **API Endpoints Not Working**
   - Check Vercel function logs
   - Verify routes are configured correctly
   - Test endpoints directly

4. **Trello Power-Up Not Loading**
   - Verify connector URL is correct
   - Check CORS headers configuration
   - Ensure HTTPS is enabled

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📈 **Scaling and Performance**

### Vercel Limits

- **Free tier**: 100GB bandwidth, 100GB-hours function execution
- **Pro tier**: Higher limits and better performance
- **Enterprise**: Custom limits and dedicated support

### Optimization Tips

- **Function optimization** → Keep functions lightweight
- **Caching** → Use Vercel's edge caching
- **CDN** → Automatic global distribution
- **Monitoring** → Use Vercel Analytics

## 🔒 **Security Best Practices**

1. **Environment Variables** → Store secrets securely
2. **CORS Configuration** → Restrict origins appropriately
3. **Rate Limiting** → Implement for production use
4. **Input Validation** → Validate all Trello inputs
5. **Error Handling** → Don't expose sensitive information

## 🎯 **Next Steps**

After successful deployment:

1. **Test thoroughly** → Verify all functionality works
2. **Monitor performance** → Use Vercel Analytics
3. **Set up alerts** → Get notified of issues
4. **Document usage** → Create user guides
5. **Iterate and improve** → Based on user feedback

## 📞 **Support**

- **Vercel Issues** → Check Vercel documentation
- **GitHub Issues** → Use GitHub issues for bugs
- **Trello Power-Up** → Review Trello documentation
- **Orion Beta** → Check project documentation

Your Orion Trello Power-Up is now ready for production deployment! 🚀
