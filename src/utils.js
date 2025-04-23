/**
 * Utility functions for the OpenAI tool caller
 */

/**
 * Log a message with timestamp
 * @param {string} message - The message to log
 * @param {string} type - Log type (info, error, warn)
 */
export const logger = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] ${type.toUpperCase()}:`;
  
  switch (type.toLowerCase()) {
    case 'error':
      console.error(logPrefix, message);
      break;
    case 'warn':
      console.warn(logPrefix, message);
      break;
    default:
      console.log(logPrefix, message);
  }
};

/**
 * Sanitize a string for safe logging (e.g., remove API keys)
 * @param {string} input - The string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeForLogging = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Replace API keys in the string
  const apiKeyPattern = /(api[_-]?key|apikey)["\\s:=]+(["\\w\\d]{16,})/gi;
  return input.replace(apiKeyPattern, '$1: "REDACTED"');
};

/**
 * Helper function to handle API responses
 * @param {Response} response - Fetch API response
 * @returns {Promise} JSON response or error
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error (${response.status}): ${text}`);
  }
  return response.json();
};

/**
 * Format error responses for API
 * @param {Error} error - The error object
 * @returns {object} Formatted error response
 */
export const formatErrorResponse = (error) => {
  return {
    error: {
      message: error.message,
      status: error.status || 500
    }
  };
};

export default {
  logger,
  sanitizeForLogging,
  handleApiResponse,
  formatErrorResponse
};