#!/usr/bin/env node

// HubSpot Deployment Script for Orion Beta
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_NAME = 'orion-beta';
const VERSION = process.env.VERSION || '1.0.0';

console.log('🚀 Starting HubSpot deployment for Orion Beta...\n');

// Check if HubSpot CLI is installed
function checkHubSpotCLI() {
  try {
    execSync('hs --version', { stdio: 'pipe' });
    console.log('✅ HubSpot CLI is installed');
    return true;
  } catch (error) {
    console.error('❌ HubSpot CLI not found. Please install it first:');
    console.error('   npm install -g @hubspot/cli@latest');
    return false;
  }
}

// Check if project is initialized
function checkProjectInitialized() {
  const configPath = path.join(process.cwd(), '.hubspot', 'hubspot.config.json');
  return fs.existsSync(configPath);
}

// Initialize HubSpot project
function initializeProject() {
  console.log('🔧 Initializing HubSpot project...');
  try {
    execSync('hs init', { stdio: 'inherit' });
    console.log('✅ Project initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize project:', error.message);
    return false;
  }
}

// Authenticate with HubSpot
function authenticate() {
  console.log('🔐 Authenticating with HubSpot...');
  try {
    execSync('hs auth', { stdio: 'inherit' });
    console.log('✅ Authentication successful');
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return false;
  }
}

// Upload project to HubSpot
function uploadProject() {
  console.log('📤 Uploading project to HubSpot...');
  try {
    execSync('hs project upload', { stdio: 'inherit' });
    console.log('✅ Project uploaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    return false;
  }
}

// Deploy project
function deployProject() {
  console.log('🚀 Deploying project...');
  try {
    execSync('hs project deploy', { stdio: 'inherit' });
    console.log('✅ Project deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

// Main deployment process
async function deploy() {
  console.log(`📦 Deploying Orion Beta v${VERSION} to HubSpot\n`);

  // Step 1: Check HubSpot CLI
  if (!checkHubSpotCLI()) {
    process.exit(1);
  }

  // Step 2: Check if project is initialized
  if (!checkProjectInitialized()) {
    console.log('ℹ️ Project not initialized, initializing now...');
    if (!initializeProject()) {
      process.exit(1);
    }
  }

  // Step 3: Authenticate
  if (!authenticate()) {
    process.exit(1);
  }

  // Step 4: Upload project
  if (!uploadProject()) {
    process.exit(1);
  }

  // Step 5: Deploy project
  if (!deployProject()) {
    process.exit(1);
  }

  console.log('\n🎉 Orion Beta successfully deployed to HubSpot!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure your webhook URL in HubSpot');
  console.log('2. Set up your environment variables');
  console.log('3. Test the integration');
  console.log('4. Monitor the logs for any issues');
}

// Run deployment
deploy().catch(console.error);
