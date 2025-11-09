import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Whiteboard, NoteEditor, ToolsPanel, AIPanel } from '../components/Notes';
import { ActiveUsersPanel } from '../components/Instance';
import useNoteStore from '../store/useNoteStore';
import useAuthStore from '../store/useAuthStore';
import useInstanceStore from '../store/useInstanceStore';
import styles from './ContainerPage.module.css';

/**
 * Container Page Component
 * Main container view for editing notes with whiteboard and text editor
 * Requirements: 9.1, 9.2, 9.6
 */
export default function ContainerPage() {
  const { instanceId, containerId, noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentInstance, instances } = useInstanceStore();
  const { currentNote, fetchNoteByTitle, updateNote, isAutoSaving, lastSaved } = useNoteStore();

  // View state: 'whiteboard' or 'editor'
  const [activeView, setActiveView] = useState('whiteboard');
  const [isLoading, setIsLoading] = useState(true);

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
  const instance = currentInstance || instances.find((inst) => inst.id === instanceId);

  // Determine user's role in the instance
  const getUserRole = useCallback(() => {
    if (!instance || !user) return 'Viewer';

    // Check if user is the owner
    if (instance.ownerId === user.id) return 'Owner';

    // Check member role
    const member = instance.members?.find((m) => m.userId === user.id);
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
        // In a real implementation, we'd fetch by noteId
        // For now, we'll use a placeholder
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

  // Handle view toggle
  const handleViewToggle = (view) => {
    setActiveView(view);
  };

  // Handle tool change
  const handleToolChange = (tool) => {
    setSelectedTool(tool);
  };

  // Handle tool options change
  const handleToolOptionsChange = (options) => {
    setToolOptions(options);
  };

  // Handle whiteboard drawing change
  const handleDrawingChange = useCallback(
    (whiteboardData) => {
      if (noteId && canEdit) {
        updateNote(noteId, { whiteboardData }, false);
      }
    },
    [noteId, canEdit, updateNote]
  );

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

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return '';

    const now = new Date();
    const diff = Math.floor((now - new Date(lastSaved)) / 1000);

    if (diff < 5) return 'Saved just now';
    if (diff < 60) return `Saved ${diff}s ago`;
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved at ${new Date(lastSaved).toLocaleTimeString()}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navbar with auto-save indicator */}
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <div className={styles.navbarContent}>
            {/* Left: Back button and Note title */}
            <div className={styles.navbarLeft}>
              <button
                onClick={handleBackToInstance}
                className={styles.backButton}
                aria-label="Back to instance"
              >
                <svg
                  className={styles.backButtonIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className={styles.noteInfo}>
                <h1 className={styles.noteTitle}>{currentNote?.title || 'Untitled Note'}</h1>
                <p className={styles.instanceName}>{instance?.name || 'Instance'}</p>
              </div>
            </div>

            {/* Center: View toggle */}
            <div className={styles.viewToggle}>
              <button
                onClick={() => handleViewToggle('whiteboard')}
                className={`${styles.viewButton} ${activeView === 'whiteboard' ? styles.active : ''}`}
                aria-label="Switch to whiteboard view"
                aria-pressed={activeView === 'whiteboard'}
              >
                <svg
                  className={styles.viewButtonIcon}
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
                <span className={styles.viewButtonLabel}>Whiteboard</span>
              </button>
              <button
                onClick={() => handleViewToggle('editor')}
                className={`${styles.viewButton} ${activeView === 'editor' ? styles.active : ''}`}
                aria-label="Switch to text editor view"
                aria-pressed={activeView === 'editor'}
              >
                <svg
                  className={styles.viewButtonIcon}
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
                <span className={styles.viewButtonLabel}>Text Editor</span>
              </button>
            </div>

            {/* Right: Auto-save indicator and profile */}
            <div className={styles.navbarRight}>
              {/* Auto-save indicator */}
              <div className={styles.saveIndicator}>
                {isAutoSaving ? (
                  <>
                    <div className={`${styles.saveDot} ${styles.saving}`}></div>
                    <span className={styles.saveText}>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <div className={`${styles.saveDot} ${styles.saved}`}></div>
                    <span className={styles.saveText}>{getLastSavedText()}</span>
                  </>
                ) : null}
              </div>

              {/* Mobile save indicator - just the dot */}
              <div className={styles.saveIndicatorMobile}>
                {isAutoSaving ? (
                  <div className={`${styles.saveDot} ${styles.saving}`} title="Saving..."></div>
                ) : lastSaved ? (
                  <div
                    className={`${styles.saveDot} ${styles.saved}`}
                    title={getLastSavedText()}
                  ></div>
                ) : null}
              </div>

              {/* Profile Avatar - Hidden on mobile */}
              <div className={styles.profileAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Tools Panel - Only show for whiteboard view, horizontal on mobile */}
          {activeView === 'whiteboard' && (
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
          )}

          {/* Main Content */}
          <main className={styles.editorArea}>
            {activeView === 'whiteboard' ? (
              <div className={styles.whiteboardWrapper}>
                <Whiteboard
                  noteId={noteId}
                  canEdit={canEdit}
                  onDrawingChange={handleDrawingChange}
                  initialData={currentNote?.whiteboardData}
                  selectedTool={selectedTool}
                  toolOptions={toolOptions}
                  onUndo={undoRef}
                  onRedo={redoRef}
                  onHistoryChange={handleHistoryChange}
                  onExport={exportRef}
                  enableSync={true}
                />
              </div>
            ) : (
              <NoteEditor
                noteId={noteId}
                initialContent={currentNote?.content || ''}
                canEdit={canEdit}
                onContentChange={handleContentChange}
                onInsertContent={handleInsertContent}
              />
            )}
          </main>
        </div>

        {/* AI Panel - Only show for text editor view */}
        {activeView === 'editor' && (
          <AIPanel
            noteId={noteId}
            noteContent={currentNote?.content || ''}
            onInsertContent={insertAIContent}
            canEdit={canEdit}
          />
        )}
      </div>

      {/* Active Users Panel */}
      <ActiveUsersPanel noteId={noteId} />

      {/* Read-only indicator for viewers */}
      {!canEdit && (
        <div className={styles.readOnlyBadge}>
          <div className={styles.readOnlyContent}>
            <svg
              className={styles.readOnlyIcon}
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
            <span className={styles.readOnlyText}>View Only Mode</span>
          </div>
        </div>
      )}
    </div>
  );
}
