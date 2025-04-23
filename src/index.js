import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/config.js';
import { OpenAIToolCaller } from './toolCaller.js';
import { weatherTool } from '../tools/weatherTool.js';
import { newsTool } from '../tools/newsTool.js';
import { logger, formatErrorResponse } from './utils.js';

// Validate environment variables
try {
  config.validate();
} catch (error) {
  logger(error.message, 'error');
  process.exit(1);
}

// Create Express app
const app = express();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize OpenAI tool caller
const toolCaller = new OpenAIToolCaller(
  config.openai.apiKey,
  config.openai.defaultModel
);

// Register tools
toolCaller.registerTool(
  weatherTool.definition.name,
  weatherTool.definition.description,
  weatherTool.definition.parameters,
  weatherTool.handler
);

toolCaller.registerTool(
  newsTool.definition.name,
  newsTool.definition.description,
  newsTool.definition.parameters,
  newsTool.handler
);

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }
    
    logger(`Processing message: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`);
    
    const result = await toolCaller.processUserInput(message, conversationHistory);
    
    res.json({
      response: result.response,
      toolCalls: result.toolCalls ? result.toolCalls.length : 0,
      conversation: result.messages
    });
  } catch (error) {
    logger(`Error processing request: ${error.message}`, 'error');
    res.status(500).json(formatErrorResponse(error));
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = config.server.port;
app.listen(PORT, () => {
  logger(`Server running on port ${PORT}`);
  logger(`Environment: ${config.server.environment}`);
  logger(`Available tools: ${weatherTool.definition.name}, ${newsTool.definition.name}`);
});

export default app;