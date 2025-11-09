import { useState } from 'react';
import aiApi from '../../api/aiApi';

/**
 * AI Panel Component
 * Provides AI-powered tools for note-level summarization and content generation
 * Requirements: 14.1, 14.2, 14.5
 */
export default function AIPanel({ noteId, noteContent, onInsertContent, canEdit = true }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiResultType, setAiResultType] = useState(null); // 'summary' or 'assist'
  const [assistPrompt, setAssistPrompt] = useState('');
  const [showAssistInput, setShowAssistInput] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle note summarization
   * Summarizes the current note content
   */
  const handleSummarize = async () => {
    if (!noteContent || noteContent.trim().length === 0) {
      setError('No content to summarize. Please add some content to the note first.');
      setShowPanel(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowPanel(true);
    setAiResultType('summary');
    setAiResult(null);

    try {
      const response = await aiApi.summarize(noteContent);
      setAiResult(response.data.summary || response.data.content || response.data);
    } catch (err) {
      console.error('Error summarizing note:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle AI assistance
   * Generates content based on user prompt with note context
   */
  const handleAssist = async () => {
    if (!assistPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowPanel(true);
    setAiResultType('assist');
    setAiResult(null);

    try {
      // Use current note content as context for better AI responses
      const context = noteContent || '';
      const response = await aiApi.assist(assistPrompt, context);
      setAiResult(response.data.content || response.data.generated || response.data);
      setAssistPrompt('');
      setShowAssistInput(false);
    } catch (err) {
      console.error('Error getting AI assistance:', err);
      setError(err.response?.data?.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle assist input visibility
   */
  const toggleAssistInput = () => {
    setShowAssistInput(!showAssistInput);
    setError(null);
  };

  /**
   * Close the AI results panel
   */
  const closePanel = () => {
    setShowPanel(false);
    setAiResult(null);
    setError(null);
    setAiResultType(null);
  };

  /**
   * Copy AI result to clipboard
   */
  const copyToClipboard = () => {
    if (aiResult) {
      const textToCopy = typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2);
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Show temporary success feedback
          const button = document.getElementById('ai-copy-button');
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copied!';
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          setError('Failed to copy to clipboard');
        });
    }
  };

  /**
   * Insert AI result into note
   */
  const handleInsertToNote = () => {
    if (aiResult && onInsertContent) {
      const textToInsert = typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2);
      onInsertContent(textToInsert);
      
      // Show success feedback
      const button = document.getElementById('ai-insert-button');
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Inserted!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Toolbar */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            {/* AI Summary Button */}
            <button
              onClick={handleSummarize}
              disabled={isLoading || !noteContent}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Summarize note"
              title={!noteContent ? 'Add content to the note first' : 'Summarize this note'}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {isLoading && aiResultType === 'summary' ? 'Summarizing...' : 'Summarize'}
            </button>

            {/* AI Assist Button */}
            <button
              onClick={toggleAssistInput}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="AI assist"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI Assist
            </button>
          </div>

          {/* Close Panel Button - Only show when panel is open */}
          {showPanel && (
            <button
              onClick={closePanel}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close AI panel"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* AI Assist Input - Expandable */}
        {showAssistInput && (
          <div className="pb-4 animate-slideDown">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label
                  htmlFor="assist-prompt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  What would you like help with?
                </label>
                <textarea
                  id="assist-prompt"
                  value={assistPrompt}
                  onChange={(e) => setAssistPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAssist();
                    }
                  }}
                  placeholder="E.g., Expand on this topic, Add examples, Rewrite this section..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  aria-label="AI assistance prompt"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Press Ctrl+Enter to submit. The AI will use your note content as context.
                </p>
              </div>
              <button
                onClick={handleAssist}
                disabled={isLoading || !assistPrompt.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                aria-label="Submit prompt"
              >
                {isLoading && aiResultType === 'assist' ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Results Panel */}
      {showPanel && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 animate-slideDown">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {aiResultType === 'summary' ? 'Note Summary' : 'AI Generated Content'}
                </h3>
                <div className="flex items-center gap-2">
                  {aiResult && canEdit && onInsertContent && (
                    <button
                      id="ai-insert-button"
                      onClick={handleInsertToNote}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                      aria-label="Insert to note"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Insert to Note
                    </button>
                  )}
                  {aiResult && (
                    <button
                      id="ai-copy-button"
                      onClick={copyToClipboard}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      <svg
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aiResultType === 'summary' ? 'Analyzing content...' : 'Generating content...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* AI Result */}
              {aiResult && !isLoading && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
