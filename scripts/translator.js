let deeplApiKey = null;

async function getDeeplApiKey() {
  if (!deeplApiKey) {
    const response = await fetch('http://localhost:5000/get-deepl-key');
    const data = await response.json();
    deeplApiKey = data.key;
  }
  return deeplApiKey;
}

async function translateText(text, targetLanguage = 'EN') {
  try {
    const apiKey = await getDeeplApiKey();
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLanguage,
      })
    });

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export { translateText };