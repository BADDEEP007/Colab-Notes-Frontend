import { create } from 'zustand';

/**
 * Notification store for managing user notifications
 * Handles friend requests, note sharing, and instance invitations
 */
const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,

  // Actions

  /**
   * Add a new notification
   * @param {Object} notification - Notification object
   */
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(), // Generate unique ID
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    return newNotification;
  },

  /**
   * Mark a notification as read
   * @param {string|number} notificationId - Notification ID
   */
  markAsRead: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId);
      if (!notification || notification.read) {
        return state;
      }

      return {
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  /**
   * Remove a notification
   * @param {string|number} notificationId - Notification ID
   */
  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId);
      const wasUnread = notification && !notification.read;

      return {
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  /**
   * Handle friend request notification
   * @param {Object} data - Friend request data from socket
   */
  handleFriendRequest: (data) => {
    const { friendId, friendName, friendEmail } = data;

    get().addNotification({
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${friendName || friendEmail || 'Someone'} sent you a friend request`,
      data: { friendId, friendName, friendEmail },
      actionUrl: '/friends',
    });
  },

  /**
   * Handle note sharing notification
   * @param {Object} data - Note share data from socket
   */
  handleNoteShare: (data) => {
    const { noteId, noteTitle, sharedBy, sharedByName } = data;

    get().addNotification({
      type: 'note_share',
      title: 'Note Shared',
      message: `${sharedByName || sharedBy || 'Someone'} shared "${noteTitle || 'a note'}" with you`,
      data: { noteId, noteTitle, sharedBy, sharedByName },
      actionUrl: `/note/${noteId}`,
    });
  },

  /**
   * Handle instance invitation notification
   * @param {Object} data - Instance invitation data from socket
   */
  handleInstanceInvitation: (data) => {
    const { instanceId, instanceName, invitedBy, invitedByName, role } = data;

    get().addNotification({
      type: 'instance_invitation',
      title: 'Instance Invitation',
      message: `${invitedByName || invitedBy || 'Someone'} invited you to "${instanceName || 'an instance'}" as ${role || 'a member'}`,
      data: { instanceId, instanceName, invitedBy, invitedByName, role },
      actionUrl: `/instance/${instanceId}`,
    });
  },

  /**
   * Get unread notifications
   * @returns {Array} Array of unread notifications
   */
  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.read);
  },

  /**
   * Get notifications by type
   * @param {string} type - Notification type
   * @returns {Array} Array of notifications of the specified type
   */
  getNotificationsByType: (type) => {
    return get().notifications.filter((n) => n.type === type);
  },
}));

export default useNotificationStore;
