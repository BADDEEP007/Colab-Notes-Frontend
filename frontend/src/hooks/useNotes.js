/**
 * Custom hook for note CRUD operations
 * Provides a clean interface for managing notes with proper error handling
 */
import { useCallback } from 'react';
import useNoteStore from '../store/useNoteStore';
import { handleApiError } from '../utils/helpers';

/**
 * Hook for note CRUD operations
 * @returns {Object} Note operations and state
 */
export const useNotes = () => {
  const {
    notes,
    currentNote,
    isLoading,
    isAutoSaving,
    lastSaved,
    error,
    fetchNotes,
    fetchNoteByTitle,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    updateWhiteboard,
    shareNote,
    clearError,
  } = useNoteStore();

  /**
   * Create a new note
   * @param {string} containerId - Container ID
   * @param {string} title - Note title
   * @param {string} content - Initial content (optional)
   * @returns {Promise<Object>} Result with success status and note data
   */
  const handleCreateNote = useCallback(
    async (containerId, title, content = '') => {
      try {
        const result = await createNote(containerId, title, content);

        if (!result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true, note: result.note };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [createNote]
  );

  /**
   * Fetch a note by its title
   * @param {string} title - Note title
   * @returns {Promise<Object>} Result with success status and note data
   */
  const handleFetchNoteByTitle = useCallback(
    async (title) => {
      try {
        const result = await fetchNoteByTitle(title);

        if (!result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true, note: result.note };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [fetchNoteByTitle]
  );

  /**
   * Update a note
   * @param {string} noteId - Note ID
   * @param {Object} updates - Updates to apply
   * @param {boolean} immediate - Whether to save immediately (skip debounce)
   * @returns {Promise<Object>} Result with success status
   */
  const handleUpdateNote = useCallback(
    async (noteId, updates, immediate = false) => {
      try {
        const result = await updateNote(noteId, updates, immediate);

        if (result && !result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [updateNote]
  );

  /**
   * Delete a note
   * @param {string} noteId - Note ID
   * @returns {Promise<Object>} Result with success status
   */
  const handleDeleteNote = useCallback(
    async (noteId) => {
      try {
        const result = await deleteNote(noteId);

        if (!result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [deleteNote]
  );

  /**
   * Fetch all notes for a container
   * @param {string} containerId - Container ID
   * @returns {Promise<Object>} Result with success status and notes array
   */
  const handleFetchNotes = useCallback(
    async (containerId) => {
      try {
        const result = await fetchNotes(containerId);

        if (!result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true, notes: result.notes };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [fetchNotes]
  );

  /**
   * Share a note with another user
   * @param {string} noteId - Note ID
   * @param {string} userId - User ID to share with
   * @param {string} role - Role to assign ('Editor' or 'Viewer')
   * @returns {Promise<Object>} Result with success status
   */
  const handleShareNote = useCallback(
    async (noteId, userId, role) => {
      try {
        const result = await shareNote(noteId, userId, role);

        if (!result.success) {
          const errorInfo = handleApiError({ response: { data: { message: result.error } } });
          return { success: false, error: errorInfo.message };
        }

        return { success: true };
      } catch (err) {
        const errorInfo = handleApiError(err);
        return { success: false, error: errorInfo.message };
      }
    },
    [shareNote]
  );

  /**
   * Update whiteboard data for a note
   * @param {string} noteId - Note ID
   * @param {Object} whiteboardData - Whiteboard data from Fabric.js
   */
  const handleUpdateWhiteboard = useCallback(
    (noteId, whiteboardData) => {
      updateWhiteboard(noteId, whiteboardData);
    },
    [updateWhiteboard]
  );

  return {
    // State
    notes,
    currentNote,
    isLoading,
    isAutoSaving,
    lastSaved,
    error,

    // Operations
    createNote: handleCreateNote,
    fetchNoteByTitle: handleFetchNoteByTitle,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
    fetchNotes: handleFetchNotes,
    shareNote: handleShareNote,
    updateWhiteboard: handleUpdateWhiteboard,
    setCurrentNote,
    clearError,
  };
};

export default useNotes;
