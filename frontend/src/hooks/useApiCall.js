import { useState, useCallback } from 'react';
import { handleApiError, retryWithBackoff } from '../utils/helpers';
import { useToast } from '../components/ToastContainer';

/**
 * Custom hook for making API calls with error handling and loading states
 * Requirements: 1.6, 2.5, all API-related requirements
 */
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useToast();

  /**
   * Execute an API call with error handling
   * @param {Function} apiFunction - Async function that makes the API call
   * @param {Object} options - Options for the API call
   * @param {boolean} options.showErrorToast - Whether to show error toast (default: true)
   * @param {boolean} options.retry - Whether to retry on failure (default: false)
   * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
   * @returns {Promise} Result of the API call
   */
  const execute = useCallback(
    async (apiFunction, options = {}) => {
      const {
        showErrorToast = true,
        retry = false,
        maxRetries = 3,
      } = options;

      setLoading(true);
      setError(null);

      try {
        let result;
        
        if (retry) {
          result = await retryWithBackoff(apiFunction, maxRetries);
        } else {
          result = await apiFunction();
        }

        setLoading(false);
        return result;
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        setLoading(false);

        if (showErrorToast) {
          showError(errorInfo.message);
        }

        throw err;
      }
    },
    [showError]
  );

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    resetError,
  };
}

/**
 * Custom hook for making API calls with manual control
 * Useful when you need to trigger API calls from event handlers
 */
export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { showError, showSuccess } = useToast();

  /**
   * Execute a mutation with error handling
   * @param {Function} mutationFn - Async function that makes the API call
   * @param {Object} options - Options for the mutation
   * @returns {Promise} Result of the mutation
   */
  const mutate = useCallback(
    async (mutationFn, options = {}) => {
      const {
        showErrorToast = true,
        showSuccessToast = false,
        successMessage = 'Operation completed successfully',
        retry = false,
        maxRetries = 3,
      } = options;

      setLoading(true);
      setError(null);

      try {
        let result;
        
        if (retry) {
          result = await retryWithBackoff(mutationFn, maxRetries);
        } else {
          result = await mutationFn();
        }

        setData(result);
        setLoading(false);

        if (showSuccessToast) {
          showSuccess(successMessage);
        }

        return result;
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        setLoading(false);

        if (showErrorToast) {
          showError(errorInfo.message);
        }

        throw err;
      }
    },
    [showError, showSuccess]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
}
