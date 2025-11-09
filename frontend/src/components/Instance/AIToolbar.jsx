import { useState } from 'react';
import aiApi from '../../api/aiApi';
import useInstanceStore from '../../store/useInstanceStore';

/**
 * AI Toolbar Component
 * Provides AI-powered tools for instance-level summarization and assistance
 * Requirements: 14.3, 14.4
 */
export default function AIToolbar({ instanceId }) {
  const { currentInstance, instances } = useInstanceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiResultType, setAiResultType] = useState(null); // 'summary' or 'assist'
  const [assistPrompt, setAssistPrompt] = useState('');
  const [showAssistInput, setShowAssistInput] = useState(false);
  const [error, setError] = useState(null);

  // Get the instance to work with
  const instance = instanceId 
    ? instances.find(inst => inst.id === instanceId) || currentInstance
    : currentInstance;

  /**
   * Handle instance-level summarization
   * Summarizes all notes within the current instance
   */
  const handleSummarize = async () => {
    if (!instance?.id) {
      setError('No instance selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowPanel(true);
    setAiResultType('summary');
    setAiResult(null);

    try {
      const response = await aiApi.summarizeInstance(instance.id);
      setAiResult(response.data.summary || response.data);
    } catch (err) {
      console.error('Error summarizing instance:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle AI assistance
   * Generates content based on user prompt
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
      // Use instance context for better AI responses
      const context = instance?.name ? `Instance: ${instance.name}` : '';
      const response = await aiApi.assist(assistPrompt, context);
      setAiResult(response.data.content || response.data);
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
          const button = document.getElementById('copy-button');
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
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

  return (
    <div 
      className="sticky bottom-0 z-sticky shadow-glass-hover"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            {/* AI Summary Button */}
            <button
              onClick={handleSummarize}
              disabled={isLoading || !instance}
              className="glass-button inline-flex items-center"
              aria-label="Summarize instance"
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
              {isLoading && aiResultType === 'summary' ? (
                <span className="flex items-center">
                  <span className="spin mr-2" style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }} />
                  Summarizing...
                </span>
              ) : 'Summarize Instance Notes'}
            </button>

            {/* AI Assist Button */}
            <button
              onClick={toggleAssistInput}
              disabled={isLoading}
              className="glass-button inline-flex items-center"
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
              Generate Summary Report
            </button>
          </div>

          {/* Close Panel Button - Only show when panel is open */}
          {showPanel && (
            <button
              onClick={closePanel}
              className="p-2 rounded-lg hover:bg-white/30 transition-all duration-300"
              style={{ color: 'var(--color-muted-navy)' }}
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
          <div className="pb-4 scale-in">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label
                  htmlFor="assist-prompt"
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'var(--color-muted-navy)' }}
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
                  placeholder="E.g., Generate a meeting agenda, Create a project outline..."
                  rows={2}
                  className="glass-input resize-none"
                  aria-label="AI assistance prompt"
                />
                <p 
                  className="mt-1 text-xs"
                  style={{ color: 'var(--color-muted-navy)', opacity: 0.6 }}
                >
                  Press Ctrl+Enter to submit
                </p>
              </div>
              <button
                onClick={handleAssist}
                disabled={isLoading || !assistPrompt.trim()}
                className="btn-primary h-fit"
                aria-label="Submit prompt"
              >
                {isLoading && aiResultType === 'assist' ? (
                  <span className="spin" style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }} />
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
        <div 
          className="scale-in"
          style={{
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--glass-bg-light)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="glass-container p-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-muted-navy)' }}
                >
                  {aiResultType === 'summary' ? 'Instance Summary' : 'AI Generated Content'}
                </h3>
                {aiResult && (
                  <button
                    id="copy-button"
                    onClick={copyToClipboard}
                    className="glass-button inline-flex items-center px-3 py-1.5 text-sm"
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

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <div 
                      className="spin h-8 w-8"
                      style={{
                        border: '3px solid var(--glass-border)',
                        borderTopColor: 'var(--color-sky-blue)',
                        borderRadius: '50%'
                      }}
                    />
                    <p 
                      className="text-sm shimmer"
                      style={{ color: 'var(--color-muted-navy)' }}
                    >
                      {aiResultType === 'summary' ? 'Analyzing notes...' : 'Generating content...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div 
                  className="glass-container-light rounded-lg p-4"
                  style={{ borderColor: 'var(--color-light-coral)' }}
                >
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 mt-0.5 mr-3 shrink-0"
                      style={{ color: 'var(--color-light-coral)' }}
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
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--color-light-coral)' }}
                    >
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Result */}
              {aiResult && !isLoading && (
                <div className="prose max-w-none fade-in">
                  <div 
                    className="whitespace-pre-wrap"
                    style={{ color: 'var(--color-muted-navy)' }}
                  >
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
