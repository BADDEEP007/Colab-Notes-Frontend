import { useState, useEffect, useRef } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import useFriendStore from '../../store/useFriendStore';
import { useFocusTrap, useFocusRestore } from '../../hooks/useKeyboardShortcuts';

/**
 * Invite Modal Component
 * Modal for inviting users to an instance with role selection
 * Requirements: 6.1, 6.2, 6.3, 6.4
 * Accessibility: Keyboard navigation, focus management, ARIA labels
 */
export default function InviteModal({ instanceId, isOpen, onClose }) {
  const { inviteMember, currentInstance } = useInstanceStore();
  const { friends } = useFriendStore();
  const modalRef = useRef(null);

  const [inviteMethod, setInviteMethod] = useState('email'); // 'email' or 'friend'
  const [email, setEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [selectedRole, setSelectedRole] = useState('Viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const members = currentInstance?.members || [];

  // Focus trap and restoration for accessibility
  useFocusTrap(modalRef, isOpen);
  useFocusRestore(isOpen);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSelectedFriend('');
      setSelectedRole('Viewer');
      setError('');
      setSuccess('');
      setInviteMethod('email');
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const inviteEmail = inviteMethod === 'email' ? email : selectedFriend;

    if (!inviteEmail) {
      setError('Please enter an email or select a friend');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if user is already a member
    const isAlreadyMember = members.some(
      (member) => member.email === inviteEmail
    );
    if (isAlreadyMember) {
      setError('This user is already a member of this instance');
      return;
    }

    setIsLoading(true);

    const result = await inviteMember(instanceId, inviteEmail, selectedRole);

    setIsLoading(false);

    if (result.success) {
      setSuccess(`Invitation sent to ${inviteEmail} as ${selectedRole}`);
      setEmail('');
      setSelectedFriend('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error || 'Failed to send invitation');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="invite-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Invite to Instance
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Invite Method Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setInviteMethod('email')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                inviteMethod === 'email'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              By Email
            </button>
            <button
              type="button"
              onClick={() => setInviteMethod('friend')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                inviteMethod === 'friend'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              From Friends
            </button>
          </div>

          {/* Email Input or Friend Selector */}
          {inviteMethod === 'email' ? (
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label
                htmlFor="friend"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Select Friend
              </label>
              <select
                id="friend"
                value={selectedFriend}
                onChange={(e) => setSelectedFriend(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a friend...</option>
                {friends.map((friend) => (
                  <option key={friend.id} value={friend.email}>
                    {friend.name} ({friend.email})
                  </option>
                ))}
              </select>
              {friends.length === 0 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No friends available. Add friends first to invite them.
                </p>
              )}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Owner">Owner - Full access and management</option>
              <option value="Editor">Editor - Can edit and create content</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Current Members List */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Members ({members.length})
            </h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {members.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No members yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {member.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.role === 'Owner'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : member.role === 'Editor'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
