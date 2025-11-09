import axiosInstance from './axiosInstance';

/**
 * AI API endpoints for summarization and assistance
 */
const aiApi = {
  /**
   * Summarize note content
   * @param {string} content - Note content to summarize
   * @returns {Promise} Summarized content
   */
  summarize: (content) =>
    axiosInstance.post('/api/ai/summary', { content }),

  /**
   * Get AI assistance for content generation
   * @param {string} prompt - User prompt for AI
   * @param {string} context - Context from current note (optional)
   * @returns {Promise} AI-generated content
   */
  assist: (prompt, context = '') =>
    axiosInstance.post('/api/ai/assist', { prompt, context }),

  /**
   * Summarize all notes in an instance
   * @param {string} instanceId - Instance ID
   * @returns {Promise} Instance-level summary
   */
  summarizeInstance: (instanceId) =>
    axiosInstance.post('/api/ai/summary/instance', { instanceId }),

  /**
   * Get contextual suggestions based on note content
   * @param {string} content - Current note content
   * @returns {Promise} AI suggestions
   */
  getSuggestions: (content) =>
    axiosInstance.post('/api/ai/suggestions', { content }),

  /**
   * Generate content based on note title and context
   * @param {string} title - Note title
   * @param {string} context - Additional context (optional)
   * @returns {Promise} Generated content
   */
  generateContent: (title, context = '') =>
    axiosInstance.post('/api/ai/generate', { title, context }),
};

export default aiApi;
