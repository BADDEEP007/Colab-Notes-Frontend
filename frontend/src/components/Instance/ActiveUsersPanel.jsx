import { useState, useEffect } from 'react';
import useSocketStore from '../../store/useSocketStore';
import useAuthStore from '../../store/useAuthStore';
import { SOCKET_EVENTS } from '../../utils/constants';

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
    <div className="fixed bottom-4 right-4 glass-container max-w-xs z-fixed fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 p-4 pb-0">
        <div className="w-2 h-2 bg-green-500 rounded-full pulse"></div>
        <h3 className="text-sm font-semibold text-navy">
          Active Users ({activeUsers.length})
        </h3>
      </div>

      {/* Users List */}
      <div className="space-y-2 max-h-64 overflow-y-auto px-4 pb-4">
        {activeUsers.map((activeUser, index) => (
          <div
            key={activeUser.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-glass-bg-light transition-all fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {activeUser.avatar ? (
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-8 h-8 rounded-full object-cover shadow-glass"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-glass">
                  {activeUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 pulse" style={{ borderColor: 'var(--glass-bg)' }}></div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy truncate">
                {activeUser.name || 'Anonymous User'}
              </p>
              <p className="text-xs text-navy opacity-70 truncate">
                {activeUser.email || 'Editing...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-3 px-4 pb-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <p className="text-xs text-navy opacity-70 text-center">
          Collaborating in real-time
        </p>
      </div>
    </div>
  );
}
