/**
 * FriendsOnlinePanel Usage Example
 *
 * This example demonstrates how to use the FriendsOnlinePanel component
 * in an instance page to display online friends in real-time.
 */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FriendsOnlinePanel } from './';
import useInstanceStore from '../../store/useInstanceStore';
import useFriendStore from '../../store/useFriendStore';
import useSocketStore from '../../store/useSocketStore';

export default function InstancePageExample() {
  const { instanceId } = useParams();
  const { setCurrentInstance } = useInstanceStore();
  const { fetchFriends } = useFriendStore();
  const { isConnected } = useSocketStore();

  useEffect(() => {
    // Set the current instance when the page loads
    if (instanceId) {
      setCurrentInstance(instanceId);
    }

    // Fetch friends list
    fetchFriends();
  }, [instanceId, setCurrentInstance, fetchFriends]);

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <h1 className="text-2xl font-bold p-4">Instance Page</h1>

        {/* Socket connection indicator */}
        {!isConnected && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-4">
            <p className="font-bold">Disconnected</p>
            <p>Real-time updates are not available. Reconnecting...</p>
          </div>
        )}

        {/* Your instance content here */}
        <div className="p-4">
          <p>Instance content goes here...</p>
        </div>
      </div>

      {/* Friends Online Panel - Right sidebar */}
      <FriendsOnlinePanel instanceId={instanceId} />
    </div>
  );
}

/**
 * Key Features:
 *
 * 1. Real-time Updates:
 *    - The component automatically updates when friends come online/offline
 *    - Updates are received via WebSocket events (user:status)
 *    - No manual refresh needed
 *
 * 2. Instance-Specific:
 *    - Only shows friends who are members of the current instance
 *    - Filters based on instance.members array
 *
 * 3. Responsive Design:
 *    - Collapsible on tablet (768px - 1024px)
 *    - Full width on desktop (>1024px)
 *    - Smooth animations
 *
 * 4. Online Status:
 *    - Green indicator for online friends
 *    - Shows current page/activity if available
 *    - Updates within 5 seconds of status change
 *
 * 5. Empty State:
 *    - Shows friendly message when no friends are online
 *    - Displays icon and text
 *
 * Socket Events Handled:
 * - user:status - Updates online/offline status
 * - friend:added - Adds new friends to the list
 *
 * Store Integration:
 * - useFriendStore: Manages friends list and online statuses
 * - useInstanceStore: Provides current instance and members
 * - useSocketStore: Manages WebSocket connection
 */
