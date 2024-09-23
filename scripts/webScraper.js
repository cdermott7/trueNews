async function scrapeArticle(url) {
    try {
      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape article');
      }

      const data = await response.json();

      return {
        title: data.title,
        content: data.text,
        author: data.authors ? data.authors.join(', ') : undefined,
        publishDate: data.publish_date,
        url: data.url,
      };
    } catch (error) {
      console.error('Error scraping article:', error);
      return null;
    }
  }

  export { scrapeArticle };