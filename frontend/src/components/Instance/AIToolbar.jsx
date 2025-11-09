import { useState } from 'react';
import aiApi from '../../api/aiApi';
import useInstanceStore from '../../store/useInstanceStore';
import styles from './AIToolbar.module.css';

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
    ? instances.find((inst) => inst.id === instanceId) || currentInstance
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
      const textToCopy =
        typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2);
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Show temporary success feedback
          const button = document.getElementById('copy-button');
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML =
              '<svg class="' +
              styles.copyIcon +
              '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
          setError('Failed to copy to clipboard');
        });
    }
  };

  return (
    <div className={styles.toolbar}>
      {/* Toolbar */}
      <div className={styles.toolbarContent}>
        <div className={styles.toolbarActions}>
          <div className={styles.toolbarButtons}>
            {/* AI Summary Button */}
            <button
              onClick={handleSummarize}
              disabled={isLoading || !instance}
              className={styles.toolbarButton}
              aria-label="Summarize instance"
            >
              <svg
                className={styles.toolbarIcon}
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
                <span>
                  <span className={styles.spinner} />
                  Summarizing...
                </span>
              ) : (
                'Summarize Instance Notes'
              )}
            </button>

            {/* AI Assist Button */}
            <button
              onClick={toggleAssistInput}
              disabled={isLoading}
              className={styles.toolbarButton}
              aria-label="AI assist"
            >
              <svg
                className={styles.toolbarIcon}
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
            <button onClick={closePanel} className={styles.closeButton} aria-label="Close AI panel">
              <svg
                className={styles.closeIcon}
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
          <div className={styles.assistInputContainer}>
            <div className={styles.assistInputWrapper}>
              <div className={styles.assistInputGroup}>
                <label htmlFor="assist-prompt" className={styles.assistLabel}>
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
                  className={styles.assistTextarea}
                  aria-label="AI assistance prompt"
                />
                <p className={styles.assistHint}>Press Ctrl+Enter to submit</p>
              </div>
              <button
                onClick={handleAssist}
                disabled={isLoading || !assistPrompt.trim()}
                className={styles.submitButton}
                aria-label="Submit prompt"
              >
                {isLoading && aiResultType === 'assist' ? (
                  <span className={styles.spinner} />
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
        <div className={styles.resultsPanel}>
          <div className={styles.resultsPanelContent}>
            <div className={styles.resultsContainer}>
              {/* Panel Header */}
              <div className={styles.resultsHeader}>
                <h3 className={styles.resultsTitle}>
                  {aiResultType === 'summary' ? 'Instance Summary' : 'AI Generated Content'}
                </h3>
                {aiResult && (
                  <button
                    id="copy-button"
                    onClick={copyToClipboard}
                    className={styles.copyButton}
                    aria-label="Copy to clipboard"
                  >
                    <svg
                      className={styles.copyIcon}
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
                <div className={styles.loadingState}>
                  <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner} />
                    <p className={styles.loadingText}>
                      {aiResultType === 'summary' ? 'Analyzing notes...' : 'Generating content...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className={styles.errorState}>
                  <div className={styles.errorContent}>
                    <svg
                      className={styles.errorIcon}
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
                    <p className={styles.errorText}>{error}</p>
                  </div>
                </div>
              )}

              {/* AI Result */}
              {aiResult && !isLoading && (
                <div className={styles.resultContent}>
                  <div className={styles.resultText}>
                    {typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
