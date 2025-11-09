import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import GlassButton from '../GlassButton';
import './ShareModal.css';

/**
 * ShareModal Component
 *
 * Modal for generating and managing shareable links with access controls.
 * Supports public/restricted access, role selection, and expiry dates.
 *
 * @component
 * @example
 * <ShareModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onGenerateLink={handleGenerate}
 *   resourceType="note"
 *   resourceId="123"
 * />
 */
const ShareModal = ({
  isOpen,
  onClose,
  onGenerateLink,
  resourceType = 'note',
  resourceId,
  existingLink = null,
  loading = false,
}) => {
  const [isPublic, setIsPublic] = useState(true);
  const [role, setRole] = useState('Viewer');
  const [expiryDate, setExpiryDate] = useState('');
  const [shareLink, setShareLink] = useState(existingLink);
  const [copied, setCopied] = useState(false);

  const roles = ['Viewer', 'Editor'];

  // Update share link when existingLink prop changes
  useEffect(() => {
    setShareLink(existingLink);
  }, [existingLink]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleGenerateLink = async () => {
    const linkData = {
      resourceType,
      resourceId,
      isPublic,
      role,
      expiryDate: expiryDate || null,
    };

    const generatedLink = await onGenerateLink(linkData);
    if (generatedLink) {
      setShareLink(generatedLink);
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleClose = () => {
    setIsPublic(true);
    setRole('Viewer');
    setExpiryDate('');
    setCopied(false);
    onClose();
  };

  // Get minimum date for expiry (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader onClose={handleClose}>
        Share {resourceType === 'note' ? 'Note' : 'Instance'}
      </ModalHeader>

      <ModalBody>
        <div className="share-form">
          {/* Access Type Toggle */}
          <div className="form-group">
            <label className="form-label">Access Type</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-button ${isPublic ? 'active' : ''}`}
                onClick={() => setIsPublic(true)}
                disabled={loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="10" cy="10" r="8" />
                  <path d="M2 10h16M10 2a15.3 15.3 0 0 1 4 8 15.3 15.3 0 0 1-4 8 15.3 15.3 0 0 1-4-8 15.3 15.3 0 0 1 4-8z" />
                </svg>
                Public
              </button>
              <button
                type="button"
                className={`toggle-button ${!isPublic ? 'active' : ''}`}
                onClick={() => setIsPublic(false)}
                disabled={loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="8" width="14" height="10" rx="2" />
                  <path d="M7 8V5a3 3 0 0 1 6 0v3" />
                </svg>
                Restricted
              </button>
            </div>
            <p className="access-description">
              {isPublic ? 'Anyone with the link can access' : 'Only people you invite can access'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="form-group">
            <label htmlFor="role-select" className="form-label">
              Permission Level
            </label>
            <select
              id="role-select"
              className="glass-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="role-description">
              {role === 'Editor' && 'Can view and edit content'}
              {role === 'Viewer' && 'Can only view content'}
            </p>
          </div>

          {/* Expiry Date Picker */}
          <div className="form-group">
            <label htmlFor="expiry-date" className="form-label">
              Expiry Date (Optional)
            </label>
            <input
              id="expiry-date"
              type="date"
              className="glass-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={getMinDate()}
              disabled={loading}
            />
            <p className="expiry-description">
              {expiryDate
                ? `Link will expire on ${new Date(expiryDate).toLocaleDateString()}`
                : 'Link will never expire'}
            </p>
          </div>

          {/* Generate Link Button */}
          {!shareLink && (
            <GlassButton
              variant="primary"
              onClick={handleGenerateLink}
              loading={loading}
              disabled={loading}
              className="generate-button"
            >
              Generate Shareable Link
            </GlassButton>
          )}

          {/* Share Link Display */}
          {shareLink && (
            <div className="share-link-container">
              <label className="form-label">Shareable Link</label>
              <div className="link-display">
                <input
                  type="text"
                  className="link-input"
                  value={shareLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <button
                  type="button"
                  className={`copy-button ${copied ? 'copied' : ''}`}
                  onClick={handleCopyLink}
                  disabled={loading}
                  aria-label="Copy link"
                >
                  {copied ? (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="check-icon"
                      >
                        <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="7" y="7" width="10" height="10" rx="2" />
                        <path d="M3 13V5a2 2 0 0 1 2-2h8" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Link Settings Summary */}
          {shareLink && (
            <div className="link-settings">
              <h4 className="settings-title">Link Settings</h4>
              <div className="settings-list">
                <div className="setting-item">
                  <span className="setting-label">Access:</span>
                  <span className="setting-value">{isPublic ? 'Public' : 'Restricted'}</span>
                </div>
                <div className="setting-item">
                  <span className="setting-label">Permission:</span>
                  <span className="setting-value">{role}</span>
                </div>
                <div className="setting-item">
                  <span className="setting-label">Expires:</span>
                  <span className="setting-value">
                    {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <GlassButton variant="ghost" onClick={handleClose} disabled={loading}>
          Close
        </GlassButton>
        {shareLink && (
          <GlassButton
            variant="secondary"
            onClick={handleGenerateLink}
            loading={loading}
            disabled={loading}
          >
            Regenerate Link
          </GlassButton>
        )}
      </ModalFooter>
    </Modal>
  );
};

ShareModal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal closes */
  onClose: PropTypes.func.isRequired,
  /** Function to call when generating a link */
  onGenerateLink: PropTypes.func.isRequired,
  /** Type of resource being shared */
  resourceType: PropTypes.oneOf(['note', 'instance']),
  /** ID of the resource being shared */
  resourceId: PropTypes.string,
  /** Existing share link if available */
  existingLink: PropTypes.string,
  /** Loading state */
  loading: PropTypes.bool,
};

export default ShareModal;
