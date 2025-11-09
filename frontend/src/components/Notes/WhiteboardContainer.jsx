import { useState, useRef, lazy, Suspense } from 'react';
import ToolsPanel from './ToolsPanel';
import useNoteStore from '../../store/useNoteStore';
import LoadingSpinner from '../LoadingSpinner';

// Lazy load the heavy Whiteboard component (includes Fabric.js)
const Whiteboard = lazy(() => import('./Whiteboard'));

/**
 * WhiteboardContainer component
 * Integrates Whiteboard with ToolsPanel and handles auto-save to note store
 * 
 * @param {Object} props
 * @param {string} props.noteId - Note ID for the whiteboard
 * @param {boolean} props.canEdit - Whether user can edit the whiteboard
 * @param {boolean} props.enableSync - Enable real-time synchronization
 */
export default function WhiteboardContainer({
  noteId,
  canEdit = true,
  enableSync = true,
}) {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [toolOptions, setToolOptions] = useState({
    color: '#000000',
    strokeWidth: 2,
  });
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const exportRef = useRef(null);

  const { currentNote, updateWhiteboard } = useNoteStore();

  // Handle drawing changes and auto-save
  const handleDrawingChange = (whiteboardData) => {
    if (!noteId) return;
    
    // Update whiteboard data in note store (with debounced auto-save)
    updateWhiteboard(noteId, whiteboardData);
  };

  // Handle tool change
  const handleToolChange = (tool) => {
    setSelectedTool(tool);
  };

  // Handle tool options change
  const handleToolOptionsChange = (options) => {
    setToolOptions(options);
  };

  // Handle undo
  const handleUndo = () => {
    if (undoRef.current) {
      undoRef.current();
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (redoRef.current) {
      redoRef.current();
    }
  };

  // Handle export
  const handleExport = async (format) => {
    if (exportRef.current) {
      try {
        await exportRef.current(format);
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export whiteboard. Please try again.');
      }
    }
  };

  // Handle history state change
  const handleHistoryChange = (state) => {
    setHistoryState(state);
  };

  // Handle remote update
  const handleRemoteUpdate = (data) => {
    console.log('Received remote whiteboard update:', data);
  };

  // Load initial whiteboard data from current note
  const initialData = currentNote?.whiteboardData || null;

  return (
    <div className="flex h-full w-full">
      {/* Tools Panel */}
      <ToolsPanel
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        toolOptions={toolOptions}
        onToolOptionsChange={handleToolOptionsChange}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canEdit={canEdit}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
      />

      {/* Whiteboard Canvas */}
      <div className="flex-1 p-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <Whiteboard
            noteId={noteId}
            canEdit={canEdit}
            onDrawingChange={handleDrawingChange}
            initialData={initialData}
            selectedTool={selectedTool}
            toolOptions={toolOptions}
            onUndo={undoRef}
            onRedo={redoRef}
            onHistoryChange={handleHistoryChange}
            onExport={exportRef}
            enableSync={enableSync}
            onRemoteUpdate={handleRemoteUpdate}
          />
        </Suspense>
      </div>
    </div>
  );
}
