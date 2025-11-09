import { useState, useEffect } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import styles from './ShareModal.module.css';

/**
 * Share Modal Component
 * Modal for generating shareable links for instances
 * Requirements: 13.1, 13.2, 13.3, 13.5, 13.6
 */
export default function ShareModal({ instanceId, isOpen, onClose }) {
  const { generateShareLink } = useInstanceStore();

  const [selectedRole, setSelectedRole] = useState('Viewer');
  const [expiryDays, setExpiryDays] = useState('7');
  const [isPublic, setIsPublic] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRole('Viewer');
      setExpiryDays('7');
      setIsPublic(true);
      setGeneratedLink('');
      setError('');
      setCopied(false);
    }
  }, [isOpen]);

  const handleGenerateLink = async () => {
    setError('');
    setIsLoading(true);

    // Calculate expiry date if set
    let expiresAt = null;
    if (expiryDays !== 'never') {
      const days = parseInt(expiryDays);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
    }

    const result = await generateShareLink(instanceId, selectedRole, expiresAt, isPublic);

    setIsLoading(false);

    if (result.success) {
      setGeneratedLink(result.link);
    } else {
      setError(result.error || 'Failed to generate share link');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy link to clipboard');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 id="share-modal-title" className={styles.title}>
            Share Instance
          </h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Role Selector */}
          <div className={styles.formGroup}>
            <label htmlFor="share-role" className={styles.label}>
              Access Level
            </label>
            <select
              id="share-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.select}
            >
              <option value="Owner">Owner - Full access and management</option>
              <option value="Editor">Editor - Can edit and create content</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
          </div>

          {/* Expiry Date Selector */}
          <div className={styles.formGroup}>
            <label htmlFor="expiry" className={styles.label}>
              Link Expiry
            </label>
            <select
              id="expiry"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              className={styles.select}
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="never">Never expires</option>
            </select>
          </div>

          {/* Public/Restricted Toggle */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Public access (anyone with the link can access)
              </span>
            </label>
            {!isPublic && (
              <p className={styles.checkboxHint}>
                Restricted access requires users to be logged in
              </p>
            )}
          </div>

          {/* Generate Button */}
          {!generatedLink && (
            <button
              onClick={handleGenerateLink}
              disabled={isLoading}
              className={styles.generateButton}
            >
              {isLoading ? (
                <span className={styles.loadingContent}>
                  <span className={styles.loadingSpinner} />
                  Generating...
                </span>
              ) : (
                'Generate Share Link'
              )}
            </button>
          )}

          {/* Generated Link Display */}
          {generatedLink && (
            <div className={styles.linkSection}>
              <div className={styles.linkDisplay}>
                <p className={styles.linkLabel}>Share this link:</p>
                <div className={styles.linkInputGroup}>
                  <input type="text" value={generatedLink} readOnly className={styles.linkInput} />
                  <button
                    onClick={handleCopyLink}
                    className={styles.copyButton}
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <svg
                        className={styles.copyIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className={styles.copyIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Link Details */}
              <div className={styles.linkDetails}>
                <p>
                  <span className={styles.detailLabel}>Access Level:</span> {selectedRole}
                </p>
                <p>
                  <span className={styles.detailLabel}>Expires:</span>{' '}
                  {expiryDays === 'never'
                    ? 'Never'
                    : `In ${expiryDays} day${expiryDays === '1' ? '' : 's'}`}
                </p>
                <p>
                  <span className={styles.detailLabel}>Access Type:</span>{' '}
                  {isPublic ? 'Public' : 'Restricted'}
                </p>
              </div>

              {/* Generate New Link Button */}
              <button
                onClick={() => {
                  setGeneratedLink('');
                  setCopied(false);
                }}
                className={styles.newLinkButton}
              >
                Generate New Link
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={styles.error}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.footerButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
