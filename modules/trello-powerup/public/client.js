/* global TrelloPowerUp */
TrelloPowerUp.initialize({
  'card-buttons': function(t) {
    return [{
      icon: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png', // Orion icon
      text: 'Ask Orion',
      callback: function(t) {
        return t.popup({
          title: 'Orion Assistant',
          url: 'orion-popup.html'
        });
      }
    }];
  },
  'card-badges': function(t) {
    return t.card('name').get('name').then(function(cardName) {
      // Only show badge if card contains lead-related keywords
      const leadKeywords = ['lead', 'prospect', 'customer', 'client', 'sale', 'deal'];
      const hasLeadContent = leadKeywords.some(keyword => 
        cardName.toLowerCase().includes(keyword)
      );
      
      if (hasLeadContent) {
        return [{
          text: 'Orion Ready',
          color: 'blue',
          icon: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png'
        }];
      }
      return [];
    });
  }
});
