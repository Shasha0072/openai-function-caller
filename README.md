# 🌐 OpenAI Function Caller

A lightweight and extensible system to build powerful AI tools with OpenAI's function calling 🤖  
Seamlessly connect user queries to external APIs — no heavy frameworks required!

---

## ✨ Features

- 🔌 **Function Calling**: Automatically trigger API calls from natural language input using OpenAI
- 🧩 **Modular Tool System**: Easily add new tools to extend functionality
- 🚀 **Express Server**: Simple and clean Node.js backend using Express
- 🌦️📰 **Built-in Tools**: Comes with ready-to-use Weather and News APIs

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/openai-function-caller.git
   cd openai-function-caller
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   WEATHER_API_KEY=your_weather_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```

---

## ▶️ Usage

### 🔥 Start the server

```bash
npm start
```

### 🔁 Development mode with auto-reloading

```bash
npm run dev
```

---

## 🔗 API

### 🧠 Chat Endpoint

**POST** `/api/chat`

#### 📥 Request Example:

```json
{
  "message": "What's the weather like in Paris and any news about space exploration?",
  "conversationHistory": [] // Optional: Include previous messages
}
```

#### 📤 Response Example:

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

---

## 🛠️ Adding New Tools

You can easily extend functionality by creating your own tools.

1. **Create a new file** in the `tools` directory (e.g., `tools/myTool.js`):

```javascript
export const myTool = {
  definition: {
    name: "tool_name",
    description: "Description of what the tool does",
    parameters: {
      // Define your JSON Schema parameters
    },
  },

  handler: async (params) => {
    // Tool implementation logic
    return result;
  },
};
```

2. **Register the tool** in `src/index.js`:

```javascript
import { myTool } from "../tools/myTool.js";

toolCaller.registerTool(
  myTool.definition.name,
  myTool.definition.description,
  myTool.definition.parameters,
  myTool.handler
);
```

---

## 🧪 Example Tools

### Weather Tool 🌤️

Get current weather information for any city using the Weather API.

### News Tool 🗞️

Search for the latest headlines based on keywords using the News API.

---

## 💡 Ideas for New Tools

- 🧾 Currency Exchange Tool
- 📅 Calendar Integration
- 📦 Package Tracker
- 🧠 AI Math Solver
- 📚 Wikipedia Summary Tool

---

## 📄 License

MIT © [Your Name or Organization]  
Free to use. Free to improve. Free to build cool things 🚀

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork, improve, and create awesome tools for this ecosystem.

---

## 💬 Stay Connected

Got feedback or feature ideas? Feel free to open an issue or start a discussion!
