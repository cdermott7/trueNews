import { scrapeArticle } from './scripts/webScraper.js';
import { compareFacts } from './scripts/factComparison.js';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.match(/^https?:\/\/.*$/)) {
    processArticle(tab.url, tabId);
  }
});

async function processArticle(url, tabId) {
  try {
    const originalArticle = await scrapeArticle(url);
    const categorizedFacts = await compareFacts(originalArticle);

    chrome.tabs.sendMessage(tabId, {
      action: 'highlightFacts',
      facts: categorizedFacts
    });
  } catch (error) {
    console.error('Error processing article:', error);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received: ', request);
  if (request.action == 'highlightFacts') {
    console.log('Highlighting facts: ', request.facts);
    highlightFacts(request.facts);
  }
  if (request.action === 'getFactCheckResults') {
    // Retrieve and send fact-checking results
    // This is a placeholder and should be implemented based on how you store results
    sendResponse({facts: []});
  }
});