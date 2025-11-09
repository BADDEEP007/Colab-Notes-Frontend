import { memo, useCallback, useMemo } from 'react';
import useFriendStore from '../../store/useFriendStore';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Avatar and Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar with online status */}
          <div className="relative flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name || email}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
            )}
            {/* Online status indicator */}
            <div
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
              aria-label={isOnline ? 'Online' : 'Offline'}
            ></div>
          </div>

          {/* Friend Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {name || 'Unknown User'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {email}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-2">
          {/* Share Note Button */}
          <button
            onClick={handleShareNote}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            aria-label="Share note with friend"
            title="Share note"
          >
            <svg
              className="h-5 w-5"
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
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Remove friend"
            title="Remove friend"
          >
            <svg
              className="h-5 w-5"
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
