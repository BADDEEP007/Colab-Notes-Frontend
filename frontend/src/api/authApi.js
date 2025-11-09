import axiosInstance from './axiosInstance';

/**
 * Authentication API endpoints
 */
const authApi = {
  /**
   * Register a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise} Registration response
   */
  register: (email, password, name) =>
    axiosInstance.post('/api/auth/register', { email, password, name }),

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response with tokens
   */
  login: (email, password) =>
    axiosInstance.post('/api/auth/login', { email, password }),

  /**
   * Logout current user
   * @returns {Promise} Logout response
   */
  logout: () => axiosInstance.post('/api/auth/logout'),

  /**
   * Refresh authentication token
   * @returns {Promise} New token response
   */
  refreshToken: () => axiosInstance.post('/api/auth/refresh'),

  /**
   * Get current authenticated user
   * @returns {Promise} User data
   */
  getCurrentUser: () => axiosInstance.get('/api/auth/me'),

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  forgotPassword: (email) =>
    axiosInstance.post('/api/auth/forgot-password', { email }),

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise} Response
   */
  resetPassword: (token, newPassword) =>
    axiosInstance.post('/api/auth/reset-password', { token, newPassword }),

  /**
   * Change password for authenticated user
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Response
   */
  changePassword: (oldPassword, newPassword) =>
    axiosInstance.post('/api/auth/change-password', { oldPassword, newPassword }),

  /**
   * Verify email with token
   * @param {string} token - Verification token from email
   * @returns {Promise} Verification response
   */
  verifyEmail: (token) => axiosInstance.get(`/api/auth/verify?token=${token}`),

  /**
   * Send verification email to current user
   * @returns {Promise} Response
   */
  sendVerificationEmail: () => axiosInstance.post('/api/sendmail/verification'),

  /**
   * Recover username by email
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  recoverUsername: (email) =>
    axiosInstance.post('/api/auth/recover-username', { email }),

  /**
   * Google OAuth registration
   * @returns {string} Google OAuth URL
   */
  googleRegisterUrl: () => `${import.meta.env.VITE_API_BASE_URL}/api/google/register`,

  /**
   * Microsoft OAuth registration
   * @returns {string} Microsoft OAuth URL
   */
  microsoftRegisterUrl: () =>
    `${import.meta.env.VITE_API_BASE_URL}/api/microsoft/register`,

  /**
   * Google OAuth login callback
   * @returns {string} Google OAuth callback URL
   */
  googleLoginUrl: () => `${import.meta.env.VITE_API_BASE_URL}/api/google/callback`,

  /**
   * Microsoft OAuth login callback
   * @returns {string} Microsoft OAuth callback URL
   */
  microsoftLoginUrl: () =>
    `${import.meta.env.VITE_API_BASE_URL}/api/microsoft/callback`,
};

export default authApi;
