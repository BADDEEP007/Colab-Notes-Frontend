import { useState, useEffect } from 'react';
import useSocketStore from '../../store/useSocketStore';
import useAuthStore from '../../store/useAuthStore';
import { SOCKET_EVENTS } from '../../utils/constants';
import styles from './ActiveUsersPanel.module.css';

/**
 * ActiveUsersPanel Component
 * Displays list of users currently editing the note with glassmorphism styling
 * Updates in real-time when users join/leave with fade transitions
 * Requirements: 6.3, 6.4
 *
 * @param {Object} props
 * @param {string} props.noteId - ID of the note being edited
 */
export default function ActiveUsersPanel({ noteId }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const { isConnected, on, off, joinRoom, leaveRoom } = useSocketStore();
  const { user } = useAuthStore();

  // Join note room and listen for user join/leave events
  useEffect(() => {
    if (!noteId || !isConnected) return;

    const roomName = `note:${noteId}`;
    joinRoom(roomName);

    // Handle user joined event
    const handleUserJoined = (data) => {
      if (data.noteId === noteId && data.user) {
        // Don't add current user
        if (data.user.id === user?.id) return;

        setActiveUsers((prev) => {
          // Check if user already exists
          const exists = prev.some((u) => u.id === data.user.id);
          if (exists) return prev;
          return [...prev, data.user];
        });
      }
    };

    // Handle user left event
    const handleUserLeft = (data) => {
      if (data.noteId === noteId && data.userId) {
        setActiveUsers((prev) => prev.filter((u) => u.id !== data.userId));
      }
    };

    // Handle active users list update
    const handleActiveUsersList = (data) => {
      if (data.noteId === noteId && data.users) {
        // Filter out current user
        const otherUsers = data.users.filter((u) => u.id !== user?.id);
        setActiveUsers(otherUsers);
      }
    };

    // Register event listeners
    on(SOCKET_EVENTS.USER_JOINED_NOTE, handleUserJoined);
    on(SOCKET_EVENTS.USER_LEFT_NOTE, handleUserLeft);
    on(SOCKET_EVENTS.ACTIVE_USERS_LIST, handleActiveUsersList);

    // Request current active users list
    if (isConnected) {
      useSocketStore.getState().emit(SOCKET_EVENTS.REQUEST_ACTIVE_USERS, { noteId });
    }

    return () => {
      // Clean up event listeners
      off(SOCKET_EVENTS.USER_JOINED_NOTE, handleUserJoined);
      off(SOCKET_EVENTS.USER_LEFT_NOTE, handleUserLeft);
      off(SOCKET_EVENTS.ACTIVE_USERS_LIST, handleActiveUsersList);

      // Leave room
      leaveRoom(roomName);
    };
  }, [noteId, isConnected, user, on, off, joinRoom, leaveRoom]);

  // Don't render if no active users
  if (activeUsers.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.onlineIndicator}></div>
        <h3 className={styles.title}>Active Users ({activeUsers.length})</h3>
      </div>

      {/* Users List */}
      <div className={styles.usersList}>
        {activeUsers.map((activeUser, index) => (
          <div
            key={activeUser.id}
            className={styles.userItem}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar */}
            <div className={styles.avatarContainer}>
              {activeUser.avatar ? (
                <img src={activeUser.avatar} alt={activeUser.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {activeUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {/* Online indicator */}
              <div className={styles.userOnlineIndicator}></div>
            </div>

            {/* User Info */}
            <div className={styles.userInfo}>
              <p className={styles.userName}>{activeUser.name || 'Anonymous User'}</p>
              <p className={styles.userEmail}>{activeUser.email || 'Editing...'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className={styles.footer}>
        <p className={styles.footerText}>Collaborating in real-time</p>
      </div>
    </div>
  );
}
