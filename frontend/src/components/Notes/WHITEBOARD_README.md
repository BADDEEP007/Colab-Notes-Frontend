# Whiteboard Implementation

This document describes the whiteboard canvas and drawing tools implementation for the Collab Notes application.

## Overview

The whiteboard feature provides a collaborative canvas-based drawing area within notes, powered by Fabric.js. It includes comprehensive drawing tools, undo/redo functionality, real-time synchronization, and auto-save capabilities.

## Components

### 1. Whiteboard.jsx

The main whiteboard canvas component that initializes and manages the Fabric.js canvas.

**Features:**
- Fabric.js canvas initialization with responsive behavior
- Touch support for mobile devices
- Automatic canvas resizing
- View-only mode for Viewer role
- Integration with drawing tools, history, and sync hooks

**Props:**
- `noteId` - Note ID for the whiteboard
- `canEdit` - Whether user can edit (role-based)
- `onDrawingChange` - Callback for auto-save
- `initialData` - Initial whiteboard data to load
- `selectedTool` - Currently selected drawing tool
- `toolOptions` - Tool options (color, strokeWidth)
- `onUndo` - Ref for undo function
- `onRedo` - Ref for redo function
- `onHistoryChange` - Callback for history state changes
- `onExport` - Ref for export function
- `enableSync` - Enable real-time synchronization
- `onRemoteUpdate` - Callback for remote updates

### 2. ToolsPanel.jsx

The tools panel component providing drawing tool selection and configuration.

**Features:**
- Tool buttons (pen, eraser, shapes, text, selection)
- Color picker with common colors and custom color input
- Stroke width selector (1-12px)
- Undo/redo buttons
- Export menu (PNG/PDF)
- Disabled state for Viewer role

**Props:**
- `selectedTool` - Currently selected tool
- `onToolChange` - Tool change callback
- `toolOptions` - Current tool options
- `onToolOptionsChange` - Tool options change callback
- `onExport` - Export callback
- `onUndo` - Undo callback
- `onRedo` - Redo callback
- `canEdit` - Whether user can edit
- `canUndo` - Whether undo is available
- `canRedo` - Whether redo is available

### 3. WhiteboardContainer.jsx

Container component that integrates Whiteboard and ToolsPanel with the note store.

**Features:**
- Manages tool state and options
- Handles auto-save to note store
- Loads initial whiteboard data from current note
- Coordinates between Whiteboard and ToolsPanel

**Props:**
- `noteId` - Note ID for the whiteboard
- `canEdit` - Whether user can edit
- `enableSync` - Enable real-time synchronization

## Custom Hooks

### 1. useWhiteboardTools.js

Manages drawing tool functionality for the whiteboard.

**Supported Tools:**
- **Pen** - Free-hand drawing with configurable color and width
- **Eraser** - Erases drawn content (white brush)
- **Selection** - Select and move objects
- **Rectangle** - Draw rectangles
- **Circle** - Draw circles
- **Line** - Draw straight lines
- **Arrow** - Draw arrows (implemented as lines)
- **Text** - Add text annotations

### 2. useWhiteboardHistory.js

Manages undo/redo history for the whiteboard.

**Features:**
- Maintains history stack of canvas states (max 50 states)
- Undo functionality (Ctrl+Z / Cmd+Z)
- Redo functionality (Ctrl+Y / Cmd+Shift+Z)
- Automatic state saving on canvas modifications
- History state indicators (canUndo, canRedo)

### 3. useWhiteboardSync.js

Handles real-time synchronization of whiteboard changes via WebSocket.

**Features:**
- Emits drawing updates with 100ms debounce
- Listens for remote drawing updates
- Prevents echo of own updates
- Applies remote updates to canvas
- Integrates with socket store

## Utilities

### whiteboardExport.js

Provides export functionality for the whiteboard canvas.

**Functions:**
- `exportAsPNG(canvas, filename)` - Export canvas as PNG image
- `exportAsPDF(canvas, filename)` - Export canvas as PDF document
- `exportWhiteboard(canvas, format, filename)` - Generic export function

## Usage Example

```jsx
import { WhiteboardContainer } from './components/Notes';

function ContainerPage({ noteId, userRole }) {
  const canEdit = userRole !== 'Viewer';

  return (
    <div className="h-screen">
      <WhiteboardContainer
        noteId={noteId}
        canEdit={canEdit}
        enableSync={true}
      />
    </div>
  );
}
```

## Integration with Note Store

The whiteboard integrates with the note store for auto-save functionality:

1. **Loading**: Initial whiteboard data is loaded from `currentNote.whiteboardData`
2. **Auto-save**: Changes are debounced (500ms) and saved via `updateWhiteboard(noteId, data)`
3. **Real-time sync**: Drawing updates are emitted via WebSocket and applied to other users' canvases

## Real-time Collaboration

The whiteboard supports real-time collaboration through WebSocket events:

1. **Local changes**: Canvas modifications trigger `draw:update` events (100ms debounce)
2. **Remote updates**: Incoming `draw:update` events are applied to the canvas
3. **Conflict prevention**: Own updates are not re-applied when received back

## Keyboard Shortcuts

- **Ctrl+Z / Cmd+Z** - Undo last action
- **Ctrl+Y / Cmd+Shift+Z** - Redo last undone action
- **Ctrl+S / Cmd+S** - Save note (handled by NoteEditor)

## Responsive Design

The whiteboard is fully responsive:

- Canvas automatically resizes to fit container
- Tools panel collapses on mobile (16px width with icons only)
- Touch interactions supported for mobile drawing
- Minimum canvas height: 400px

## Role-Based Access Control

- **Owner/Editor**: Full access to all drawing tools and features
- **Viewer**: Read-only mode, all tools disabled, "View Only" indicator shown

## Performance Considerations

1. **Debouncing**: Auto-save (500ms) and sync (100ms) are debounced to reduce network traffic
2. **History limit**: Maximum 50 history states to prevent memory issues
3. **Retina scaling**: Enabled for high-DPI displays
4. **Lazy loading**: Consider lazy loading Fabric.js for better initial load time

## Future Enhancements

- Collaborative cursors showing other users' positions
- Layer management for complex drawings
- Shape fill options
- More shape types (polygon, star, etc.)
- Image insertion
- Drawing templates
- Pressure sensitivity for stylus input
- Advanced PDF export with jsPDF library
