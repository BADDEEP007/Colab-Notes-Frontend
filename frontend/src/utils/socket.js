/**
 * Socket.io WebSocket Manager
 * Handles real-time communication with the backend server
 */
import { io } from 'socket.io-client';
import { SOCKET_EVENTS, DRAW_UPDATE_DELAY } from './constants';
import { debounce } from './helpers';

class SocketManager {
  constructor() {
    this.socket = null;
    this.handlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Initial delay in ms
    this.maxReconnectDelay = 30000; // Max delay in ms
    this.isConnecting = false;
    this.stores = null;
    this.debouncedDrawUpdate = null;
  }

  /**
   * Initialize socket connection with JWT authentication
   * @param {string} token - JWT authentication token
   * @param {Object} stores - Zustand stores for state management
   */
  connect(token, stores = null) {
    if (this.isConnecting) {
      console.log('Socket connection already in progress');
      return;
    }

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.isConnecting = true;
    this.stores = stores;

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    console.log('Connecting to socket server:', socketUrl);

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: false, // We'll handle reconnection manually with exponential backoff
      timeout: 10000,
    });

    this.setupConnectionHandlers();
    this.setupEventHandlers();
    this.setupDebouncedHandlers();
  }

  /**
   * Set up connection event handlers
   */
  setupConnectionHandlers() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      // Update socket store if available
      if (this.stores?.socketStore) {
        this.stores.socketStore.getState().setConnected?.(true);
      }

      // Emit user online status
      this.emitUserStatus('online');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnecting = false;

      // Update socket store if available
      if (this.stores?.socketStore) {
        this.stores.socketStore.getState().setConnected?.(false);
      }

      // Attempt reconnection if not a manual disconnect
      if (reason !== 'io client disconnect') {
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.isConnecting = false;

      // Update socket store if available
      if (this.stores?.socketStore) {
        const store = this.stores.socketStore.getState();
        store.setConnected?.(false);
        store.setError?.(error.message);
      }

      // Attempt reconnection with exponential backoff
      this.handleReconnection();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Handle reconnection with exponential backoff
   */
  handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (this.stores?.socketStore) {
        this.stores.socketStore.getState().setError?.('Failed to reconnect to server');
      }
      return;
    }

    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(
      `Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      if (!this.socket?.connected && !this.isConnecting) {
        console.log('Reconnecting socket...');
        this.socket?.connect();
      }
    }, delay);
  }

  /**
   * Set up event handlers for real-time collaboration
   */
  setupEventHandlers() {
    // Note update events
    this.socket.on(SOCKET_EVENTS.NOTE_UPDATE, (data) => {
      console.log('Received note update:', data);
      if (this.stores?.noteStore) {
        this.stores.noteStore.getState().handleRemoteUpdate(data);
      }
    });

    // Whiteboard drawing update events
    this.socket.on(SOCKET_EVENTS.DRAW_UPDATE, (data) => {
      console.log('Received drawing update:', data);
      if (this.stores?.noteStore) {
        this.stores.noteStore.getState().handleDrawingUpdate(data);
      }
    });

    // Friend request events
    this.socket.on(SOCKET_EVENTS.FRIEND_ADDED, (data) => {
      console.log('Received friend request:', data);
      if (this.stores?.friendStore) {
        this.stores.friendStore.getState().handleFriendRequest(data);
      }
    });

    // Friend request notification events
    this.socket.on(SOCKET_EVENTS.FRIEND_REQUEST, (data) => {
      console.log('Received friend request notification:', data);
      if (this.stores?.notificationStore) {
        this.stores.notificationStore.getState().handleFriendRequest(data);
      }
    });

    // User status update events
    this.socket.on(SOCKET_EVENTS.USER_STATUS, (data) => {
      console.log('Received user status update:', data);
      if (this.stores?.friendStore) {
        this.stores.friendStore.getState().handleStatusUpdate(data);
      }
    });

    // Note sharing events
    this.socket.on(SOCKET_EVENTS.NOTE_SHARE, (data) => {
      console.log('Received note share:', data);
      if (this.stores?.noteStore) {
        this.stores.noteStore.getState().handleSharedNote(data);
      }
      // Also trigger notification
      if (this.stores?.notificationStore) {
        this.stores.notificationStore.getState().handleNoteShare(data);
      }
    });

    // Instance member added events
    this.socket.on(SOCKET_EVENTS.INSTANCE_MEMBER_ADDED, (data) => {
      console.log('Received instance member added:', data);
      if (this.stores?.instanceStore) {
        this.stores.instanceStore.getState().handleMemberAdded?.(data);
      }
    });

    // Instance invitation notification events
    this.socket.on(SOCKET_EVENTS.INSTANCE_INVITATION, (data) => {
      console.log('Received instance invitation notification:', data);
      if (this.stores?.notificationStore) {
        this.stores.notificationStore.getState().handleInstanceInvitation(data);
      }
    });

    // Instance updated events
    this.socket.on(SOCKET_EVENTS.INSTANCE_UPDATED, (data) => {
      console.log('Received instance updated:', data);
      if (this.stores?.instanceStore) {
        this.stores.instanceStore.getState().handleInstanceUpdate?.(data);
      }
    });
  }

  /**
   * Set up debounced event handlers
   */
  setupDebouncedHandlers() {
    // Debounce drawing updates to reduce network traffic
    this.debouncedDrawUpdate = debounce((noteId, whiteboardData) => {
      this.emit(SOCKET_EVENTS.DRAW_UPDATE, { noteId, whiteboardData });
    }, DRAW_UPDATE_DELAY);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');

      // Emit user offline status before disconnecting
      this.emitUserStatus('offline');

      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      // Update socket store if available
      if (this.stores?.socketStore) {
        this.stores.socketStore.getState().setConnected?.(false);
      }
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit event "${event}": Socket not connected`);
    }
  }

  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);

      // Store handler reference for cleanup
      if (!this.handlers.has(event)) {
        this.handlers.set(event, []);
      }
      this.handlers.get(event).push(handler);
    } else {
      console.warn(`Cannot register listener for "${event}": Socket not initialized`);
    }
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function to remove
   */
  off(event, handler) {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler);

        // Remove from handlers map
        const handlers = this.handlers.get(event);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      } else {
        this.socket.off(event);
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Register a one-time event listener
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  once(event, handler) {
    if (this.socket) {
      this.socket.once(event, handler);
    } else {
      console.warn(`Cannot register one-time listener for "${event}": Socket not initialized`);
    }
  }

  /**
   * Join a room
   * @param {string} room - Room name/ID (e.g., noteId, instanceId)
   */
  joinRoom(room) {
    console.log('Joining room:', room);
    this.emit('join-room', { room });
  }

  /**
   * Leave a room
   * @param {string} room - Room name/ID
   */
  leaveRoom(room) {
    console.log('Leaving room:', room);
    this.emit('leave-room', { room });
  }

  /**
   * Emit user status update
   * @param {string} status - Status ('online' or 'offline')
   * @param {Object} additionalData - Additional status data
   */
  emitUserStatus(status, additionalData = {}) {
    this.emit(SOCKET_EVENTS.USER_STATUS, {
      status,
      timestamp: new Date().toISOString(),
      ...additionalData,
    });
  }

  /**
   * Emit note update
   * @param {string} noteId - Note ID
   * @param {Object} updates - Note updates (should include userId to prevent echo)
   */
  emitNoteUpdate(noteId, updates) {
    this.emit(SOCKET_EVENTS.NOTE_UPDATE, {
      noteId,
      updates,
      userId: updates.userId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit whiteboard drawing update (debounced)
   * @param {string} noteId - Note ID
   * @param {Object} whiteboardData - Whiteboard data
   */
  emitDrawingUpdate(noteId, whiteboardData) {
    if (this.debouncedDrawUpdate) {
      this.debouncedDrawUpdate(noteId, whiteboardData);
    }
  }

  /**
   * Emit note share event
   * @param {string} noteId - Note ID
   * @param {string} userId - User ID to share with
   * @param {string} role - Role to assign
   */
  emitNoteShare(noteId, userId, role) {
    this.emit(SOCKET_EVENTS.NOTE_SHARE, {
      noteId,
      userId,
      role,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit friend request
   * @param {string} friendId - Friend user ID
   */
  emitFriendRequest(friendId) {
    this.emit(SOCKET_EVENTS.FRIEND_ADDED, {
      friendId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   * @returns {string|null} Socket ID or null
   */
  getSocketId() {
    return this.socket?.id || null;
  }

  /**
   * Get current reconnection attempts
   * @returns {number} Number of reconnection attempts
   */
  getReconnectAttempts() {
    return this.reconnectAttempts;
  }

  /**
   * Manually trigger reconnection
   */
  reconnect() {
    if (this.socket && !this.socket.connected && !this.isConnecting) {
      console.log('Manually reconnecting socket');
      this.reconnectAttempts = 0;
      this.socket.connect();
    }
  }

  /**
   * Clean up all event listeners
   */
  cleanup() {
    if (this.socket) {
      this.handlers.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          this.socket.off(event, handler);
        });
      });
      this.handlers.clear();
    }
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
