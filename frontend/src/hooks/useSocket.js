/**
 * Custom hook for managing socket connection lifecycle
 */
import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useSocketStore from '../store/useSocketStore';
import useNoteStore from '../store/useNoteStore';
import useFriendStore from '../store/useFriendStore';
import useInstanceStore from '../store/useInstanceStore';
import useNotificationStore from '../store/useNotificationStore';

/**
 * Hook to initialize and manage socket connection
 * Automatically connects when user is authenticated and disconnects on logout
 */
export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { connect, disconnect, isConnected } = useSocketStore();

  useEffect(() => {
    if (isAuthenticated && token && !isConnected) {
      // Connect socket with all stores for event handling
      connect(token, {
        noteStore: { getState: useNoteStore.getState },
        friendStore: { getState: useFriendStore.getState },
        instanceStore: { getState: useInstanceStore.getState },
        notificationStore: { getState: useNotificationStore.getState },
      });
    }

    // Cleanup on unmount or logout
    return () => {
      if (!isAuthenticated) {
        disconnect();
      }
    };
  }, [isAuthenticated, token, isConnected, connect, disconnect]);

  return {
    isConnected,
  };
};

/**
 * Hook to join/leave a room (e.g., note or instance)
 * @param {string} roomId - Room identifier
 * @param {boolean} enabled - Whether to join the room
 */
export const useSocketRoom = (roomId, enabled = true) => {
  const { joinRoom, leaveRoom, isConnected } = useSocketStore();

  useEffect(() => {
    if (enabled && roomId && isConnected) {
      joinRoom(roomId);

      return () => {
        leaveRoom(roomId);
      };
    }
  }, [roomId, enabled, isConnected, joinRoom, leaveRoom]);
};

/**
 * Hook to listen to a socket event
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 * @param {Array} dependencies - Dependencies for the handler
 */
export const useSocketEvent = (event, handler, dependencies = []) => {
  const { on, off, isConnected } = useSocketStore();

  useEffect(() => {
    if (isConnected && event && handler) {
      on(event, handler);

      return () => {
        off(event, handler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, isConnected, ...dependencies]);
};

export default useSocket;
