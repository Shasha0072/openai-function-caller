import OpenAI from 'openai';

/**
 * OpenAIToolCaller - A class to handle tool/function calling with OpenAI's API
 */
export class OpenAIToolCaller {
  /**
   * Create a new OpenAIToolCaller
   * @param {string} apiKey - The OpenAI API key
   * @param {string} model - The OpenAI model to use
   */
  constructor(apiKey, model = "gpt-4-turbo") {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
    this.tools = [];
    this.toolHandlers = {};
    this.model = model;
  }

  /**
   * Register a tool that can be called by the AI
   * @param {string} name - Tool name
   * @param {string} description - Tool description
   * @param {object} parameters - JSON Schema object describing parameters
   * @param {function} handler - Function to execute when tool is called
   */
  registerTool(name, description, parameters, handler) {
    this.tools.push({
      type: "function",
      function: {
        name,
        description,
        parameters: parameters
      }
    });
    
    this.toolHandlers[name] = handler;
  }

  /**
   * Process user input and call appropriate tools
   * @param {string} userInput - The user's message
   * @param {Array} previousMessages - Previous conversation messages (optional)
   * @returns {object} Response with AI text and tool call details
   */
  async processUserInput(userInput, previousMessages = []) {
    // Prepare the messages array
    const messages = [
      ...previousMessages,
      {
        role: "user",
        content: userInput
      }
    ];
    
    // Ask the AI what to do with the input
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      tools: this.tools,
      tool_choice: "auto" // Let the model decide when to call functions
    });
    
    const responseMessage = response.choices[0].message;
    
    // If the AI doesn't want to call any tools, just return the response
    if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
      return {
        response: responseMessage.content,
        toolCalls: [],
        toolResults: [],
        messages: [...messages, responseMessage]
      };
    }
    
    // The AI wants to call one or more tools
    messages.push(responseMessage);
    
    // Process each tool call
    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      console.log(`Calling function: ${functionName} with args:`, functionArgs);
      
      // Execute the function
      let functionResponse;
      try {
        if (this.toolHandlers[functionName]) {
          functionResponse = await this.toolHandlers[functionName](functionArgs);
        } else {
          functionResponse = { error: `Function ${functionName} not implemented` };
          console.error(`Function ${functionName} was called but not implemented`);
        }
      } catch (error) {
        functionResponse = { error: error.message };
        console.error(`Error executing function ${functionName}:`, error);
      }
      
      // Add the function response to the messages
      const toolResponseMessage = {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(functionResponse)
      };
      
      messages.push(toolResponseMessage);
    }
    
    // Get a new response from the model after function execution
    const secondResponse = await this.openai.chat.completions.create({
      model: this.model,
      messages
    });
    
    const finalMessage = secondResponse.choices[0].message;
    messages.push(finalMessage);
    
    return {
      response: finalMessage.content,
      toolCalls: responseMessage.tool_calls,
      toolResults: messages.filter(m => m.role === "tool"),
      messages: messages
    };
  }
}

export default OpenAIToolCaller;