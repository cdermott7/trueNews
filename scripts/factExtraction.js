import nlp from 'compromise';
import chrono from 'chrono-node';

// Load additional compromise plugins
nlp.extend(require('compromise-numbers'));
nlp.extend(require('compromise-dates'));

function extractFacts(text, articleDate) {
  const doc = nlp(text);
  const facts = [];

  // Extract statements with numbers
  const numberStatements = doc.numbers().sentences().out('array');
  facts.push(...numberStatements);

  // Extract statements with dates
  const dateStatements = doc.dates().sentences().out('array');
  facts.push(...dateStatements);

  // Extract statements with key verbs indicating events or actions
  const eventVerbs = ['announce', 'launch', 'reveal', 'discover', 'publish', 'release', 'confirm', 'report'];
  const eventStatements = doc.sentences().filter(sent => {
    return sent.has('#Person') || sent.has('#Organization') || eventVerbs.some(verb => sent.has(verb));
  }).out('array');
  facts.push(...eventStatements);

  // Extract statements with named entities
  const entityStatements = doc.sentences().filter(sent => {
    return sent.has('#Person') || sent.has('#Organization') || sent.has('#Place');
  }).out('array');
  facts.push(...entityStatements);

  // Extract quotes
  const quotes = doc.quotations().out('array');
  facts.push(...quotes);

  // Remove duplicates and short statements
  const uniqueFacts = [...new Set(facts)].filter(fact => fact.split(' ').length > 5);

  // Add the article date and extract named entities for each fact
  return uniqueFacts.map(fact => ({
    text: fact,
    date: articleDate,
    entities: extractEntities(nlp(fact))
  }));
}

function extractEntities(doc) {
  return {
    people: doc.people().out('array'),
    places: doc.places().out('array'),
    organizations: doc.organizations().out('array'),
    dates: doc.dates().out('array'),
    values: doc.values().out('array')
  };
}

function extractArticleDate(text) {
  // Try to extract date from the text
  const doc = nlp(text);
  const dates = doc.dates().out('array');
  
  if (dates.length > 0) {
    const parsedDate = chrono.parseDate(dates[0]);
    if (parsedDate) return parsedDate;
  }
  
  // If no date found, return current date
  return new Date();
}

function filterAmbiguousStatements(statements) {
  return statements.filter(statement => !/today|we|it|though|as|he|she|they|them|him|her/.test(statement.toLowerCase()));
}

export { extractFacts, extractArticleDate };