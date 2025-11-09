import { useState, useEffect } from 'react';
import useNoteStore from '../../store/useNoteStore';
import useSocketStore from '../../store/useSocketStore';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Share Note with {friendName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
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
        <div className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
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
                <p className="text-sm text-green-600 dark:text-green-400">
                  Note shared successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Select Note */}
          <div>
            <label
              htmlFor="note-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Note
            </label>
            <select
              id="note-select"
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
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
          <div>
            <label
              htmlFor="role-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Access Level
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
              disabled={isSharing || success}
            >
              <option value="Editor">Editor - Can edit the note</option>
              <option value="Viewer">Viewer - Can only view the note</option>
            </select>
          </div>

          {/* Note Info */}
          {selectedNoteId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                <strong>Note:</strong> {friendName} will be notified and can access
                this note immediately.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            disabled={isSharing}
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSharing || success || !selectedNoteId}
          >
            {isSharing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
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
