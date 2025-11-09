import { useState, useEffect } from 'react';
import useFriendStore from '../../store/useFriendStore';
import useInstanceStore from '../../store/useInstanceStore';

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
    ? instances.find(inst => inst.id === instanceId) || currentInstance
    : currentInstance;

  // Get instance members who are friends and online
  const getOnlineFriendsInInstance = () => {
    if (!instance || !instance.members) {
      return [];
    }

    // Get member user IDs from current instance
    const memberIds = instance.members.map(member => member.userId);

    // Filter friends who are members of this instance and are online
    return friends.filter(friend => {
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
      className={`
        glass-container-light
        transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64 lg:w-72'}
        flex flex-col
        slide-in-right
      `}
      style={{
        borderLeft: '1px solid var(--glass-border)',
        borderRadius: 0,
      }}
      aria-label="Online friends panel"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        {!isCollapsed && (
          <h2 
            className="text-lg font-semibold"
            style={{ color: 'var(--color-muted-navy)' }}
          >
            Friends Online
          </h2>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-white/30 transition-all duration-300"
          style={{ color: 'var(--color-muted-navy)' }}
          aria-label={isCollapsed ? 'Expand friends panel' : 'Collapse friends panel'}
          aria-expanded={!isCollapsed}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
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
      <div className="flex-1 overflow-y-auto p-4">
        {onlineFriendsInInstance.length === 0 ? (
          <div className={`text-center ${isCollapsed ? 'py-4' : 'py-8'}`}>
            {isCollapsed ? (
              <svg
                className="mx-auto h-8 w-8 text-gray-400"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No friends online
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {onlineFriendsInInstance.map((friend) => {
              const friendUserId = friend.friendId || friend.userId;
              const status = onlineStatuses.get(friendUserId);
              
              return (
                <li key={friend.id}>
                  <div
                    className={`
                      flex items-center p-2 rounded-lg 
                      hover:bg-white/30
                      transition-all duration-300 cursor-pointer
                      ${isCollapsed ? 'justify-center' : 'space-x-3'}
                    `}
                    title={isCollapsed ? (friend.name || friend.email || 'Friend') : ''}
                  >
                    {/* Avatar with online indicator */}
                    <div className="relative shrink-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-glass"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {friend.name?.charAt(0).toUpperCase() || 
                         friend.email?.charAt(0).toUpperCase() || 
                         'F'}
                      </div>
                      <span
                        className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 pulse"
                        style={{ 
                          backgroundColor: 'var(--color-success)',
                          ringColor: 'var(--glass-bg)'
                        }}
                        aria-label="Online"
                      />
                    </div>

                    {/* User Info - Hidden when collapsed */}
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-sm font-medium truncate"
                          style={{ color: 'var(--color-muted-navy)' }}
                        >
                          {friend.name || friend.email || 'Unknown Friend'}
                        </p>
                        {status?.currentPage && (
                          <p 
                            className="text-xs truncate"
                            style={{ color: 'var(--color-muted-navy)', opacity: 0.6 }}
                          >
                            {status.currentPage}
                          </p>
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
        <div 
          className="p-4"
          style={{ borderTop: '1px solid var(--glass-border)' }}
        >
          <p 
            className="text-xs text-center"
            style={{ color: 'var(--color-muted-navy)', opacity: 0.7 }}
          >
            {onlineFriendsInInstance.length} {onlineFriendsInInstance.length === 1 ? 'friend' : 'friends'} online
          </p>
        </div>
      )}
    </aside>
  );
}
