import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import GlassInput from '../GlassInput';
import GlassButton from '../GlassButton';
import './InviteModal.css';

/**
 * InviteModal Component
 *
 * Modal for inviting users to an instance via email or selecting from friends list.
 * Allows setting user roles and displays current members.
 *
 * @component
 * @example
 * <InviteModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onInvite={handleInvite}
 *   currentMembers={members}
 *   friends={friendsList}
 * />
 */
const InviteModal = ({
  isOpen,
  onClose,
  onInvite,
  currentMembers = [],
  friends = [],
  loading = false,
}) => {
  const [email, setEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [role, setRole] = useState('Editor');
  const [error, setError] = useState('');

  const roles = ['Owner', 'Editor', 'Viewer'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    const inviteTarget = selectedFriend || email;
    if (!inviteTarget) {
      setError('Please enter an email or select a friend');
      return;
    }

    // Email validation if email is used
    if (!selectedFriend && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Call onInvite callback
    onInvite({
      email: selectedFriend || email,
      role,
      isFriend: !!selectedFriend,
    });

    // Reset form
    setEmail('');
    setSelectedFriend('');
    setRole('Editor');
  };

  const handleClose = () => {
    setEmail('');
    setSelectedFriend('');
    setRole('Editor');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader onClose={handleClose}>Invite to Instance</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="invite-form">
          {/* Email Input */}
          <div className="form-group">
            <GlassInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedFriend('');
                setError('');
              }}
              disabled={!!selectedFriend || loading}
              placeholder="user@example.com"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                  <path d="M18 5l-8 5-8-5" />
                </svg>
              }
            />
          </div>

          {/* Divider */}
          {friends.length > 0 && (
            <div className="divider">
              <span>or</span>
            </div>
          )}

          {/* Friend Selector */}
          {friends.length > 0 && (
            <div className="form-group">
              <label htmlFor="friend-select" className="form-label">
                Select from Friends
              </label>
              <select
                id="friend-select"
                className="glass-select"
                value={selectedFriend}
                onChange={(e) => {
                  setSelectedFriend(e.target.value);
                  setEmail('');
                  setError('');
                }}
                disabled={!!email || loading}
              >
                <option value="">Choose a friend...</option>
                {friends.map((friend) => (
                  <option key={friend.id} value={friend.email}>
                    {friend.name} ({friend.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Selector */}
          <div className="form-group">
            <label htmlFor="role-select" className="form-label">
              Role
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
              {role === 'Owner' && 'Full access including deletion and member management'}
              {role === 'Editor' && 'Can create, edit, and delete notes'}
              {role === 'Viewer' && 'Can only view notes'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
              </svg>
              {error}
            </div>
          )}

          {/* Current Members List */}
          {currentMembers.length > 0 && (
            <div className="current-members">
              <h3 className="members-title">Current Members</h3>
              <div className="members-list">
                {currentMembers.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} />
                      ) : (
                        <span>{member.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="member-info">
                      <p className="member-name">{member.name}</p>
                      <p className="member-email">{member.email}</p>
                    </div>
                    <span className={`member-role role-${member.role.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </ModalBody>

      <ModalFooter>
        <GlassButton variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </GlassButton>
        <GlassButton
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || (!email && !selectedFriend)}
        >
          Send Invitation
        </GlassButton>
      </ModalFooter>
    </Modal>
  );
};

InviteModal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal closes */
  onClose: PropTypes.func.isRequired,
  /** Function to call when invitation is sent */
  onInvite: PropTypes.func.isRequired,
  /** Array of current members */
  currentMembers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ),
  /** Array of friends to select from */
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ),
  /** Loading state */
  loading: PropTypes.bool,
};

export default InviteModal;
