import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditorNavbar from '../components/Notes/EditorNavbar';
import ToolsPanel from '../components/Notes/ToolsPanel';
import EditorArea from '../components/Notes/EditorArea';
import ActiveUsersPanel from '../components/Instance/ActiveUsersPanel';
import ActionToolbar from '../components/Notes/ActionToolbar';
import AnimatedBackground from '../components/AnimatedBackground';
import useNoteStore from '../store/useNoteStore';
import useAuthStore from '../store/useAuthStore';
import useInstanceStore from '../store/useInstanceStore';

/**
 * Container Page Component with Glassmorphism Design
 * Main container view for editing notes with whiteboard and text editor
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.2
 */
export default function ContainerPageGlass() {
  const { instanceId, containerId, noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentInstance, instances } = useInstanceStore();
  const { currentNote, fetchNoteByTitle, updateNote, isAutoSaving, lastSaved } = useNoteStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('notes');

  // Whiteboard state
  const [selectedTool, setSelectedTool] = useState('pen');
  const [toolOptions, setToolOptions] = useState({
    color: '#000000',
    strokeWidth: 2,
  });
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  // Refs for whiteboard actions
  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const exportRef = useRef(null);

  // Ref for note editor insert content function
  const insertContentRef = useRef(null);

  // Get the instance to determine user role
  const instance = currentInstance || instances.find(inst => inst.id === instanceId);

  // Determine user's role in the instance
  const getUserRole = useCallback(() => {
    if (!instance || !user) return 'Viewer';
    
    // Check if user is the owner
    if (instance.ownerId === user.id) return 'Owner';
    
    // Check member role
    const member = instance.members?.find(m => m.userId === user.id);
    return member?.role || 'Viewer';
  }, [instance, user]);

  const userRole = getUserRole();
  const canEdit = userRole === 'Owner' || userRole === 'Editor';

  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        await fetchNoteByTitle(noteId);
      } catch (error) {
        console.error('Failed to load note:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [noteId, fetchNoteByTitle]);

  // Handle navigation back to instance
  const handleBackToInstance = () => {
    navigate(`/instance/${instanceId}`);
  };

  // Handle tool change
  const handleToolChange = (tool) => {
    if (tool === 'clear') {
      // Clear canvas logic would go here
      return;
    }
    setSelectedTool(tool);
  };

  // Handle tool options change
  const handleToolOptionsChange = (options) => {
    setToolOptions(options);
  };

  // Handle whiteboard drawing change
  const handleDrawingChange = useCallback((whiteboardData) => {
    if (noteId && canEdit) {
      updateNote(noteId, { whiteboardData }, false);
    }
  }, [noteId, canEdit, updateNote]);

  // Handle note content change
  const handleContentChange = useCallback((content) => {
    // Content change is handled by NoteEditor component
  }, []);

  // Handle AI content insertion
  const handleInsertContent = useCallback((insertFn) => {
    insertContentRef.current = insertFn;
  }, []);

  // Insert AI-generated content into note
  const insertAIContent = useCallback((content) => {
    if (insertContentRef.current) {
      insertContentRef.current(content);
    }
  }, []);

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
      await exportRef.current(format);
    }
  };

  // Handle history state change
  const handleHistoryChange = (state) => {
    setHistoryState(state);
  };

  // Handle share
  const handleShare = () => {
    // Share modal logic would go here
    console.log('Share note');
  };

  // Handle AI assist
  const handleAIAssist = () => {
    // AI assist logic would go here
    console.log('AI assist');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <AnimatedBackground variant="minimal" />
        <div className="text-center glass-container p-8 scale-in">
          <div className="spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-sky-blue)' }}></div>
          <p className="text-navy">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="minimal" />

      {/* Editor Navbar */}
      <EditorNavbar
        containerTitle={currentNote?.title || 'Untitled Note'}
        onBack={handleBackToInstance}
        isAutoSaving={isAutoSaving}
        lastSaved={lastSaved}
      />

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-base">
        {/* Tools Panel - Only show for whiteboard view on desktop, horizontal on mobile */}
        {activeMode === 'whiteboard' && (
          <div className="md:block">
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
          </div>
        )}

        {/* Editor Area */}
        <main className="flex-1 overflow-hidden p-4">
          <EditorArea
            noteId={noteId}
            initialContent={currentNote?.content || ''}
            initialWhiteboardData={currentNote?.whiteboardData}
            canEdit={canEdit}
            onContentChange={handleContentChange}
            onDrawingChange={handleDrawingChange}
            onInsertContent={handleInsertContent}
            selectedTool={selectedTool}
            toolOptions={toolOptions}
            undoRef={undoRef}
            redoRef={redoRef}
            onHistoryChange={handleHistoryChange}
            exportRef={exportRef}
          />
        </main>
      </div>

      {/* Active Users Panel */}
      <ActiveUsersPanel noteId={noteId} />

      {/* Action Toolbar */}
      <ActionToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onShare={handleShare}
        onAIAssist={handleAIAssist}
        onExport={handleExport}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
        canEdit={canEdit}
      />

      {/* Read-only indicator for viewers */}
      {!canEdit && (
        <div className="fixed top-20 right-4 glass-container px-4 py-2 z-sticky fade-in">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-coral"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium text-navy">
              View Only Mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
