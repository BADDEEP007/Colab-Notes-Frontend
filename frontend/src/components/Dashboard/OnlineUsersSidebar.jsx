import { useState, useEffect } from 'react';
import useFriendStore from '../../store/useFriendStore';
import { useSwipeGesture } from '../../hooks';

/**
 * Online Users Sidebar Component
 * Displays list of online users with avatars and status indicators
 * Requirements: 4.5, 15.3, 15.4, 16.3
 */
export default function OnlineUsersSidebar({ isCollapsed = false, onToggle }) {
  const { friends, onlineStatuses, isUserOnline } = useFriendStore();
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

  // Swipe gesture support for mobile
  const swipeRef = useSwipeGesture({
    onSwipeRight: () => {
      if (window.innerWidth < 768 && !isMobileCollapsed) {
        setIsMobileCollapsed(true);
      }
    },
  });

  // Get online friends
  const onlineFriends = friends.filter((friend) => isUserOnline(friend.friendId || friend.userId));

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileToggle = () => {
    setIsMobileCollapsed(!isMobileCollapsed);
    if (onToggle) {
      onToggle();
    }
  };

  // Determine if sidebar should be shown
  const shouldCollapse = isCollapsed || (window.innerWidth < 768 && isMobileCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={handleMobileToggle}
        className="md:hidden fixed bottom-20 right-4 z-fixed btn-primary p-3 rounded-full shadow-glass"
        aria-label="Toggle online users sidebar"
        aria-expanded={!isMobileCollapsed}
        title="Online users"
      >
        <svg
          className="h-6 w-6"
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
      </button>

      {/* Overlay for mobile */}
      {!isMobileCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-navy z-modal-backdrop"
          style={{ opacity: 0.5 }}
          onClick={handleMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with slide-in/out animation (0.5s) and swipe support */}
      <aside
        ref={swipeRef}
        className={`
          fixed md:sticky top-16 right-0 h-[calc(100vh-4rem)] z-modal
          glass-container swipeable-horizontal
          transition-all duration-500 ease-in-out
          ${shouldCollapse ? 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0' : 'translate-x-0 w-80 md:w-64 lg:w-80 slide-in-right'}
          overflow-hidden
        `}
        style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}
        aria-label="Online users sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/30">
            <h2 className="text-lg font-semibold text-navy">Online Users</h2>
            <button
              onClick={handleMobileToggle}
              className="md:hidden p-1 text-navy hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Close sidebar"
              title="Close"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Online Users List with avatars and green status dot */}
          <div className="flex-1 overflow-y-auto p-4">
            {onlineFriends.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-navy"
                  style={{ opacity: 0.4 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-navy" style={{ opacity: 0.7 }}>
                  No friends online
                </p>
              </div>
            ) : (
              <ul className="space-y-2" role="list">
                {onlineFriends.map((friend) => {
                  const status = onlineStatuses.get(friend.friendId || friend.userId);
                  return (
                    <li key={friend.id}>
                      <div
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title={friend.name || friend.email || 'Unknown User'}
                      >
                        {/* Avatar with green online status dot */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {friend.name?.charAt(0).toUpperCase() ||
                              friend.email?.charAt(0).toUpperCase() ||
                              'U'}
                          </div>
                          <span
                            className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: 'var(--color-success)' }}
                            aria-label="Online"
                          />
                        </div>

                        {/* User Info with tooltip on hover */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">
                            {friend.name || friend.email || 'Unknown User'}
                          </p>
                          {status?.currentPage && (
                            <p className="text-xs text-navy truncate" style={{ opacity: 0.6 }}>
                              {status.currentPage}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer with total count */}
          <div className="p-4 border-t border-white/30">
            <p className="text-xs text-navy text-center" style={{ opacity: 0.7 }}>
              {onlineFriends.length} {onlineFriends.length === 1 ? 'friend' : 'friends'} online
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
