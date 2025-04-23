import fetch from 'node-fetch';

/**
 * News search tool implementation
 */
export const newsTool = {
  /**
   * Definition for the OpenAI tool
   */
  definition: {
    name: 'search_news',
    description: 'Search for news articles on a specific topic',
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: 'string',
          description: 'The topic to search for news about'
        },
        count: {
          type: 'integer',
          description: 'Number of articles to return (1-10)',
          default: 3
        }
      },
      required: ["topic"]
    }
  },
  
  /**
   * Handler function that will be called when the tool is invoked
   * @param {object} params - The parameters passed to the tool
   * @returns {object} News articles data
   */
  handler: async (params) => {
    const { topic, count = 3 } = params;
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEWS_API_KEY is not set in environment variables');
    }
    
    // Validate count parameter
    const articleCount = Math.min(Math.max(1, count), 10);
    
    try {
      // Make the API call to a news service
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=${articleCount}&apiKey=${apiKey}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`News API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      // Format and return the news data
      return {
        topic,
        totalResults: data.totalResults,
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          source: article.source.name,
          author: article.author,
          url: article.url,
          publishedAt: article.publishedAt,
          content: article.content ? article.content.substring(0, 200) + '...' : 'No content available'
        }))
      };
    } catch (error) {
      console.error('News API error:', error);
      return { 
        error: `Failed to get news for topic "${topic}": ${error.message}` 
      };
    }
  }
};

export default newsTool;