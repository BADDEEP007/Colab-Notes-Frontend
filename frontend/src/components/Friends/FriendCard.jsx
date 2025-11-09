import { memo, useCallback, useMemo } from 'react';
import useFriendStore from '../../store/useFriendStore';
import styles from './FriendCard.module.css';

/**
 * Friend Card Component
 * Displays friend information with online status and action buttons
 * Requirements: 11.5, 15.3, 15.4
 */
const FriendCard = memo(function FriendCard({ friend, onShareNote, onRemove }) {
  const { isUserOnline } = useFriendStore();

  const { id, name, email, avatar, friendId } = friend;
  const isOnline = isUserOnline(friendId || id);

  const handleShareNote = useCallback(() => {
    if (onShareNote) {
      onShareNote(friendId || id);
    }
  }, [onShareNote, friendId, id]);

  const handleRemove = useCallback(() => {
    if (onRemove) {
      const confirmed = window.confirm(
        `Are you sure you want to remove ${name || email} from your friends?`
      );
      if (confirmed) {
        onRemove(id);
      }
    }
  }, [onRemove, id, name, email]);

  // Get initials for avatar fallback - memoized
  const initials = useMemo(() => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email[0].toUpperCase() : '?';
  }, [name, email]);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {/* Avatar and Info */}
        <div className={styles.avatarSection}>
          {/* Avatar with online status */}
          <div className={styles.avatarWrapper}>
            {avatar ? (
              <img src={avatar} alt={name || email} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            {/* Online status indicator */}
            <div
              className={`${styles.statusIndicator} ${
                isOnline ? styles.statusOnline : styles.statusOffline
              }`}
              aria-label={isOnline ? 'Online' : 'Offline'}
            ></div>
          </div>

          {/* Friend Info */}
          <div className={styles.info}>
            <h3 className={styles.name}>{name || 'Unknown User'}</h3>
            <p className={styles.email}>{email}</p>
            <p className={styles.status}>{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          {/* Share Note Button */}
          <button
            onClick={handleShareNote}
            className={`${styles.actionButton} ${styles.shareButton}`}
            aria-label="Share note with friend"
            title="Share note"
          >
            <svg
              className={styles.actionIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          {/* Remove Friend Button */}
          <button
            onClick={handleRemove}
            className={`${styles.actionButton} ${styles.removeButton}`}
            aria-label="Remove friend"
            title="Remove friend"
          >
            <svg
              className={styles.actionIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default FriendCard;
