import { useState, useEffect, useRef } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import { LoadingButton } from '../LoadingSpinner';
import { useFocusTrap, useFocusRestore } from '../../hooks/useKeyboardShortcuts';

/**
 * Create Instance Modal Component
 * Modal for creating new instances with validation
 * Requirements: 5.1, 5.2, 5.3
 * Accessibility: Keyboard navigation, focus management, ARIA labels
 */
export default function CreateInstanceModal({ isOpen, onClose, onSuccess }) {
  const { createInstance, isLoading } = useInstanceStore();
  const [instanceName, setInstanceName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus trap and restoration for accessibility
  useFocusTrap(modalRef, isOpen);
  useFocusRestore(isOpen);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInstanceName('');
      setError('');
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const validateInstanceName = (name) => {
    if (!name.trim()) {
      return 'Instance name is required';
    }
    if (name.trim().length < 3) {
      return 'Instance name must be at least 3 characters';
    }
    if (name.trim().length > 50) {
      return 'Instance name must be less than 50 characters';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateInstanceName(instanceName);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create instance
    const result = await createInstance(instanceName.trim());

    if (result.success) {
      if (onSuccess) {
        onSuccess(result.instance);
      }
      handleClose();
    } else {
      setError(result.error || 'Failed to create instance');
    }
  };

  const handleInputChange = (e) => {
    setInstanceName(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
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

          {/* Modal Header */}
          <div className="mb-6">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Instance
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a new workspace to organize your notes and collaborate with others.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="instance-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Instance Name
              </label>
              <input
                ref={inputRef}
                id="instance-name"
                type="text"
                value={instanceName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="e.g., Team Project, Personal Notes"
                className={`
                  w-full px-4 py-2 border rounded-lg
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                  ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
                `}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'name-error' : undefined}
              />
              {error && (
                <p
                  id="name-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={!instanceName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Instance
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
