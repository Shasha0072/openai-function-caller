import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

/**
 * Application configuration
 */
export const config = {
  // Server config
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },
  
  // OpenAI config
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10)
  },
  
  // External API keys
  apis: {
    weather: process.env.WEATHER_API_KEY,
    news: process.env.NEWS_API_KEY
  },
  
  // Path configs
  paths: {
    root: projectRoot,
    tools: path.join(projectRoot, 'tools'),
    logs: path.join(projectRoot, 'logs')
  },
  
  // Tool settings
  tools: {
    weatherDefaults: {
      units: process.env.WEATHER_UNITS || 'metric'
    },
    newsDefaults: {
      defaultCount: parseInt(process.env.NEWS_DEFAULT_COUNT || '3', 10)
    }
  },
  
  // Validate that required environment variables are set
  validate() {
    const required = ['OPENAI_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

export default config;