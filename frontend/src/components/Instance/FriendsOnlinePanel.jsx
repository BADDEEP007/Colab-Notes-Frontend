import { useState, useEffect } from 'react';
import useFriendStore from '../../store/useFriendStore';
import useInstanceStore from '../../store/useInstanceStore';
import styles from './FriendsOnlinePanel.module.css';
import clsx from 'clsx';

/**
 * Friends Online Panel Component
 * Displays online friends in the current instance
 * Requirements: 15.3, 15.4, 15.5
 */
export default function FriendsOnlinePanel({ instanceId }) {
  const { friends, onlineStatuses, isUserOnline } = useFriendStore();
  const { currentInstance, instances } = useInstanceStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get the instance to display - use provided instanceId or current instance
  const instance = instanceId
    ? instances.find((inst) => inst.id === instanceId) || currentInstance
    : currentInstance;

  // Get instance members who are friends and online
  const getOnlineFriendsInInstance = () => {
    if (!instance || !instance.members) {
      return [];
    }

    // Get member user IDs from current instance
    const memberIds = instance.members.map((member) => member.userId);

    // Filter friends who are members of this instance and are online
    return friends.filter((friend) => {
      const friendUserId = friend.friendId || friend.userId;
      const isMember = memberIds.includes(friendUserId);
      const isOnline = isUserOnline(friendUserId);
      return isMember && isOnline;
    });
  };

  const onlineFriendsInInstance = getOnlineFriendsInInstance();

  // Handle responsive behavior for tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={clsx(styles.panel, isCollapsed ? styles.collapsed : styles.expanded)}
      aria-label="Online friends panel"
    >
      {/* Header */}
      <div className={styles.header}>
        {!isCollapsed && <h2 className={styles.title}>Friends Online</h2>}
        <button
          onClick={toggleCollapse}
          className={styles.toggleButton}
          aria-label={isCollapsed ? 'Expand friends panel' : 'Collapse friends panel'}
          aria-expanded={!isCollapsed}
        >
          <svg
            className={clsx(styles.toggleIcon, isCollapsed && styles.rotated)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Friends List */}
      <div className={styles.content}>
        {onlineFriendsInInstance.length === 0 ? (
          <div
            className={clsx(styles.emptyState, isCollapsed ? styles.collapsed : styles.expanded)}
          >
            {isCollapsed ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <>
                <svg
                  className={styles.emptyIconLarge}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className={styles.emptyText}>No friends online</p>
              </>
            )}
          </div>
        ) : (
          <ul className={styles.friendsList} role="list">
            {onlineFriendsInInstance.map((friend) => {
              const friendUserId = friend.friendId || friend.userId;
              const status = onlineStatuses.get(friendUserId);

              return (
                <li key={friend.id}>
                  <div
                    className={clsx(
                      styles.friendItem,
                      isCollapsed ? styles.collapsed : styles.expanded
                    )}
                    title={isCollapsed ? friend.name || friend.email || 'Friend' : ''}
                  >
                    {/* Avatar with online indicator */}
                    <div className={styles.avatarContainer}>
                      <div className={styles.avatar}>
                        {friend.name?.charAt(0).toUpperCase() ||
                          friend.email?.charAt(0).toUpperCase() ||
                          'F'}
                      </div>
                      <span className={styles.onlineIndicator} aria-label="Online" />
                    </div>

                    {/* User Info - Hidden when collapsed */}
                    {!isCollapsed && (
                      <div className={styles.friendInfo}>
                        <p className={styles.friendName}>
                          {friend.name || friend.email || 'Unknown Friend'}
                        </p>
                        {status?.currentPage && (
                          <p className={styles.friendStatus}>{status.currentPage}</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer with count - Hidden when collapsed */}
      {!isCollapsed && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            {onlineFriendsInInstance.length}{' '}
            {onlineFriendsInInstance.length === 1 ? 'friend' : 'friends'} online
          </p>
        </div>
      )}
    </aside>
  );
}
