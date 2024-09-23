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

export { highlightFacts };