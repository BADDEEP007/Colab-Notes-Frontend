import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import GlassButton from '../GlassButton';
import './AIResultModal.css';

/**
 * AIResultModal Component
 * 
 * Modal for displaying AI-generated content with options to copy or insert into notes.
 * Shows loading shimmer during AI processing.
 * 
 * @component
 * @example
 * <AIResultModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   content={aiGeneratedContent}
 *   loading={isProcessing}
 *   onInsert={handleInsert}
 * />
 */
const AIResultModal = ({
  isOpen,
  onClose,
  content = '',
  loading = false,
  onInsert,
  title = 'AI Assistant Result',
  showInsertButton = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleInsert = () => {
    if (onInsert && content) {
      onInsert(content);
      onClose();
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="ai-result-modal">
      <ModalHeader onClose={handleClose}>
        <div className="ai-header">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="ai-icon"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          {title}
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="ai-content-container">
          {loading ? (
            <div className="loading-state">
              <div className="shimmer-wrapper">
                <div className="shimmer-line" />
                <div className="shimmer-line" />
                <div className="shimmer-line short" />
                <div className="shimmer-line" />
                <div className="shimmer-line" />
                <div className="shimmer-line short" />
              </div>
              <p className="loading-text">
                <span className="pulse-dot" />
                AI is processing your request...
              </p>
            </div>
          ) : content ? (
            <div className="ai-content">
              <div className="content-text">{content}</div>
            </div>
          ) : (
            <div className="empty-state">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="empty-icon"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="empty-text">No content available</p>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <GlassButton variant="ghost" onClick={handleClose} disabled={loading}>
          Close
        </GlassButton>
        {content && !loading && (
          <>
            <GlassButton
              variant="secondary"
              onClick={handleCopy}
              disabled={loading}
              className={copied ? 'copied-button' : ''}
            >
              {copied ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="5" y="5" width="8" height="8" rx="1" />
                    <path d="M3 11V4a1 1 0 0 1 1-1h7" />
                  </svg>
                  Copy
                </>
              )}
            </GlassButton>
            {showInsertButton && onInsert && (
              <GlassButton variant="primary" onClick={handleInsert} disabled={loading}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                </svg>
                Insert to Note
              </GlassButton>
            )}
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

AIResultModal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal closes */
  onClose: PropTypes.func.isRequired,
  /** AI-generated content to display */
  content: PropTypes.string,
  /** Loading state during AI processing */
  loading: PropTypes.bool,
  /** Function to call when inserting content to note */
  onInsert: PropTypes.func,
  /** Modal title */
  title: PropTypes.string,
  /** Whether to show the insert button */
  showInsertButton: PropTypes.bool,
};

export default AIResultModal;
