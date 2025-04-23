# OpenAI Function Caller

A lightweight system for building AI tools with OpenAI's function calling. Connect user queries to external APIs without frameworks. Includes ready-made tools for weather and news data.

## Features

- Call external APIs based on user input using OpenAI's function calling
- Modular tool system for easy addition of new capabilities
- Simple Express API server
- Support for weather and news search tools

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the example provided:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   WEATHER_API_KEY=your_weather_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```

## Usage

Start the server:

```
npm start
```

For development with automatic reloading:

```
npm run dev
```

## API

### Chat Endpoint

```
POST /api/chat
```

Request body:

```json
{
  "message": "What's the weather like in Paris and any news about space exploration?",
  "conversationHistory": [] // Optional previous messages
}
```

Response:

```json
{
  "response": "The weather in Paris is currently sunny with a temperature of 22°C...",
  "toolCalls": 2,
  "conversation": [
    {
      "role": "user",
      "content": "What's the weather like in Paris and any news about space exploration?"
    },
    {
      "role": "assistant",
      "tool_calls": [...]
    },
    ...
  ]
}
```

## Adding New Tools

To add a new tool, create a file in the `tools` directory following the pattern of existing tools:

```javascript
export const myTool = {
  definition: {
    name: 'tool_name',
    description: 'Description of what the tool does',
    parameters: {
      // JSON Schema parameters
    }
  },
  
  handler: async (params) => {
    // Implementation
    return result;
  }
};
```

Then register it in `src/index.js`:

```javascript
import { myTool } from '../tools/myTool.js';

// ...

toolCaller.registerTool(
  myTool.definition.name,
  myTool.definition.description,
  myTool.definition.parameters,
  myTool.handler
);
```

## License

MIT