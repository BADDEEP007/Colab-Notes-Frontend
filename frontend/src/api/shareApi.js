import axiosInstance from './axiosInstance';

/**
 * API module for shareable links
 * Handles generation and validation of shareable links for instances and notes
 */
const shareApi = {
  /**
   * Generate a shareable link for an instance
   * @param {string} instanceId - Instance ID
   * @param {Object} options - Link options
   * @param {string} options.role - Role for the link ('Owner', 'Editor', or 'Viewer')
   * @param {Date} options.expiresAt - Optional expiry date
   * @param {boolean} options.isPublic - Whether the link is public or restricted
   * @returns {Promise} Response with generated link
   */
  generateInstanceLink: (instanceId, options) =>
    axiosInstance.post(`/api/share/instance/${instanceId}`, options),

  /**
   * Generate a shareable link for a note
   * @param {string} noteId - Note ID
   * @param {Object} options - Link options
   * @param {string} options.role - Role for the link ('Editor' or 'Viewer')
   * @param {Date} options.expiresAt - Optional expiry date
   * @param {boolean} options.isPublic - Whether the link is public or restricted
   * @returns {Promise} Response with generated link
   */
  generateNoteLink: (noteId, options) =>
    axiosInstance.post(`/api/share/note/${noteId}`, options),

  /**
   * Validate and access a shareable instance link
   * @param {string} instanceId - Instance ID
   * @param {string} token - Share token
   * @returns {Promise} Response with access details
   */
  accessInstanceLink: (instanceId, token) =>
    axiosInstance.get(`/api/share/instance/${instanceId}/access`, {
      params: { token },
    }),

  /**
   * Validate and access a shareable note link
   * @param {string} noteId - Note ID
   * @param {string} token - Share token
   * @returns {Promise} Response with access details
   */
  accessNoteLink: (noteId, token) =>
    axiosInstance.get(`/api/share/note/${noteId}/access`, {
      params: { token },
    }),

  /**
   * Revoke a shareable link
   * @param {string} linkId - Link ID
   * @returns {Promise} Response confirming revocation
   */
  revokeLink: (linkId) =>
    axiosInstance.delete(`/api/share/link/${linkId}`),

  /**
   * Get all active shareable links for a resource
   * @param {string} resourceType - 'instance' or 'note'
   * @param {string} resourceId - Resource ID
   * @returns {Promise} Response with list of active links
   */
  getActiveLinks: (resourceType, resourceId) =>
    axiosInstance.get(`/api/share/${resourceType}/${resourceId}/links`),
};

export default shareApi;
