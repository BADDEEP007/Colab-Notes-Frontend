import { create } from 'zustand';

/**
 * Friend store for managing friend connections and online status
 */
const useFriendStore = create((set, get) => ({
  // State
  friends: [],
  friendRequests: [],
  onlineStatuses: new Map(),
  isLoading: false,
  error: null,

  // Actions

  /**
   * Fetch all friends for the current user
   */
  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // const response = await friendsApi.getAll();
      // const friends = response.data;

      // Placeholder for now
      const friends = [];

      set({ friends, isLoading: false });
      return { success: true, friends };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch friends.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetch pending friend requests
   */
  fetchFriendRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // const response = await friendsApi.getRequests();
      // const requests = response.data;

      // Placeholder for now
      const requests = [];

      set({ friendRequests: requests, isLoading: false });
      return { success: true, requests };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch friend requests.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Send a friend request
   * @param {string} email - Email of user to send request to
   */
  sendFriendRequest: async (email) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // const response = await friendsApi.sendRequest({ email });
      // const request = response.data;

      // Placeholder for now
      const request = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        friendEmail: email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      set({ isLoading: false });
      return { success: true, request };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send friend request.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Accept a friend request
   * @param {string} requestId - Friend request ID
   */
  acceptFriendRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // const response = await friendsApi.acceptRequest(requestId);
      // const friend = response.data;

      // Find the request and convert to friend
      const request = get().friendRequests.find((req) => req.id === requestId);
      if (request) {
        const newFriend = {
          id: requestId,
          userId: request.userId,
          friendId: request.friendId,
          status: 'accepted',
          createdAt: request.createdAt,
        };

        set((state) => ({
          friends: [...state.friends, newFriend],
          friendRequests: state.friendRequests.filter((req) => req.id !== requestId),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to accept friend request.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Reject a friend request
   * @param {string} requestId - Friend request ID
   */
  rejectFriendRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // await friendsApi.rejectRequest(requestId);

      set((state) => ({
        friendRequests: state.friendRequests.filter((req) => req.id !== requestId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reject friend request.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Remove a friend
   * @param {string} friendId - Friend ID
   */
  removeFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when friends API is implemented
      // await friendsApi.remove(friendId);

      set((state) => ({
        friends: state.friends.filter((friend) => friend.id !== friendId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove friend.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Update online status for a user
   * @param {string} userId - User ID
   * @param {Object} status - Online status object
   */
  updateOnlineStatus: (userId, status) => {
    set((state) => {
      const newStatuses = new Map(state.onlineStatuses);
      newStatuses.set(userId, {
        ...status,
        lastUpdated: new Date().toISOString(),
      });
      return { onlineStatuses: newStatuses };
    });
  },

  /**
   * Get online status for a specific user
   * @param {string} userId - User ID
   * @returns {Object|null} Online status object or null
   */
  getOnlineStatus: (userId) => {
    return get().onlineStatuses.get(userId) || null;
  },

  /**
   * Check if a user is online
   * @param {string} userId - User ID
   * @returns {boolean} True if user is online
   */
  isUserOnline: (userId) => {
    const status = get().onlineStatuses.get(userId);
    return status?.status === 'online';
  },

  /**
   * Get all online friends
   * @returns {Array} Array of online friend objects
   */
  getOnlineFriends: () => {
    const { friends, onlineStatuses } = get();
    return friends.filter((friend) => {
      const status = onlineStatuses.get(friend.friendId);
      return status?.status === 'online';
    });
  },

  /**
   * Handle friend request notification from WebSocket
   * @param {Object} data - Friend request data
   */
  handleFriendRequest: (data) => {
    const { request } = data;

    set((state) => ({
      friendRequests: [...state.friendRequests, request],
    }));
  },

  /**
   * Handle user status update from WebSocket
   * @param {Object} data - Status update data
   */
  handleStatusUpdate: (data) => {
    const { userId, status } = data;
    get().updateOnlineStatus(userId, status);
  },

  /**
   * Bulk update online statuses
   * @param {Array} statuses - Array of status objects with userId and status
   */
  bulkUpdateStatuses: (statuses) => {
    set((state) => {
      const newStatuses = new Map(state.onlineStatuses);
      statuses.forEach(({ userId, status }) => {
        newStatuses.set(userId, {
          ...status,
          lastUpdated: new Date().toISOString(),
        });
      });
      return { onlineStatuses: newStatuses };
    });
  },

  /**
   * Clear offline users (cleanup stale data)
   * @param {number} thresholdMinutes - Minutes of inactivity before considering offline
   */
  clearOfflineUsers: (thresholdMinutes = 5) => {
    set((state) => {
      const newStatuses = new Map(state.onlineStatuses);
      const now = new Date();

      newStatuses.forEach((status, userId) => {
        const lastSeen = new Date(status.lastSeen || status.lastUpdated);
        const minutesSinceLastSeen = (now - lastSeen) / 1000 / 60;

        if (minutesSinceLastSeen > thresholdMinutes) {
          newStatuses.set(userId, { ...status, status: 'offline' });
        }
      });

      return { onlineStatuses: newStatuses };
    });
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useFriendStore;
