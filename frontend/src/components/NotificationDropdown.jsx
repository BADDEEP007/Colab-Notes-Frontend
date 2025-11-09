import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/useNotificationStore';
import styles from './NotificationDropdown.module.css';
import clsx from 'clsx';

/**
 * NotificationDropdown Component
 * Displays notification list in dropdown with badge indicator
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5
 */
export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate to relevant content if actionUrl exists
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRemove = (e, notificationId) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return (
          <svg
            className={clsx(styles.icon, styles.iconBlue)}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        );
      case 'note_share':
        return (
          <svg
            className={clsx(styles.icon, styles.iconGreen)}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'instance_invitation':
        return (
          <svg
            className={clsx(styles.icon, styles.iconPurple)}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={clsx(styles.icon, styles.iconGray)}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dropdown} role="menu" aria-label="Notifications">
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className={styles.markAllButton}
            aria-label="Mark all notifications as read"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className={styles.emptyText}>No notifications</p>
          </div>
        ) : (
          <div className={styles.divider}>
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={clsx(styles.notificationItem, !notification.read && styles.unread)}
                role="menuitem"
              >
                <div className={styles.notificationContent}>
                  {/* Icon */}
                  <div className={styles.iconContainer}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className={styles.textContent}>
                    <p className={styles.notificationTitle}>{notification.title}</p>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    <p className={styles.notificationTime}>{formatTime(notification.createdAt)}</p>
                  </div>

                  {/* Unread indicator & Remove button */}
                  <div className={styles.actions}>
                    {!notification.read && (
                      <span className={styles.unreadIndicator} aria-label="Unread" />
                    )}
                    <button
                      onClick={(e) => handleRemove(e, notification.id)}
                      className={styles.removeButton}
                      aria-label="Remove notification"
                    >
                      <svg className={styles.removeIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
