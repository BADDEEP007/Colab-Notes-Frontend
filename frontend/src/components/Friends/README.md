# Friends Components

This directory contains all components related to the friends management system.

## Components

### FriendCard
Displays individual friend information with online status and action buttons.
- Shows friend avatar, name, and email
- Real-time online/offline status indicator
- Share note and remove friend actions
- Requirements: 11.5, 15.3, 15.4

### FriendsList
Displays all accepted friends with search functionality.
- Lists all friends with online status
- Search/filter friends by name or email
- Sorts friends (online first, then alphabetically)
- Integrates with useFriendStore
- Requirements: 11.1, 11.5

### FriendRequests
Displays pending friend requests with accept/reject actions.
- Shows incoming friend requests
- Accept and reject buttons
- Listens for real-time friend:added socket events
- Requirements: 11.2, 11.3, 11.4

### SharedWithMe
Displays notes that have been shared by friends.
- Lists all notes shared with the current user
- Shows sharer information and shared date
- Navigate to note on click
- Listens for real-time note:share socket events
- Requirements: 12.3, 12.4

### ShareNoteModal
Modal for sharing notes with friends.
- Select note to share
- Choose access level (Editor/Viewer)
- Emits note:share socket event
- Requirements: 12.1, 12.2

## Usage

```jsx
import { FriendsList, FriendRequests, SharedWithMe } from '../components/Friends';

// In your page component
<FriendsList onShareNote={handleShareNote} />
<FriendRequests />
<SharedWithMe />
```

## Integration

All components integrate with:
- **useFriendStore**: For friend data and actions
- **useNoteStore**: For shared notes data
- **useSocketStore**: For real-time updates via WebSocket

## Real-time Features

The components listen for the following socket events:
- `friend:added` - New friend request received
- `note:share` - Note shared by a friend
- `user:status` - Friend online/offline status updates
