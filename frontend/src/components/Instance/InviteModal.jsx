import { useState, useEffect, useRef } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import useFriendStore from '../../store/useFriendStore';
import { useFocusTrap, useFocusRestore } from '../../hooks/useKeyboardShortcuts';
import styles from './InviteModal.module.css';
import clsx from 'clsx';

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
    const isAlreadyMember = members.some((member) => member.email === inviteEmail);
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
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div ref={modalRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 id="invite-modal-title" className={styles.title}>
            Invite to Instance
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
        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Invite Method Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              onClick={() => setInviteMethod('email')}
              className={clsx(styles.tab, inviteMethod === 'email' && styles.active)}
            >
              By Email
            </button>
            <button
              type="button"
              onClick={() => setInviteMethod('friend')}
              className={clsx(styles.tab, inviteMethod === 'friend' && styles.active)}
            >
              From Friends
            </button>
          </div>

          {/* Email Input or Friend Selector */}
          {inviteMethod === 'email' ? (
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className={styles.input}
                required
              />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="friend" className={styles.label}>
                Select Friend
              </label>
              <select
                id="friend"
                value={selectedFriend}
                onChange={(e) => setSelectedFriend(e.target.value)}
                className={styles.select}
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
                <p className={styles.emptyFriends}>
                  No friends available. Add friends first to invite them.
                </p>
              )}
            </div>
          )}

          {/* Role Selector */}
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.select}
            >
              <option value="Owner">Owner - Full access and management</option>
              <option value="Editor">Editor - Can edit and create content</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.error}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={styles.success}>
              <p className={styles.successText}>{success}</p>
            </div>
          )}

          {/* Current Members List */}
          <div className={styles.membersSection}>
            <h3 className={styles.membersTitle}>Current Members ({members.length})</h3>
            <div className={styles.membersList}>
              {members.length === 0 ? (
                <div className={styles.emptyMembers}>No members yet</div>
              ) : (
                <div className={styles.membersItems}>
                  {members.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberAvatar}>
                          {member.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className={styles.memberEmail}>{member.email}</p>
                        </div>
                      </div>
                      <span
                        className={clsx(
                          styles.roleBadge,
                          member.role === 'Owner' && styles.owner,
                          member.role === 'Editor' && styles.editor,
                          member.role === 'Viewer' && styles.viewer
                        )}
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
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
