import { create } from 'zustand';
import socketManager from '../utils/socket';

/**
 * Socket store for managing WebSocket connections
 * Integrates with the SocketManager singleton
 */
const useSocketStore = create((set, get) => ({
  // State
  isConnected: false,
  reconnectAttempts: 0,
  error: null,

  // Actions

  /**
   * Connect to WebSocket server
   * @param {string} token - Authentication token
   * @param {Object} stores - Other Zustand stores for integration
   */
  connect: (token, stores = {}) => {
    // Pass all stores to socket manager for event handling
    const allStores = {
      socketStore: { getState: get },
      ...stores,
    };

    socketManager.connect(token, allStores);
  },

  /**
   * Disconnect from WebSocket server
   */
  disconnect: () => {
    socketManager.disconnect();
    set({
      isConnected: false,
      reconnectAttempts: 0,
      error: null,
    });
  },

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit: (event, data) => {
    socketManager.emit(event, data);
  },

  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  on: (event, handler) => {
    socketManager.on(event, handler);
  },

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function to remove
   */
  off: (event, handler) => {
    socketManager.off(event, handler);
  },

  /**
   * Register a one-time event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  once: (event, handler) => {
    socketManager.once(event, handler);
  },

  /**
   * Join a room
   * @param {string} room - Room name/ID
   */
  joinRoom: (room) => {
    socketManager.joinRoom(room);
  },

  /**
   * Leave a room
   * @param {string} room - Room name/ID
   */
  leaveRoom: (room) => {
    socketManager.leaveRoom(room);
  },

  /**
   * Emit user status update
   * @param {string} status - Status ('online' or 'offline')
   * @param {Object} additionalData - Additional status data
   */
  updateStatus: (status, additionalData = {}) => {
    socketManager.emitUserStatus(status, additionalData);
  },

  /**
   * Emit note update
   * @param {string} noteId - Note ID
   * @param {Object} updates - Note updates
   */
  emitNoteUpdate: (noteId, updates) => {
    socketManager.emitNoteUpdate(noteId, updates);
  },

  /**
   * Emit whiteboard drawing update
   * @param {string} noteId - Note ID
   * @param {Object} whiteboardData - Whiteboard data
   */
  emitDrawingUpdate: (noteId, whiteboardData) => {
    socketManager.emitDrawingUpdate(noteId, whiteboardData);
  },

  /**
   * Emit note share event
   * @param {string} noteId - Note ID
   * @param {string} userId - User ID to share with
   * @param {string} role - Role to assign
   */
  emitNoteShare: (noteId, userId, role) => {
    socketManager.emitNoteShare(noteId, userId, role);
  },

  /**
   * Emit friend request
   * @param {string} friendId - Friend user ID
   */
  emitFriendRequest: (friendId) => {
    socketManager.emitFriendRequest(friendId);
  },

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isSocketConnected: () => {
    return socketManager.isConnected();
  },

  /**
   * Get socket ID
   * @returns {string|null} Socket ID or null
   */
  getSocketId: () => {
    return socketManager.getSocketId();
  },

  /**
   * Get current reconnection attempts
   * @returns {number} Number of reconnection attempts
   */
  getReconnectAttempts: () => {
    return socketManager.getReconnectAttempts();
  },

  /**
   * Manually reconnect socket
   */
  reconnect: () => {
    socketManager.reconnect();
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set connected state (called by SocketManager)
   * @param {boolean} connected - Connection status
   */
  setConnected: (connected) => {
    set({ isConnected: connected });
    if (connected) {
      set({ reconnectAttempts: 0, error: null });
    }
  },

  /**
   * Set error state (called by SocketManager)
   * @param {string} error - Error message
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * Update reconnection attempts (called by SocketManager)
   * @param {number} attempts - Number of attempts
   */
  setReconnectAttempts: (attempts) => {
    set({ reconnectAttempts: attempts });
  },

  /**
   * Clean up socket connection
   */
  cleanup: () => {
    socketManager.cleanup();
    socketManager.disconnect();
  },
}));

export default useSocketStore;
