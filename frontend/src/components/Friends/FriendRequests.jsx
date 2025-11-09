import { useEffect } from 'react';
import useFriendStore from '../../store/useFriendStore';
import useSocketStore from '../../store/useSocketStore';
import styles from './FriendRequests.module.css';

/**
 * Friend Requests Component
 * Displays pending friend requests with accept/reject actions
 * Requirements: 11.2, 11.3, 11.4
 */
export default function FriendRequests() {
  const {
    friendRequests,
    fetchFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    isLoading,
    error,
  } = useFriendStore();
  const { on, off } = useSocketStore();

  useEffect(() => {
    fetchFriendRequests();

    // Listen for new friend requests via WebSocket
    const handleFriendAdded = (data) => {
      useFriendStore.getState().handleFriendRequest(data);
    };

    on('friend:added', handleFriendAdded);

    return () => {
      off('friend:added', handleFriendAdded);
    };
  }, [fetchFriendRequests, on, off]);

  const handleAccept = async (requestId) => {
    const result = await acceptFriendRequest(requestId);
    if (result.success) {
      // Optionally show success toast
    }
  };

  const handleReject = async (requestId) => {
    const result = await rejectFriendRequest(requestId);
    if (result.success) {
      // Optionally show success toast
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email[0].toUpperCase() : '?';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Requests Count */}
      <div className={styles.header}>
        <p className={styles.count}>
          {friendRequests.length} {friendRequests.length === 1 ? 'request' : 'requests'}
        </p>
      </div>

      {/* Requests List */}
      {friendRequests.length === 0 ? (
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h3 className={styles.emptyTitle}>No pending requests</h3>
          <p className={styles.emptyDescription}>
            You'll see friend requests here when someone sends you one
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {friendRequests.map((request) => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestContent}>
                {/* Request Info */}
                <div className={styles.requestInfo}>
                  {/* Avatar */}
                  <div className={styles.avatarWrapper}>
                    {request.avatar ? (
                      <img
                        src={request.avatar}
                        alt={request.name || request.email}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        {getInitials(request.name, request.email)}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{request.name || 'Unknown User'}</h3>
                    <p className={styles.userEmail}>{request.email || request.friendEmail}</p>
                    <p className={styles.requestTime}>{formatDate(request.createdAt)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                  {/* Accept Button */}
                  <button
                    onClick={() => handleAccept(request.id)}
                    className={styles.acceptButton}
                    aria-label="Accept friend request"
                  >
                    Accept
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(request.id)}
                    className={styles.rejectButton}
                    aria-label="Reject friend request"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
