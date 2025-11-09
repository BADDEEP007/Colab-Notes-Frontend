import axiosInstance from './axiosInstance';

/**
 * Users API endpoints for user management
 */
const usersApi = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise} User profile data
   */
  getProfile: (userId) => axiosInstance.get(`/api/users/${userId}`),

  /**
   * Update current user profile
   * @param {Object} updates - Profile fields to update
   * @param {string} updates.name - User name (optional)
   * @param {string} updates.avatar - Avatar URL (optional)
   * @returns {Promise} Updated user profile
   */
  updateProfile: (updates) => axiosInstance.put('/api/users/profile', updates),

  /**
   * Search users by email or name
   * @param {string} query - Search query
   * @returns {Promise} List of matching users
   */
  search: (query) =>
    axiosInstance.get('/api/users/search', { params: { q: query } }),

  /**
   * Get online status of users
   * @param {string[]} userIds - Array of user IDs
   * @returns {Promise} Online status for each user
   */
  getOnlineStatus: (userIds) =>
    axiosInstance.post('/api/users/online-status', { userIds }),

  /**
   * Send friend request
   * @param {string} email - Email of user to add as friend
   * @returns {Promise} Friend request response
   */
  sendFriendRequest: (email) =>
    axiosInstance.post('/api/users/friends/request', { email }),

  /**
   * Get friend requests
   * @returns {Promise} List of pending friend requests
   */
  getFriendRequests: () => axiosInstance.get('/api/users/friends/requests'),

  /**
   * Accept friend request
   * @param {string} requestId - Friend request ID
   * @returns {Promise} Response
   */
  acceptFriendRequest: (requestId) =>
    axiosInstance.post(`/api/users/friends/requests/${requestId}/accept`),

  /**
   * Reject friend request
   * @param {string} requestId - Friend request ID
   * @returns {Promise} Response
   */
  rejectFriendRequest: (requestId) =>
    axiosInstance.post(`/api/users/friends/requests/${requestId}/reject`),

  /**
   * Get list of friends
   * @returns {Promise} List of friends
   */
  getFriends: () => axiosInstance.get('/api/users/friends'),

  /**
   * Remove friend
   * @param {string} friendId - Friend user ID
   * @returns {Promise} Response
   */
  removeFriend: (friendId) =>
    axiosInstance.delete(`/api/users/friends/${friendId}`),

  /**
   * Get user notifications
   * @returns {Promise} List of notifications
   */
  getNotifications: () => axiosInstance.get('/api/users/notifications'),

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Response
   */
  markNotificationRead: (notificationId) =>
    axiosInstance.put(`/api/users/notifications/${notificationId}/read`),

  /**
   * Mark all notifications as read
   * @returns {Promise} Response
   */
  markAllNotificationsRead: () =>
    axiosInstance.put('/api/users/notifications/read-all'),
};

export default usersApi;
