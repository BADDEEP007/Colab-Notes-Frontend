import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authApi';

/**
 * Authentication store for managing user authentication state
 * Persists token to localStorage for session management
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions

      /**
       * Login with email and password
       * @param {string} email - User email
       * @param {string} password - User password
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const { token, refreshToken, user } = response.data;

          // Store tokens in localStorage
          localStorage.setItem('auth_token', token);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Login with OAuth provider
       * @param {string} provider - OAuth provider ('google' or 'microsoft')
       */
      loginWithOAuth: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          const url =
            provider === 'google' ? authApi.googleLoginUrl() : authApi.microsoftLoginUrl();

          // Redirect to OAuth provider
          window.location.href = url;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'OAuth login failed.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Register a new user
       * @param {string} email - User email
       * @param {string} password - User password
       * @param {string} name - User name
       */
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(email, password, name);
          const { token, refreshToken, user } = response.data;

          // Store tokens in localStorage
          localStorage.setItem('auth_token', token);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Registration failed. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Logout current user
       */
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens from localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Refresh authentication token
       */
      refreshAuthToken: async () => {
        try {
          const response = await authApi.refreshToken();
          const { token, refreshToken } = response.data;

          // Update tokens in localStorage
          localStorage.setItem('auth_token', token);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }

          set({
            token,
            refreshToken: refreshToken || get().refreshToken,
          });

          return { success: true, token };
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, logout user
          get().logout();
          return { success: false, error: error.message };
        }
      },

      /**
       * Update user information
       * @param {Object} updates - Partial user object with updates
       */
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      /**
       * Check authentication status and load user data
       */
      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authApi.getCurrentUser();
          const user = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid token
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } finally {
          // Ensure loading is always set to false
          set({ isLoading: false });
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
