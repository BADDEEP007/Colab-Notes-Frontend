import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { List } from 'react-window';
import useFriendStore from '../../store/useFriendStore';
import FriendCard from './FriendCard';

/**
 * Friends List Component
 * Displays all accepted friends with online/offline status
 * Requirements: 11.1, 11.5
 */
export default function FriendsList({ onShareNote }) {
  const { friends, fetchFriends, removeFriend, isLoading, error } = useFriendStore();
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Track container width for responsive layout
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleRemoveFriend = useCallback(async (friendId) => {
    const result = await removeFriend(friendId);
    if (result.success) {
      // Optionally show success message
    }
  }, [removeFriend]);

  // Filter and sort friends - memoized
  const sortedFriends = useMemo(() => {
    const filtered = friends.filter((friend) => {
      const query = searchQuery.toLowerCase();
      const name = friend.name?.toLowerCase() || '';
      const email = friend.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    });

    // Sort friends: online first, then alphabetically
    return [...filtered].sort((a, b) => {
      const aOnline = useFriendStore.getState().isUserOnline(a.friendId || a.id);
      const bOnline = useFriendStore.getState().isUserOnline(b.friendId || b.id);
      
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      
      const aName = a.name || a.email || '';
      const bName = b.name || b.email || '';
      return aName.localeCompare(bName);
    });
  }, [friends, searchQuery]);

  // Use virtual scrolling only for large lists (>30 items)
  const useVirtualization = sortedFriends.length > 30;

  // Determine if we should use 2 columns based on screen width
  const useDoubleColumn = containerWidth >= 768; // md breakpoint
  const itemsPerRow = useDoubleColumn ? 2 : 1;
  const itemHeight = 100; // Approximate height of FriendCard

  // Row renderer for virtual list
  const Row = useCallback(({ index, style }) => {
    if (useDoubleColumn) {
      const leftIndex = index * 2;
      const rightIndex = leftIndex + 1;
      const leftFriend = sortedFriends[leftIndex];
      const rightFriend = sortedFriends[rightIndex];
      
      return (
        <div style={style} className="flex gap-4 px-2">
          {leftFriend && (
            <div className="flex-1">
              <FriendCard
                friend={leftFriend}
                onShareNote={onShareNote}
                onRemove={handleRemoveFriend}
              />
            </div>
          )}
          {rightFriend && (
            <div className="flex-1">
              <FriendCard
                friend={rightFriend}
                onShareNote={onShareNote}
                onRemove={handleRemoveFriend}
              />
            </div>
          )}
        </div>
      );
    } else {
      const friend = sortedFriends[index];
      return (
        <div style={style} className="px-2">
          <FriendCard
            friend={friend}
            onShareNote={onShareNote}
            onRemove={handleRemoveFriend}
          />
        </div>
      );
    }
  }, [sortedFriends, useDoubleColumn, onShareNote, handleRemoveFriend]);

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
    <div className="space-y-4" ref={containerRef}>
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Friends Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {sortedFriends.length} {sortedFriends.length === 1 ? 'friend' : 'friends'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Friends List */}
      {sortedFriends.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {searchQuery ? 'No friends found' : 'No friends yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try a different search term'
              : 'Send friend requests to start connecting'}
          </p>
        </div>
      ) : (
        <>
          {useVirtualization && containerWidth > 0 ? (
            // Virtual scrolling for large lists
            <List
              defaultHeight={600}
              rowCount={useDoubleColumn ? Math.ceil(sortedFriends.length / 2) : sortedFriends.length}
              rowHeight={itemHeight}
              defaultWidth={containerWidth}
              className="scrollbar-thin"
              rowComponent={Row}
            />
          ) : (
            // Regular grid for smaller lists
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onShareNote={onShareNote}
                  onRemove={handleRemoveFriend}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
