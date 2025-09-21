// Orion Beta CMS Component
// Simple JavaScript component for HubSpot CMS

console.log('Orion Beta CMS component loaded');

// Export a simple function for HubSpot CMS
module.exports = {
  init: function() {
    console.log('Orion Beta component initialized');
    return {
      status: 'ready',
      message: 'Orion Beta integration is active'
    };
  }
};
