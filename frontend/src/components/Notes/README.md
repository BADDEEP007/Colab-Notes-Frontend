# Notes Components

This directory contains components for note editing and management with real-time collaboration features.

## Components

### NoteEditor

A rich text editor component with auto-save, real-time synchronization, and collaborative editing features.

#### Features

- **Auto-save**: Automatically saves changes with 500ms debounce
- **Real-time Sync**: Syncs changes with other users via WebSocket
- **Operational Transformation**: Handles concurrent edits from multiple users
- **Read-only Mode**: Supports viewer role with read-only access
- **Collaborative Indicators**: Shows active collaborators and save status
- **Keyboard Shortcuts**: Ctrl+S / Cmd+S for manual save

#### Props

| Prop              | Type     | Required | Description                                         |
| ----------------- | -------- | -------- | --------------------------------------------------- |
| `noteId`          | string   | Yes      | Unique identifier for the note                      |
| `initialContent`  | string   | No       | Initial content of the note (default: '')           |
| `canEdit`         | boolean  | No       | Whether user can edit based on role (default: true) |
| `onContentChange` | function | No       | Callback when content changes                       |

#### Usage

```jsx
import { NoteEditor } from '../../components/Notes';
import { useNotes } from '../../hooks';

function NotePage() {
  const { currentNote } = useNotes();
  const [content, setContent] = useState('');

  return (
    <NoteEditor
      noteId={currentNote?.id}
      initialContent={currentNote?.content || ''}
      canEdit={userRole !== 'Viewer'}
      onContentChange={setContent}
    />
  );
}
```

## Hooks

### useNotes

A custom hook that provides note CRUD operations with proper error handling.

#### Operations

- `createNote(containerId, title, content)` - Create a new note
- `fetchNoteByTitle(title)` - Fetch a note by its title
- `updateNote(noteId, updates, immediate)` - Update a note
- `deleteNote(noteId)` - Delete a note
- `fetchNotes(containerId)` - Fetch all notes in a container
- `shareNote(noteId, userId, role)` - Share a note with another user
- `updateWhiteboard(noteId, whiteboardData)` - Update whiteboard data
- `setCurrentNote(noteId)` - Set the active note
- `clearError()` - Clear error state

#### State

- `notes` - Array of all notes
- `currentNote` - Currently active note
- `isLoading` - Loading state
- `isAutoSaving` - Auto-save in progress
- `lastSaved` - Timestamp of last save
- `error` - Error message if any

#### Usage

```jsx
import { useNotes } from '../../hooks';

function MyComponent() {
  const {
    notes,
    currentNote,
    isLoading,
    createNote,
    deleteNote,
  } = useNotes();

  const handleCreate = async () => {
    const result = await createNote('container-id', 'My Note', 'Initial content');
    if (result.success) {
      console.log('Note created:', result.note);
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    // Your component JSX
  );
}
```

## Real-time Collaboration

The NoteEditor automatically handles real-time collaboration through WebSocket events:

1. **Joining Room**: When a note is opened, the editor joins a room (`note:{noteId}`)
2. **Emitting Updates**: Content changes are emitted to other users with debouncing
3. **Receiving Updates**: Remote updates are applied with operational transformation
4. **Cursor Preservation**: Cursor position is maintained during remote updates
5. **Echo Prevention**: Updates from the same user are ignored to prevent loops

### Socket Events

- `note:update` - Emitted when note content changes
- `draw:update` - Emitted when whiteboard changes (handled separately)
- `note:share` - Emitted when note is shared with another user

## API Integration

The components use the following API endpoints:

- `POST /api/notes/add` - Create a new note
- `GET /api/notes/get/title/:title` - Fetch note by title
- `PUT /api/notes/update/:title` - Update note content
- `DELETE /api/notes/delete` - Delete a note
- `GET /api/notes/get` - Get all notes

## Role-Based Access Control

The editor respects user roles:

- **Owner**: Full access (read, write, delete, share)
- **Editor**: Can read and write
- **Viewer**: Read-only access

Set `canEdit={false}` for viewers to enable read-only mode.

## Auto-save Behavior

- Changes are debounced with 500ms delay
- Auto-save indicator shows current status
- Manual save with Ctrl+S / Cmd+S
- Last saved timestamp displayed
- Optimistic updates for better UX

## Operational Transformation

The editor implements a basic operational transformation algorithm to handle concurrent edits:

1. Remote updates are compared with local content
2. If user is actively editing, local changes take precedence
3. Cursor position is preserved and adjusted
4. For production use, consider integrating a full OT library like ShareDB

## Example

See `NoteEditor.example.jsx` for a complete example of integrating the NoteEditor with CRUD operations.
