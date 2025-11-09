# WebSocket Integration Documentation

## Overview

The Collab Notes frontend implements real-time collaboration using Socket.io WebSocket connections. This document describes the architecture, usage, and best practices for the WebSocket integration.

## Architecture

### Components

1. **SocketManager** (`src/utils/socket.js`)
   - Singleton class managing the Socket.io connection
   - Handles connection lifecycle, reconnection with exponential backoff
   - Integrates with Zustand stores for state updates
   - Provides debounced event emission for drawing updates

2. **useSocketStore** (`src/store/useSocketStore.js`)
   - Zustand store wrapping the SocketManager
   - Provides React-friendly API for socket operations
   - Manages connection state and error handling

3. **Custom Hooks** (`src/hooks/useSocket.js`)
   - `useSocket()` - Initializes socket connection when user authenticates
   - `useSocketRoom(roomId, enabled)` - Joins/leaves rooms automatically
   - `useSocketEvent(event, handler, deps)` - Listens to socket events

4. **SocketConnectionIndicator** (`src/components/SocketConnectionIndicator.jsx`)
   - Visual indicator showing connection status
   - Displays reconnection attempts and errors

## Features

### 1. Automatic Connection Management

The socket automatically connects when a user logs in and disconnects on logout:

```javascript
import { useSocket } from './hooks/useSocket';

function App() {
  const { isConnected } = useSocket();
  // Socket connects automatically when authenticated
}
```

### 2. Exponential Backoff Reconnection

When connection is lost, the system attempts to reconnect with exponential backoff:

- Initial delay: 1 second
- Maximum delay: 30 seconds
- Maximum attempts: 5
- Formula: `delay = min(1000 * 2^(attempt-1), 30000)`

### 3. Room Management

Users can join rooms (notes, instances) for targeted event delivery:

```javascript
import { useSocketRoom } from './hooks/useSocket';

function NoteEditor({ noteId }) {
  useSocketRoom(noteId, true); // Joins on mount, leaves on unmount
}
```

### 4. Event Handling

#### Incoming Events

The system listens for these events from the server:

- `note:update` - Note content updated by another user
- `draw:update` - Whiteboard drawing updated
- `friend:added` - Friend request received
- `user:status` - User online/offline status changed
- `note:share` - Note shared with you
- `instance:member-added` - New member added to instance
- `instance:updated` - Instance details updated

#### Outgoing Events

The system can emit these events to the server:

- `note:update` - Send note updates
- `draw:update` - Send drawing updates (debounced 100ms)
- `friend:added` - Send friend request
- `user:status` - Update online status
- `note:share` - Share note with user
- `join-room` - Join a room
- `leave-room` - Leave a room

### 5. Store Integration

Socket events automatically update Zustand stores:

```javascript
// In SocketManager
socket.on('note:update', (data) => {
  noteStore.getState().handleRemoteUpdate(data);
});

socket.on('user:status', (data) => {
  friendStore.getState().handleStatusUpdate(data);
});
```

### 6. Debounced Drawing Updates

Whiteboard drawing updates are debounced to reduce network traffic:

```javascript
const { emitDrawingUpdate } = useSocketStore();

// Called frequently during drawing
handleDrawing(canvasData) {
  emitDrawingUpdate(noteId, canvasData); // Debounced to 100ms
}
```

## Usage Examples

### Basic Connection

```javascript
import { useSocket } from './hooks/useSocket';

function App() {
  const { isConnected } = useSocket();
  
  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

### Joining a Room

```javascript
import { useSocketRoom } from './hooks/useSocket';

function NoteEditor({ noteId }) {
  // Automatically joins room on mount, leaves on unmount
  useSocketRoom(noteId, true);
  
  return <div>Editing note: {noteId}</div>;
}
```

### Listening to Events

```javascript
import { useSocketEvent } from './hooks/useSocket';
import { useState } from 'react';

function CollaborativeEditor({ noteId }) {
  const [content, setContent] = useState('');
  
  useSocketEvent('note:update', (data) => {
    if (data.noteId === noteId) {
      setContent(data.updates.content);
    }
  }, [noteId]);
  
  return <textarea value={content} />;
}
```

### Emitting Events

```javascript
import useSocketStore from './store/useSocketStore';

function NoteEditor({ noteId }) {
  const { emitNoteUpdate } = useSocketStore();
  
  const handleSave = (content) => {
    emitNoteUpdate(noteId, { content });
  };
  
  return <button onClick={() => handleSave('New content')}>Save</button>;
}
```

### Connection Status Indicator

```javascript
import SocketConnectionIndicator from './components/SocketConnectionIndicator';

function Layout() {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <SocketConnectionIndicator />
      </div>
    </div>
  );
}
```

## Configuration

### Environment Variables

Set the WebSocket server URL in your `.env` file:

```env
VITE_SOCKET_URL=ws://localhost:3000
# or for production
VITE_SOCKET_URL=wss://api.collabnotes.com
```

### Reconnection Settings

Modify reconnection settings in `SocketManager`:

```javascript
class SocketManager {
  constructor() {
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
  }
}
```

### Debounce Delays

Adjust debounce delays in `src/utils/constants.js`:

```javascript
export const DRAW_UPDATE_DELAY = 100; // ms
export const AUTO_SAVE_DELAY = 500; // ms
```

## Best Practices

### 1. Always Clean Up

Use the provided hooks to ensure proper cleanup:

```javascript
// Good - automatic cleanup
useSocketRoom(noteId, true);

// Bad - manual management without cleanup
useEffect(() => {
  socketStore.joinRoom(noteId);
  // Missing cleanup!
}, [noteId]);
```

### 2. Use Debouncing for Frequent Updates

For events that fire frequently (drawing, typing), use debounced methods:

```javascript
// Good - debounced
emitDrawingUpdate(noteId, data);

// Bad - not debounced, floods the server
emit('draw:update', { noteId, data });
```

### 3. Handle Connection States

Always handle disconnection gracefully:

```javascript
function Editor() {
  const { isConnected } = useSocketStore();
  
  if (!isConnected) {
    return <div>Reconnecting...</div>;
  }
  
  return <div>Editor content</div>;
}
```

### 4. Validate Event Data

Always validate incoming event data:

```javascript
useSocketEvent('note:update', (data) => {
  if (!data?.noteId || !data?.updates) {
    console.error('Invalid note update data');
    return;
  }
  // Process valid data
}, []);
```

### 5. Use Rooms for Targeted Events

Join specific rooms to receive only relevant events:

```javascript
// Join note room to receive updates for this note only
useSocketRoom(`note:${noteId}`, true);
```

## Troubleshooting

### Connection Issues

1. **Socket won't connect**
   - Check `VITE_SOCKET_URL` environment variable
   - Verify authentication token is valid
   - Check browser console for errors

2. **Frequent disconnections**
   - Check network stability
   - Verify server is running
   - Check for token expiration

3. **Events not received**
   - Verify you've joined the correct room
   - Check event handler is registered
   - Verify socket is connected

### Performance Issues

1. **Too many reconnection attempts**
   - Increase `maxReconnectAttempts`
   - Increase `maxReconnectDelay`

2. **Network congestion**
   - Increase debounce delays
   - Reduce event frequency
   - Use rooms to limit event scope

## Testing

### Manual Testing

1. Open two browser windows
2. Log in as different users
3. Edit the same note
4. Verify changes appear in both windows

### Connection Testing

```javascript
// Test connection
const { connect, disconnect, isConnected } = useSocketStore();

// Connect
connect(token);
console.log('Connected:', isConnected);

// Disconnect
disconnect();
console.log('Connected:', isConnected);
```

### Event Testing

```javascript
// Test event emission
const { emit, on } = useSocketStore();

// Listen for test event
on('test:event', (data) => {
  console.log('Received:', data);
});

// Emit test event
emit('test:event', { message: 'Hello' });
```

## Security Considerations

1. **Authentication**: Socket connection requires valid JWT token
2. **Authorization**: Server validates user permissions for each event
3. **Rate Limiting**: Debouncing prevents event flooding
4. **Data Validation**: Always validate incoming event data

## Future Enhancements

- [ ] Presence indicators (typing, viewing)
- [ ] Cursor position sharing
- [ ] Operational transformation for conflict resolution
- [ ] Offline queue for events
- [ ] Connection quality indicators
- [ ] Automatic token refresh on expiry

## References

- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hooks Documentation](https://react.dev/reference/react)
