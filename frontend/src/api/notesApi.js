import axiosInstance from './axiosInstance';

/**
 * Notes API endpoints for CRUD operations
 */
const notesApi = {
  /**
   * Get all notes
   * @returns {Promise} List of all notes
   */
  getAll: () => axiosInstance.get('/api/notes/get'),

  /**
   * Get note by title
   * @param {string} title - Note title
   * @returns {Promise} Note data
   */
  getByTitle: (title) =>
    axiosInstance.get(`/api/notes/get/title/${encodeURIComponent(title)}`),

  /**
   * Create a new note
   * @param {Object} noteData - Note data
   * @param {string} noteData.title - Note title
   * @param {string} noteData.content - Note content
   * @param {string} noteData.containerId - Container ID
   * @param {Object} noteData.whiteboardData - Whiteboard data (optional)
   * @returns {Promise} Created note
   */
  create: (noteData) => axiosInstance.post('/api/notes/add', noteData),

  /**
   * Update an existing note
   * @param {string} title - Note title
   * @param {Object} updates - Fields to update
   * @param {string} updates.content - Updated content (optional)
   * @param {Object} updates.whiteboardData - Updated whiteboard data (optional)
   * @returns {Promise} Updated note
   */
  update: (title, updates) =>
    axiosInstance.put(`/api/notes/update/${encodeURIComponent(title)}`, updates),

  /**
   * Delete a note
   * @param {string} title - Note title
   * @returns {Promise} Deletion response
   */
  delete: (title) =>
    axiosInstance.delete('/api/notes/delete', { data: { title } }),

  /**
   * Get notes by container ID
   * @param {string} containerId - Container ID
   * @returns {Promise} List of notes in container
   */
  getByContainer: (containerId) =>
    axiosInstance.get(`/api/notes/container/${containerId}`),

  /**
   * Share note with another user
   * @param {string} noteId - Note ID
   * @param {string} userId - User ID to share with
   * @param {string} role - Role to assign (Editor or Viewer)
   * @returns {Promise} Share response
   */
  share: (noteId, userId, role) =>
    axiosInstance.post(`/api/notes/${noteId}/share`, { userId, role }),

  /**
   * Get notes shared with current user
   * @returns {Promise} List of shared notes
   */
  getSharedWithMe: () => axiosInstance.get('/api/notes/shared'),

  /**
   * Get notes created by current user
   * @returns {Promise} List of user's notes
   */
  getMyNotes: () => axiosInstance.get('/api/notes/my-notes'),
};

export default notesApi;
