import { useState, useEffect } from 'react';
import useNoteStore from '../../store/useNoteStore';

/**
 * Share Note Modal Component
 * Modal for generating shareable links for notes
 * Requirements: 13.2, 13.3, 13.5
 */
export default function ShareNoteModal({ noteId, isOpen, onClose }) {
  const { generateShareLink } = useNoteStore();

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

    const result = await generateShareLink(noteId, selectedRole, expiresAt, isPublic);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-note-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="share-note-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Share Note
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
        <div className="p-6">
          {/* Role Selector */}
          <div className="mb-4">
            <label
              htmlFor="share-note-role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Access Level
            </label>
            <select
              id="share-note-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Editor">Editor - Can edit content</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
          </div>

          {/* Expiry Date Selector */}
          <div className="mb-4">
            <label
              htmlFor="note-expiry"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Link Expiry
            </label>
            <select
              id="note-expiry"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="never">Never expires</option>
            </select>
          </div>

          {/* Public/Restricted Toggle */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Public access (anyone with the link can access)
              </span>
            </label>
            {!isPublic && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Restricted access requires users to be logged in
              </p>
            )}
          </div>

          {/* Generate Button */}
          {!generatedLink && (
            <button
              onClick={handleGenerateLink}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
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
                  Generating...
                </span>
              ) : (
                'Generate Share Link'
              )}
            </button>
          )}

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Share this link:
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <svg
                        className="h-5 w-5"
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
                        className="h-5 w-5"
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
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium">Access Level:</span> {selectedRole}
                </p>
                <p>
                  <span className="font-medium">Expires:</span>{' '}
                  {expiryDays === 'never'
                    ? 'Never'
                    : `In ${expiryDays} day${expiryDays === '1' ? '' : 's'}`}
                </p>
                <p>
                  <span className="font-medium">Access Type:</span>{' '}
                  {isPublic ? 'Public' : 'Restricted'}
                </p>
              </div>

              {/* Generate New Link Button */}
              <button
                onClick={() => {
                  setGeneratedLink('');
                  setCopied(false);
                }}
                className="w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Generate New Link
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
