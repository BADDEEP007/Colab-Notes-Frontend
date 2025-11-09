import { useEffect } from 'react';
import useNotificationStore from '../store/useNotificationStore';
import useSocketStore from '../store/useSocketStore';
import { useToast } from '../components/ToastContainer';
import { SOCKET_EVENTS } from '../utils/constants';

/**
 * Hook to manage notifications and integrate with socket events
 * Displays toast notifications for real-time events
 * Requirements: 20.1, 20.2, 20.3
 */
export default function useNotifications() {
  const { addNotification } = useNotificationStore();
  const { on, off } = useSocketStore();
  const { showInfo, showSuccess } = useToast();

  useEffect(() => {
    // Handler for friend request notifications
    const handleFriendRequest = (data) => {
      const { friendName, friendEmail } = data;
      const displayName = friendName || friendEmail || 'Someone';
      
      // Add to notification store
      addNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${displayName} sent you a friend request`,
        data,
        actionUrl: '/friends',
      });

      // Show toast notification
      showInfo(`${displayName} sent you a friend request`);
    };

    // Handler for note sharing notifications
    const handleNoteShare = (data) => {
      const { noteTitle, sharedByName, sharedBy } = data;
      const displayName = sharedByName || sharedBy || 'Someone';
      const displayTitle = noteTitle || 'a note';
      
      // Add to notification store
      addNotification({
        type: 'note_share',
        title: 'Note Shared',
        message: `${displayName} shared "${displayTitle}" with you`,
        data,
        actionUrl: data.noteId ? `/note/${data.noteId}` : '/dashboard',
      });

      // Show toast notification
      showSuccess(`${displayName} shared "${displayTitle}" with you`);
    };

    // Handler for instance invitation notifications
    const handleInstanceInvitation = (data) => {
      const { instanceName, invitedByName, invitedBy, role } = data;
      const displayName = invitedByName || invitedBy || 'Someone';
      const displayInstance = instanceName || 'an instance';
      const displayRole = role || 'a member';
      
      // Add to notification store
      addNotification({
        type: 'instance_invitation',
        title: 'Instance Invitation',
        message: `${displayName} invited you to "${displayInstance}" as ${displayRole}`,
        data,
        actionUrl: data.instanceId ? `/instance/${data.instanceId}` : '/dashboard',
      });

      // Show toast notification
      showInfo(`${displayName} invited you to "${displayInstance}"`);
    };

    // Register socket event listeners
    on(SOCKET_EVENTS.FRIEND_REQUEST, handleFriendRequest);
    on(SOCKET_EVENTS.NOTE_SHARE, handleNoteShare);
    on(SOCKET_EVENTS.INSTANCE_INVITATION, handleInstanceInvitation);

    // Cleanup listeners on unmount
    return () => {
      off(SOCKET_EVENTS.FRIEND_REQUEST, handleFriendRequest);
      off(SOCKET_EVENTS.NOTE_SHARE, handleNoteShare);
      off(SOCKET_EVENTS.INSTANCE_INVITATION, handleInstanceInvitation);
    };
  }, [addNotification, on, off, showInfo, showSuccess]);
}
