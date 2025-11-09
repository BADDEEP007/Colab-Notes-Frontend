/* eslint-disable */
/**
 * Socket Integration Usage Examples
 *
 * This file demonstrates how to use the WebSocket integration
 * in different parts of the application.
 *
 * NOTE: This is a documentation file with examples only.
 * Linting is disabled for this file.
 */

// ============================================================================
// Example 1: Basic Socket Connection in App Component
// ============================================================================

import { useSocket } from '../hooks/useSocket';

function App() {
  // Automatically connects when user is authenticated
  const { isConnected } = useSocket();

  return (
    <div>
      <p>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Joining a Room (Note or Instance)
// ============================================================================

import { useSocketRoom } from '../hooks/useSocket';

function NoteEditor({ noteId }) {
  // Automatically joins the note room when component mounts
  // and leaves when it unmounts
  useSocketRoom(noteId, true);

  return <div>Editing note: {noteId}</div>;
}

// ============================================================================
// Example 3: Listening to Socket Events
// ============================================================================

import { useSocketEvent } from '../hooks/useSocket';
import { useState } from 'react';

function CollaborativeEditor({ noteId }) {
  const [content, setContent] = useState('');

  // Listen for note updates from other users
  useSocketEvent(
    'note:update',
    (data) => {
      if (data.noteId === noteId) {
        setContent(data.updates.content);
      }
    },
    [noteId]
  );

  return <textarea value={content} onChange={(e) => setContent(e.target.value)} />;
}

// ============================================================================
// Example 4: Emitting Events via Store
// ============================================================================

import useSocketStore from '../store/useSocketStore';

function NoteComponent({ noteId }) {
  const { emitNoteUpdate } = useSocketStore();

  const handleSave = (content) => {
    // Emit note update to other users
    emitNoteUpdate(noteId, { content });
  };

  return <button onClick={() => handleSave('New content')}>Save</button>;
}

// ============================================================================
// Example 5: Whiteboard Drawing Updates (Debounced)
// ============================================================================

import useSocketStore from '../store/useSocketStore';

function WhiteboardCanvas({ noteId }) {
  const { emitDrawingUpdate } = useSocketStore();

  const handleDrawing = (canvasData) => {
    // This is automatically debounced (100ms) by the socket manager
    emitDrawingUpdate(noteId, canvasData);
  };

  return <canvas onMouseMove={(e) => handleDrawing(e)} />;
}

// ============================================================================
// Example 6: Friend Status Updates
// ============================================================================

import useSocketStore from '../store/useSocketStore';
import useFriendStore from '../store/useFriendStore';

function FriendsList() {
  const { friends, onlineStatuses } = useFriendStore();

  return (
    <ul>
      {friends.map((friend) => {
        const status = onlineStatuses.get(friend.friendId);
        return (
          <li key={friend.id}>
            {friend.name} - {status?.status === 'online' ? '🟢' : '⚫'}
          </li>
        );
      })}
    </ul>
  );
}

// ============================================================================
// Example 7: Sharing Notes
// ============================================================================

import useSocketStore from '../store/useSocketStore';

function ShareNoteButton({ noteId, friendId }) {
  const { emitNoteShare } = useSocketStore();

  const handleShare = () => {
    emitNoteShare(noteId, friendId, 'Editor');
  };

  return <button onClick={handleShare}>Share Note</button>;
}

// ============================================================================
// Example 8: Manual Connection Control
// ============================================================================

import useSocketStore from '../store/useSocketStore';
import useAuthStore from '../store/useAuthStore';

function ConnectionManager() {
  const { connect, disconnect, reconnect, isConnected } = useSocketStore();
  const { token } = useAuthStore();

  return (
    <div>
      <button onClick={() => connect(token)}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={reconnect}>Reconnect</button>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}

// ============================================================================
// Example 9: Connection Status Indicator
// ============================================================================

import SocketConnectionIndicator from '../components/SocketConnectionIndicator';

function Layout() {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <SocketConnectionIndicator />
      </div>
      {/* Rest of layout */}
    </div>
  );
}

// ============================================================================
// Example 10: Cleanup on Logout
// ============================================================================

import useSocketStore from '../store/useSocketStore';
import useAuthStore from '../store/useAuthStore';

function LogoutButton() {
  const { logout } = useAuthStore();
  const { disconnect } = useSocketStore();

  const handleLogout = async () => {
    // Disconnect socket before logging out
    disconnect();
    await logout();
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ============================================================================
// Socket Events Reference
// ============================================================================

/*
Available Socket Events:

Incoming Events (from server):
- 'note:update' - Note content updated by another user
- 'draw:update' - Whiteboard drawing updated by another user
- 'friend:added' - Friend request received
- 'user:status' - User online/offline status changed
- 'note:share' - Note shared with you
- 'instance:member-added' - New member added to instance
- 'instance:updated' - Instance details updated

Outgoing Events (to server):
- 'note:update' - Send note updates to other users
- 'draw:update' - Send drawing updates to other users
- 'friend:added' - Send friend request
- 'user:status' - Update your online status
- 'note:share' - Share note with another user
- 'join-room' - Join a room (note/instance)
- 'leave-room' - Leave a room

Store Methods:
- connect(token, stores) - Connect to socket server
- disconnect() - Disconnect from socket server
- emit(event, data) - Emit custom event
- on(event, handler) - Listen to custom event
- off(event, handler) - Remove event listener
- once(event, handler) - Listen to event once
- joinRoom(room) - Join a room
- leaveRoom(room) - Leave a room
- updateStatus(status) - Update user status
- emitNoteUpdate(noteId, updates) - Emit note update
- emitDrawingUpdate(noteId, data) - Emit drawing update (debounced)
- emitNoteShare(noteId, userId, role) - Share note
- emitFriendRequest(friendId) - Send friend request
- reconnect() - Manually reconnect
- isSocketConnected() - Check connection status
- getSocketId() - Get socket ID
*/
