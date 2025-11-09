import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../../utils/helpers';
import { AUTO_SAVE_DELAY, SOCKET_EVENTS } from '../../utils/constants';
import useNoteStore from '../../store/useNoteStore';
import useSocketStore from '../../store/useSocketStore';
import useAuthStore from '../../store/useAuthStore';
import styles from './NoteEditor.module.css';

/**
 * NoteEditor Component
 * Rich text editing area with auto-save, real-time sync, and collaborative features
 *
 * @param {Object} props
 * @param {string} props.noteId - ID of the note being edited
 * @param {string} props.initialContent - Initial content of the note
 * @param {boolean} props.canEdit - Whether user can edit (based on role)
 * @param {Function} props.onContentChange - Callback when content changes
 * @param {Function} props.onInsertContent - Expose method to insert content (for AI integration)
 */
export default function NoteEditor({
  noteId,
  initialContent = '',
  canEdit = true,
  onContentChange,
  onInsertContent,
}) {
  const [content, setContent] = useState(initialContent);
  const [collaborators, setCollaborators] = useState([]);
  const [isReceivingUpdate, setIsReceivingUpdate] = useState(false);
  const textareaRef = useRef(null);
  const lastEmittedContentRef = useRef(initialContent);
  const cursorPositionRef = useRef(0);

  const { updateNote, isAutoSaving, lastSaved } = useNoteStore();
  const { emitNoteUpdate, isConnected, on, off, joinRoom, leaveRoom } = useSocketStore();
  const { user } = useAuthStore();

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
    lastEmittedContentRef.current = initialContent;
  }, [initialContent]);

  // Join note room for real-time collaboration
  useEffect(() => {
    if (noteId && isConnected) {
      joinRoom(`note:${noteId}`);

      return () => {
        leaveRoom(`note:${noteId}`);
      };
    }
  }, [noteId, isConnected, joinRoom, leaveRoom]);

  // Handle remote note updates from other users
  useEffect(() => {
    if (!noteId || !isConnected) return;

    const handleRemoteNoteUpdate = (data) => {
      // Ignore updates from this user
      if (data.userId === user?.id) return;

      // Ignore if this is the same content we just sent
      if (data.updates?.content === lastEmittedContentRef.current) return;

      setIsReceivingUpdate(true);

      if (data.noteId === noteId && data.updates?.content !== undefined) {
        const newContent = data.updates.content;

        // Save cursor position
        if (textareaRef.current) {
          cursorPositionRef.current = textareaRef.current.selectionStart;
        }

        // Apply operational transformation for concurrent edits
        const transformedContent = applyOperationalTransformation(
          content,
          newContent,
          cursorPositionRef.current
        );

        setContent(transformedContent);

        // Restore cursor position (with adjustment)
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = adjustCursorPosition(
              content,
              transformedContent,
              cursorPositionRef.current
            );
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
          setIsReceivingUpdate(false);
        }, 0);
      }

      // Update collaborators list if provided
      if (data.collaborators) {
        setCollaborators(data.collaborators.filter((c) => c.id !== user?.id));
      }
    };

    on(SOCKET_EVENTS.NOTE_UPDATE, handleRemoteNoteUpdate);

    return () => {
      off(SOCKET_EVENTS.NOTE_UPDATE, handleRemoteNoteUpdate);
    };
  }, [noteId, isConnected, content, user, on, off]);

  /**
   * Simple operational transformation for concurrent edits
   * This is a basic implementation - for production, consider using OT libraries like ShareDB
   */
  const applyOperationalTransformation = (localContent, remoteContent, cursorPos) => {
    // If we're not currently editing, just accept the remote content
    if (!textareaRef.current || document.activeElement !== textareaRef.current) {
      return remoteContent;
    }

    // If contents are the same, no transformation needed
    if (localContent === remoteContent) {
      return localContent;
    }

    // Simple merge strategy: accept remote changes if cursor is not near the change
    // For a more robust solution, implement proper OT algorithm
    const localLines = localContent.split('\n');
    const remoteLines = remoteContent.split('\n');

    // Find cursor line
    const textBeforeCursor = localContent.substring(0, cursorPos);
    const cursorLine = textBeforeCursor.split('\n').length - 1;

    // If remote has more changes and cursor is not in affected area, accept remote
    if (Math.abs(remoteLines.length - localLines.length) > 2) {
      return remoteContent;
    }

    // Otherwise, keep local content (user is actively editing)
    return localContent;
  };

  /**
   * Adjust cursor position after content transformation
   */
  const adjustCursorPosition = (oldContent, newContent, oldPosition) => {
    // If content length is similar, keep position
    if (Math.abs(newContent.length - oldContent.length) < 10) {
      return Math.min(oldPosition, newContent.length);
    }

    // Otherwise, try to maintain relative position
    const relativePosition = oldPosition / (oldContent.length || 1);
    return Math.floor(relativePosition * newContent.length);
  };

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce((noteId, content, userId) => {
      if (canEdit) {
        updateNote(noteId, { content }, false);

        // Emit to other users via WebSocket with userId to prevent echo
        if (isConnected) {
          emitNoteUpdate(noteId, { content, userId });
        }
      }
    }, AUTO_SAVE_DELAY),
    [canEdit, isConnected, updateNote, emitNoteUpdate]
  );

  // Handle content change
  const handleContentChange = (e) => {
    // Don't process changes if we're receiving a remote update
    if (isReceivingUpdate) return;

    const newContent = e.target.value;
    setContent(newContent);
    lastEmittedContentRef.current = newContent;

    // Call parent callback if provided
    if (onContentChange) {
      onContentChange(newContent);
    }

    // Trigger auto-save and emit to other users
    if (canEdit && noteId) {
      debouncedSave(noteId, newContent, user?.id);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl+S or Cmd+S to save immediately
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (canEdit && noteId) {
        updateNote(noteId, { content }, true);
        if (isConnected) {
          emitNoteUpdate(noteId, { content, userId: user?.id });
        }
      }
    }

    // Ctrl+Z or Cmd+Z for undo (browser default, but we can enhance)
    // Ctrl+Y or Cmd+Y for redo (browser default, but we can enhance)
    // These are handled by the browser's native undo/redo for textarea
  };

  /**
   * Insert content at cursor position or at the end
   * Used by AI Panel to insert generated content
   */
  const insertContent = useCallback(
    (textToInsert) => {
      if (!canEdit || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = content;

      // Insert text at cursor position
      const newContent =
        currentContent.substring(0, start) +
        '\n\n' +
        textToInsert +
        '\n\n' +
        currentContent.substring(end);

      setContent(newContent);
      lastEmittedContentRef.current = newContent;

      // Update cursor position after inserted text
      const newCursorPos = start + textToInsert.length + 4; // +4 for the newlines
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);

      // Save the updated content
      if (noteId) {
        updateNote(noteId, { content: newContent }, true);
        if (isConnected) {
          emitNoteUpdate(noteId, { content: newContent, userId: user?.id });
        }
      }

      // Call parent callback if provided
      if (onContentChange) {
        onContentChange(newContent);
      }
    },
    [canEdit, content, noteId, updateNote, isConnected, emitNoteUpdate, user, onContentChange]
  );

  // Expose insertContent method to parent via callback
  useEffect(() => {
    if (onInsertContent) {
      onInsertContent(insertContent);
    }
  }, [onInsertContent, insertContent]);

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

  return (
    <div className={styles.container}>
      {/* Auto-save indicator */}
      <div className={styles.saveIndicator}>
        <div className={styles.saveStatus}>
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

        {!canEdit && (
          <div className={styles.readOnlyBadge}>
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
            <span className={styles.readOnlyText}>Read-only</span>
          </div>
        )}
      </div>

      {/* Collaborative cursor indicators */}
      {collaborators.length > 0 && (
        <div className={styles.collaborators}>
          <span className={styles.collaboratorsText}>
            {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} editing
          </span>
          <div className={styles.collaboratorAvatars}>
            {collaborators.map((collaborator, index) => (
              <div key={index} className={styles.collaboratorAvatar} title={collaborator.name}>
                {collaborator.name?.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text editor */}
      <div className={styles.editorWrapper}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          disabled={!canEdit}
          placeholder={canEdit ? 'Start typing your note...' : 'This note is read-only'}
          className={styles.textarea}
          aria-label="Note content editor"
          aria-readonly={!canEdit}
        />
      </div>

      {/* Keyboard shortcuts hint - Hidden on mobile */}
      {canEdit && (
        <div className={styles.shortcuts}>
          <span className={styles.shortcutsText}>
            Press <kbd className={styles.kbd}>Ctrl+S</kbd> to save manually
          </span>
        </div>
      )}
    </div>
  );
}
