import { create } from 'zustand';
import notesApi from '../api/notesApi';
import shareApi from '../api/shareApi';

/**
 * Note store for managing notes with auto-save functionality
 */
const useNoteStore = create((set, get) => ({
  // State
  notes: [],
  currentNote: null,
  isAutoSaving: false,
  lastSaved: null,
  isLoading: false,
  error: null,
  autoSaveTimeout: null,

  // Actions

  /**
   * Fetch notes for a specific container
   * @param {string} _containerId - Container ID
   */
  fetchNotes: async (_containerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesApi.getAll();
      // Filter notes by container if needed
      const notes = response.data;

      set({ notes, isLoading: false });
      return { success: true, notes };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notes.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetch a single note by title
   * @param {string} title - Note title
   */
  fetchNoteByTitle: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesApi.getByTitle(title);
      const note = response.data;

      set({ currentNote: note, isLoading: false });
      return { success: true, note };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch note.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Create a new note
   * @param {string} containerId - Container ID
   * @param {string} title - Note title
   * @param {string} content - Note content (optional)
   */
  createNote: async (containerId, title, content = '') => {
    set({ isLoading: true, error: null });
    try {
      const noteData = {
        containerId,
        title,
        content,
        whiteboardData: null,
      };

      const response = await notesApi.create(noteData);
      const newNote = response.data;

      set((state) => ({
        notes: [...state.notes, newNote],
        currentNote: newNote,
        isLoading: false,
        lastSaved: new Date(),
      }));

      return { success: true, note: newNote };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create note.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Update a note (with auto-save debouncing)
   * @param {string} noteId - Note ID
   * @param {Object} updates - Partial note object with updates
   * @param {boolean} immediate - Skip debouncing and save immediately
   */
  updateNote: async (noteId, updates, immediate = false) => {
    const state = get();

    // Update local state immediately for optimistic UI
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
      currentNote:
        state.currentNote?.id === noteId ? { ...state.currentNote, ...updates } : state.currentNote,
    }));

    // Clear existing timeout
    if (state.autoSaveTimeout) {
      clearTimeout(state.autoSaveTimeout);
    }

    // If immediate save is requested, save now
    if (immediate) {
      return get().saveNote(noteId, updates);
    }

    // Otherwise, debounce the save (500ms)
    const timeout = setTimeout(() => {
      get().saveNote(noteId, updates);
    }, 500);

    set({ autoSaveTimeout: timeout });
  },

  /**
   * Save note to backend (internal method)
   * @param {string} noteId - Note ID
   * @param {Object} updates - Updates to save
   */
  saveNote: async (noteId, updates) => {
    set({ isAutoSaving: true, error: null });
    try {
      // Find the note to get its title
      const note = get().notes.find((n) => n.id === noteId);
      if (!note) {
        throw new Error('Note not found');
      }

      await notesApi.update(note.title, updates);

      set({
        isAutoSaving: false,
        lastSaved: new Date(),
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save note.';
      set({ isAutoSaving: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Delete a note
   * @param {string} noteId - Note ID
   */
  deleteNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      // Find the note to get its title
      const note = get().notes.find((n) => n.id === noteId);
      if (!note) {
        throw new Error('Note not found');
      }

      await notesApi.delete(note.title);

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete note.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Set the current active note
   * @param {string} noteId - Note ID
   */
  setCurrentNote: (noteId) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (note) {
      set({ currentNote: note });
    }
  },

  /**
   * Update whiteboard data for a note
   * @param {string} noteId - Note ID
   * @param {Object} whiteboardData - Whiteboard data from Fabric.js
   */
  updateWhiteboard: (noteId, whiteboardData) => {
    get().updateNote(noteId, { whiteboardData }, false);
  },

  /**
   * Share a note with another user
   * @param {string} noteId - Note ID
   * @param {string} userId - User ID to share with
   * @param {string} role - Role to assign ('Editor' or 'Viewer')
   */
  shareNote: async (noteId, userId, role) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when note sharing API is implemented
      // const response = await notesApi.share(noteId, { userId, role });

      // Update local state
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                sharedWith: [
                  ...(note.sharedWith || []),
                  { userId, role, sharedAt: new Date().toISOString() },
                ],
              }
            : note
        ),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to share note.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Generate a shareable link for a note
   * @param {string} noteId - Note ID
   * @param {string} role - Role for the link ('Editor' or 'Viewer')
   * @param {Date} expiresAt - Optional expiry date
   * @param {boolean} isPublic - Whether the link is public or restricted
   */
  generateShareLink: async (noteId, role, expiresAt = null, isPublic = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shareApi.generateNoteLink(noteId, {
        role,
        expiresAt,
        isPublic,
      });

      const link = response.data.link || response.data.url;

      set({ isLoading: false });
      return { success: true, link, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate share link.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Handle remote note update from WebSocket
   * @param {Object} data - Update data from socket event
   */
  handleRemoteUpdate: (data) => {
    const { noteId, updates } = data;

    // Don't apply if it's our own update
    // (This check would need the current user ID)
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
      currentNote:
        state.currentNote?.id === noteId ? { ...state.currentNote, ...updates } : state.currentNote,
    }));
  },

  /**
   * Handle remote whiteboard drawing update from WebSocket
   * @param {Object} data - Drawing data from socket event
   */
  handleDrawingUpdate: (data) => {
    const { noteId, whiteboardData } = data;

    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, whiteboardData } : note)),
      currentNote:
        state.currentNote?.id === noteId
          ? { ...state.currentNote, whiteboardData }
          : state.currentNote,
    }));
  },

  /**
   * Handle shared note notification from WebSocket
   * @param {Object} data - Shared note data
   */
  handleSharedNote: (data) => {
    const { note } = data;

    // Add the shared note to the notes list
    set((state) => ({
      notes: [...state.notes, note],
    }));
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Cleanup auto-save timeout on unmount
   */
  cleanup: () => {
    const state = get();
    if (state.autoSaveTimeout) {
      clearTimeout(state.autoSaveTimeout);
      set({ autoSaveTimeout: null });
    }
  },
}));

export default useNoteStore;
