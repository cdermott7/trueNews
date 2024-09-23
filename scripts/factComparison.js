import { extractFacts, extractArticleDate } from './factExtraction.js';
import { translateText } from './translator.js';
import { compare_facts } from '../python/ai_similarity.js';
import { search_articles } from '../python/multi_lingual_search.js';

async function compareFacts(originalArticle) {
  const articleDate = extractArticleDate(originalArticle.text);
  const originalFacts = extractFacts(originalArticle.text, articleDate);
  
  const comparisonResults = await Promise.all(originalFacts.map(async (fact) => {
    const relatedArticles = await search_articles(fact.text, fact.date);
    
    const relatedFactsArray = await Promise.all(relatedArticles.map(async article => {
      const translatedText = await translateText(article.snippet, 'en');
      const extractedFacts = extractFacts(translatedText, new Date(article.date));
      return { 
        source: { 
          name: article.title,
          url: article.link,
          language: article.language
        }, 
        facts: extractedFacts
      };
    }));

    // Compare individual facts
    const factSimilarities = await compare_facts(
      [fact],
      relatedFactsArray.flatMap(article => article.facts)
    );

    const matchingSources = findMatchingSources(factSimilarities[0], relatedFactsArray);
    const category = categorize(matchingSources, relatedArticles.length);
    const consistency = calculateConsistency(fact, matchingSources);

    return { 
      fact: fact.text, 
      category, 
      sources: matchingSources,
      consistency,
      entities: fact.entities
    };
  }));

  return comparisonResults;
}

function findMatchingSources(factSimilarities, relatedFactsArray) {
  let matchingSources = [];
  let currentSourceIndex = 0;
  for (let i = 0; i < factSimilarities.length; i++) {
    if (factSimilarities[i] > 0.8) { // 80% similarity threshold
      while (i >= relatedFactsArray[currentSourceIndex].facts.length) {
        i -= relatedFactsArray[currentSourceIndex].facts.length;
        currentSourceIndex++;
      }
      matchingSources.push(relatedFactsArray[currentSourceIndex].source);
    }
  }
  return [...new Set(matchingSources)]; // Remove duplicates
}

function categorize(matchingSources, totalSources) {
  const ratio = matchingSources.length / totalSources;
  if (ratio >= 0.8) return 'green';
  if (ratio >= 0.5) return 'yellow';
  if (ratio > 0) return 'yellow';
  return 'red';
}

function calculateConsistency(originalFact, matchingSources) {
  // This is a placeholder for a more sophisticated consistency calculation
  // In a real implementation, you might compare specific details across sources
  return matchingSources.length / originalFact.entities.people.length + 
         originalFact.entities.places.length + 
         originalFact.entities.organizations.length;
}

export { compareFacts };