import { useState } from 'react';
import { WhiteboardContainer } from './index';

/**
 * Example usage of WhiteboardContainer component
 * This demonstrates how to integrate the whiteboard into a container/note page
 *
 * NOTE: This example file uses inline Tailwind classes for demonstration purposes only.
 * In production code, use CSS Modules as shown in the actual component implementations.
 */
export default function WhiteboardExample() {
  const [noteId] = useState('example-note-123');
  const [userRole] = useState('Editor'); // Can be 'Owner', 'Editor', or 'Viewer'

  const canEdit = userRole !== 'Viewer';

  return (
    <div className="h-screen flex flex-col">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold">Whiteboard Example</h1>
        <p className="text-sm text-gray-600">
          Role: {userRole} | Can Edit: {canEdit ? 'Yes' : 'No'}
        </p>
      </header>

      {/* Whiteboard Container */}
      <main className="flex-1 overflow-hidden">
        <WhiteboardContainer noteId={noteId} canEdit={canEdit} enableSync={true} />
      </main>
    </div>
  );
}

/**
 * Example: Using individual Whiteboard and ToolsPanel components
 * This gives you more control over the layout and state management
 */
export function WhiteboardCustomExample() {
  const [noteId] = useState('example-note-456');
  const [selectedTool, setSelectedTool] = useState('pen');
  const [toolOptions, setToolOptions] = useState({
    color: '#000000',
    strokeWidth: 2,
  });
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const handleDrawingChange = (whiteboardData) => {
    console.log('Whiteboard data changed:', whiteboardData);
    // Save to note store or backend
  };

  const handleHistoryChange = (state) => {
    setHistoryState(state);
  };

  return (
    <div className="h-screen flex">
      {/* Custom Tools Panel */}
      <div className="w-20 bg-gray-50 border-r">
        <ToolsPanel
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          toolOptions={toolOptions}
          onToolOptionsChange={setToolOptions}
          onExport={(format) => console.log('Export as', format)}
          onUndo={() => console.log('Undo')}
          onRedo={() => console.log('Redo')}
          canEdit={true}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
        />
      </div>

      {/* Custom Whiteboard */}
      <div className="flex-1 p-4">
        <Whiteboard
          noteId={noteId}
          canEdit={true}
          onDrawingChange={handleDrawingChange}
          initialData={null}
          selectedTool={selectedTool}
          toolOptions={toolOptions}
          onHistoryChange={handleHistoryChange}
          enableSync={true}
        />
      </div>
    </div>
  );
}

/**
 * Example: Whiteboard with custom toolbar
 */
export function WhiteboardWithCustomToolbar() {
  const [noteId] = useState('example-note-789');
  const [selectedTool, setSelectedTool] = useState('pen');

  return (
    <div className="h-screen flex flex-col">
      {/* Custom Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setSelectedTool('pen')}
          className={`px-4 py-2 rounded ${
            selectedTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Pen
        </button>
        <button
          onClick={() => setSelectedTool('eraser')}
          className={`px-4 py-2 rounded ${
            selectedTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Eraser
        </button>
        <button
          onClick={() => setSelectedTool('rectangle')}
          className={`px-4 py-2 rounded ${
            selectedTool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => setSelectedTool('text')}
          className={`px-4 py-2 rounded ${
            selectedTool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Text
        </button>
      </div>

      {/* Whiteboard */}
      <div className="flex-1 p-4">
        <Whiteboard
          noteId={noteId}
          canEdit={true}
          selectedTool={selectedTool}
          toolOptions={{ color: '#000000', strokeWidth: 2 }}
          enableSync={false}
        />
      </div>
    </div>
  );
}
