import { useState, useEffect } from 'react';
import useNoteStore from '../../store/useNoteStore';
import useSocketStore from '../../store/useSocketStore';
import styles from './ShareNoteModal.module.css';

/**
 * Share Note Modal Component
 * Allows sharing notes with friends via WebSocket
 * Requirements: 12.1, 12.2
 */
export default function ShareNoteModal({ isOpen, onClose, friendId, friendName }) {
  const { notes, shareNote } = useNoteStore();
  const { emitNoteShare } = useSocketStore();
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [selectedRole, setSelectedRole] = useState('Editor');
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedNoteId('');
      setSelectedRole('Editor');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!selectedNoteId) {
      setError('Please select a note to share');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      // Share note via store
      const result = await shareNote(selectedNoteId, friendId, selectedRole);

      if (result.success) {
        // Emit socket event to notify the friend
        emitNoteShare(selectedNoteId, friendId, selectedRole);

        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to share note');
      }
    } catch (err) {
      setError('An error occurred while sharing the note');
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Share Note with {friendName}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
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
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Success Message */}
          {success && (
            <div className={styles.success}>
              <div className={styles.successContent}>
                <svg
                  className={styles.successIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className={styles.successText}>Note shared successfully!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={styles.error}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Select Note */}
          <div className={styles.field}>
            <label htmlFor="note-select" className={styles.label}>
              Select Note
            </label>
            <select
              id="note-select"
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className={styles.select}
              disabled={isSharing || success}
            >
              <option value="">-- Select a note --</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.title || 'Untitled Note'}
                </option>
              ))}
            </select>
          </div>

          {/* Select Role */}
          <div className={styles.field}>
            <label htmlFor="role-select" className={styles.label}>
              Access Level
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.select}
              disabled={isSharing || success}
            >
              <option value="Editor">Editor - Can edit the note</option>
              <option value="Viewer">Viewer - Can only view the note</option>
            </select>
          </div>

          {/* Note Info */}
          {selectedNoteId && (
            <div className={styles.info}>
              <p className={styles.infoText}>
                <strong>Note:</strong> {friendName} will be notified and can access this note
                immediately.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelButton} disabled={isSharing}>
            Cancel
          </button>
          <button
            onClick={handleShare}
            className={styles.shareButton}
            disabled={isSharing || success || !selectedNoteId}
          >
            {isSharing ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Sharing...
              </>
            ) : (
              'Share Note'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
