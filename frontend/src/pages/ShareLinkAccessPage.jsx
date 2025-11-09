import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import shareApi from '../api/shareApi';
import useAuthStore from '../store/useAuthStore';

/**
 * ShareLinkAccess Page Component
 * Handles access to shared instances and notes via shareable links
 * Requirements: 13.4, 13.5
 */
export default function ShareLinkAccessPage() {
  const { resourceType, resourceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [status, setStatus] = useState('validating'); // validating, success, error, expired, restricted
  const [message, setMessage] = useState('Validating share link...');
  const [accessDetails, setAccessDetails] = useState(null);

  useEffect(() => {
    validateAndAccessLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceType, resourceId]);

  const validateAndAccessLink = async () => {
    try {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid share link: Missing token');
        return;
      }

      let response;
      
      // Call appropriate API based on resource type
      if (resourceType === 'instance') {
        response = await shareApi.accessInstanceLink(resourceId, token);
      } else if (resourceType === 'note') {
        response = await shareApi.accessNoteLink(resourceId, token);
      } else {
        setStatus('error');
        setMessage('Invalid share link: Unknown resource type');
        return;
      }

      const data = response.data;

      // Check if link has expired
      if (data.expired) {
        setStatus('expired');
        setMessage('This share link has expired');
        return;
      }

      // Check if restricted access requires authentication
      if (data.isRestricted && !isAuthenticated) {
        setStatus('restricted');
        setMessage('This link requires you to be logged in');
        setAccessDetails(data);
        return;
      }

      // Access granted
      setStatus('success');
      setMessage('Access granted! Redirecting...');
      setAccessDetails(data);

      // Redirect to the resource after a short delay
      setTimeout(() => {
        if (resourceType === 'instance') {
          navigate(`/instance/${resourceId}`);
        } else if (resourceType === 'note') {
          // Navigate to the note's container page
          const { instanceId, containerId } = data;
          navigate(`/instance/${instanceId}/container/${containerId}/note/${resourceId}`);
        }
      }, 1500);

    } catch (error) {
      console.error('Error accessing share link:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to access share link';
      const errorStatus = error.response?.status;

      if (errorStatus === 404) {
        setStatus('error');
        setMessage('Share link not found or has been revoked');
      } else if (errorStatus === 410) {
        setStatus('expired');
        setMessage('This share link has expired');
      } else if (errorStatus === 403) {
        setStatus('restricted');
        setMessage('You do not have permission to access this resource');
      } else {
        setStatus('error');
        setMessage(errorMessage);
      }
    }
  };

  const handleLoginRedirect = () => {
    // Store the current URL to redirect back after login
    const returnUrl = window.location.pathname + window.location.search;
    navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'validating' && (
            <svg
              className="animate-spin h-16 w-16 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {status === 'success' && (
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          {status === 'expired' && (
            <svg
              className="h-16 w-16 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          {status === 'restricted' && (
            <svg
              className="h-16 w-16 text-orange-600"
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
          )}

          {status === 'error' && (
            <svg
              className="h-16 w-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Status Message */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          {status === 'validating' && 'Validating Link'}
          {status === 'success' && 'Access Granted'}
          {status === 'expired' && 'Link Expired'}
          {status === 'restricted' && 'Login Required'}
          {status === 'error' && 'Access Denied'}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Access Details */}
        {accessDetails && status === 'success' && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Resource Type:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {resourceType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Access Level:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {accessDetails.role}
                </span>
              </div>
              {accessDetails.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(accessDetails.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === 'restricted' && (
            <button
              onClick={handleLoginRedirect}
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Log In to Continue
            </button>
          )}

          {(status === 'error' || status === 'expired') && (
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Go to Dashboard
            </button>
          )}

          {status !== 'validating' && status !== 'success' && (
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>

        {/* Help Text */}
        {status === 'expired' && (
          <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
            This link has expired. Please request a new share link from the owner.
          </p>
        )}

        {status === 'error' && (
          <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact the person who shared this link.
          </p>
        )}
      </div>
    </div>
  );
}
