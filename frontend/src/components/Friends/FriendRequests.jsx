import { useEffect } from 'react';
import useFriendStore from '../../store/useFriendStore';
import useSocketStore from '../../store/useSocketStore';

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Requests Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {friendRequests.length}{' '}
          {friendRequests.length === 1 ? 'request' : 'requests'}
        </p>
      </div>

      {/* Requests List */}
      {friendRequests.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No pending requests
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You'll see friend requests here when someone sends you one
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {friendRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Request Info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {request.avatar ? (
                      <img
                        src={request.avatar}
                        alt={request.name || request.email}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {getInitials(request.name, request.email)}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {request.name || 'Unknown User'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {request.email || request.friendEmail}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Accept Button */}
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Accept friend request"
                  >
                    Accept
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
