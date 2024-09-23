document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.runtime.sendMessage({action: "getFactCheckResults"}, function(response) {
            updatePopup(response.facts);
        });
    });
});

function updatePopup(facts) {
    const statusElement = document.getElementById('status');
    const resultsElement = document.getElementById('results');

    if (facts && facts.length > 0) {
        statusElement.textContent = 'Fact check complete';
        resultsElement.innerHTML = facts.map(fact => `
            <div class="fact ${fact.category}">
                <p>${fact.text}</p>
                <p>Sources: ${fact.sources.length}</p>
            </div>
        `).join('');
    } else {
        statusElement.textContent = 'No facts checked on this page';
    }
}