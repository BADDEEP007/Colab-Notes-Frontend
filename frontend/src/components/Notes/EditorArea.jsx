import { useState } from 'react';
import NoteEditor from './NoteEditor';
import Whiteboard from './Whiteboard';

/**
 * EditorArea Component
 * Provides mode switching between Notes and Whiteboard views with smooth transitions
 * Requirements: 6.2
 * 
 * @param {Object} props
 * @param {string} props.noteId - ID of the note being edited
 * @param {string} props.initialContent - Initial note content
 * @param {Object} props.initialWhiteboardData - Initial whiteboard data
 * @param {boolean} props.canEdit - Whether user can edit
 * @param {Function} props.onContentChange - Callback when note content changes
 * @param {Function} props.onDrawingChange - Callback when whiteboard drawing changes
 * @param {Function} props.onInsertContent - Callback to expose insert content method
 * @param {string} props.selectedTool - Currently selected whiteboard tool
 * @param {Object} props.toolOptions - Whiteboard tool options
 * @param {Object} props.undoRef - Ref for undo function
 * @param {Object} props.redoRef - Ref for redo function
 * @param {Function} props.onHistoryChange - Callback when history state changes
 * @param {Object} props.exportRef - Ref for export function
 */
export default function EditorArea({
  noteId,
  initialContent = '',
  initialWhiteboardData = null,
  canEdit = true,
  onContentChange,
  onDrawingChange,
  onInsertContent,
  selectedTool = 'pen',
  toolOptions = { color: '#000000', strokeWidth: 2 },
  undoRef,
  redoRef,
  onHistoryChange,
  exportRef,
}) {
  const [activeMode, setActiveMode] = useState('notes');

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode Switching Tabs */}
      <div className="flex items-center glass-container-light p-1 gap-2 shrink-0">
        <button
          onClick={() => handleModeSwitch('notes')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast
            ${
              activeMode === 'notes'
                ? 'glass-container shadow-glass text-navy'
                : 'text-navy opacity-70 hover:opacity-100 hover:bg-glass-bg-light'
            }
          `}
          aria-label="Switch to notes view"
          aria-pressed={activeMode === 'notes'}
        >
          <svg
            className="h-5 w-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Notes
        </button>
        <button
          onClick={() => handleModeSwitch('whiteboard')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast
            ${
              activeMode === 'whiteboard'
                ? 'glass-container shadow-glass text-navy'
                : 'text-navy opacity-70 hover:opacity-100 hover:bg-glass-bg-light'
            }
          `}
          aria-label="Switch to whiteboard view"
          aria-pressed={activeMode === 'whiteboard'}
        >
          <svg
            className="h-5 w-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          Whiteboard
        </button>
      </div>

      {/* Content Area with smooth transition */}
      <div className="flex-1 overflow-hidden relative">
        {/* Notes View */}
        <div
          className={`
            absolute inset-0 transition-all duration-medium
            ${
              activeMode === 'notes'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 -translate-x-4 pointer-events-none'
            }
          `}
        >
          <NoteEditor
            noteId={noteId}
            initialContent={initialContent}
            canEdit={canEdit}
            onContentChange={onContentChange}
            onInsertContent={onInsertContent}
          />
        </div>

        {/* Whiteboard View with dotted grid background */}
        <div
          className={`
            absolute inset-0 transition-all duration-medium
            ${
              activeMode === 'whiteboard'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 translate-x-4 pointer-events-none'
            }
          `}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(53, 92, 125, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="h-full p-2 sm:p-4">
            <Whiteboard
              noteId={noteId}
              canEdit={canEdit}
              onDrawingChange={onDrawingChange}
              initialData={initialWhiteboardData}
              selectedTool={selectedTool}
              toolOptions={toolOptions}
              onUndo={undoRef}
              onRedo={redoRef}
              onHistoryChange={onHistoryChange}
              onExport={exportRef}
              enableSync={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
