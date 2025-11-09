import axios from 'axios';
import setupMockInterceptor, { USE_MOCK_BACKEND } from '../dummy/mockApiInterceptor';

/**
 * Axios instance with base configuration
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup mock backend interceptor FIRST (if enabled)
setupMockInterceptor(axiosInstance);

/**
 * Request interceptor to add authentication token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for token refresh and error handling
 * Only active when NOT using mock backend
 */
if (!USE_MOCK_BACKEND) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
              { refreshToken }
            );

            const { token } = response.data;
            localStorage.setItem('auth_token', token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
