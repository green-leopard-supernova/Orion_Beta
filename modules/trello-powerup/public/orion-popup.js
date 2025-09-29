/* global TrelloPowerUp */
const t = TrelloPowerUp.iframe();

// Show/hide custom request field based on selection
document.getElementById("orionQuery").addEventListener("change", function() {
  const customGroup = document.getElementById("customGroup");
  if (this.value === "custom") {
    customGroup.style.display = "block";
  } else {
    customGroup.style.display = "none";
  }
});

document.getElementById("orionForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const query = document.getElementById("orionQuery").value;
  const customRequest = document.getElementById("customRequest").value;
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");
  
  // Show loading state
  loading.style.display = "block";
  result.style.display = "none";
  
  // Get card context
  t.getContext().then(function(context) {
    const cardData = {
      id: context.card,
      name: context.card.name || "Untitled Card",
      description: context.card.description || "",
      url: context.card.url || ""
    };
    
    // Prepare request payload
    const payload = {
      action: query,
      card: cardData,
      customRequest: customRequest,
      timestamp: new Date().toISOString(),
      source: "trello-powerup"
    };
    
    // Determine API endpoint based on environment
    const apiEndpoint = process.env.NODE_ENV === 'production' 
      ? "https://your-orion-endpoint.vercel.app/api/query"
      : "http://localhost:3000/api/trello/query";
    
    // Send to Orion backend
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Trello-Source": "powerup"
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      loading.style.display = "none";
      result.style.display = "block";
      result.className = "result success";
      result.innerHTML = `
        <h4>✅ Orion Response:</h4>
        <p>${data.reply || data.message || "Request processed successfully"}</p>
        ${data.suggestions ? `<p><strong>Suggestions:</strong> ${data.suggestions}</p>` : ''}
        ${data.hubspotUrl ? `<p><a href="${data.hubspotUrl}" target="_blank">View in HubSpot</a></p>` : ''}
      `;
      
      // Auto-close after 5 seconds if successful
      setTimeout(() => {
        t.closePopup();
      }, 5000);
    })
    .catch(err => {
      console.error("Orion API Error:", err);
      loading.style.display = "none";
      result.style.display = "block";
      result.className = "result error";
      result.innerHTML = `
        <h4>❌ Error contacting Orion</h4>
        <p>${err.message}</p>
        <p><small>Please try again or contact support if the issue persists.</small></p>
      `;
    });
  });
});

// Auto-resize popup to fit content
t.render(function() {
  t.sizeTo("#orionForm").done();
});
