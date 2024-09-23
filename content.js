// Function to highlight facts
function highlightFacts(facts) {
    facts.forEach(fact => {
      const regex = new RegExp(`(${escapeRegExp(fact.fact)})`, 'gi');
      document.body.innerHTML = document.body.innerHTML.replace(regex, (match) => {
        return `<span class="fact-highlight ${fact.category}" 
          data-fact="${encodeURIComponent(JSON.stringify(fact))}">${match}</span>`;
      });
    });
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Listen for messages from the background or popup scripts
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'highlightFacts') {
      highlightFacts(request.facts);
    }
  });
  
  // Inject tooltip container into the body of the page
  const tooltipContainer = document.createElement('div');
  tooltipContainer.id = 'fact-check-tooltip';
  document.body.appendChild(tooltipContainer);
  
  // Event listeners for showing and hiding tooltips
  document.addEventListener('mouseover', showTooltip);
  document.addEventListener('mouseout', hideTooltip);
  
  function showTooltip(event) {
    const highlight = event.target.closest('.fact-highlight');
    if (highlight) {
      const factData = JSON.parse(decodeURIComponent(highlight.dataset.fact));
      const tooltip = document.getElementById('fact-check-tooltip');
      tooltip.innerHTML = `
        <h4>Verified by:</h4>
        <ul>
          ${factData.sources.map(source => `<li><a href="${source.url}" target="_blank">${source.name}</a></li>`).join('')}
        </ul>
      `;
      tooltip.style.display = 'block';
      positionTooltip(tooltip, highlight);
    }
  }
  
  function hideTooltip(event) {
    const tooltip = document.getElementById('fact-check-tooltip');
    
    // Check if event.relatedTarget is null or not and prevent further processing if it's null
    if (!tooltip || !event.relatedTarget) {
      tooltip.style.display = 'none';
      return;
    }
    
    // Ensure that relatedTarget exists before calling closest
    if (!event.relatedTarget.closest('#fact-check-tooltip')) {
      tooltip.style.display = 'none';
    }
  }
  
  function positionTooltip(tooltip, target) {
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
  }
  