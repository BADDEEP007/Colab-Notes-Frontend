import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import shareApi from '../api/shareApi';
import useAuthStore from '../store/useAuthStore';
import styles from './ShareLinkAccessPage.module.css';

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
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Status Icon */}
        <div className={styles.iconContainer}>
          {status === 'validating' && (
            <svg className={styles.spinIcon} fill="none" viewBox="0 0 24 24">
              <circle
                className={styles.opacityLow}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className={styles.opacityMedium}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {status === 'success' && (
            <svg
              className={styles.successIcon}
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
              className={styles.expiredIcon}
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
              className={styles.restrictedIcon}
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
            <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h1 className={styles.title}>
          {status === 'validating' && 'Validating Link'}
          {status === 'success' && 'Access Granted'}
          {status === 'expired' && 'Link Expired'}
          {status === 'restricted' && 'Login Required'}
          {status === 'error' && 'Access Denied'}
        </h1>

        <p className={styles.message}>{message}</p>

        {/* Access Details */}
        {accessDetails && status === 'success' && (
          <div className={styles.detailsCard}>
            <div className={styles.detailsList}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Resource Type:</span>
                <span className={styles.detailValue}>{resourceType}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Access Level:</span>
                <span className={styles.detailValue}>{accessDetails.role}</span>
              </div>
              {accessDetails.expiresAt && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Expires:</span>
                  <span className={styles.detailValue}>
                    {new Date(accessDetails.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          {status === 'restricted' && (
            <button onClick={handleLoginRedirect} className={styles.primaryButton}>
              Log In to Continue
            </button>
          )}

          {(status === 'error' || status === 'expired') && (
            <button onClick={() => navigate('/')} className={styles.primaryButton}>
              Go to Dashboard
            </button>
          )}

          {status !== 'validating' && status !== 'success' && (
            <button onClick={() => navigate(-1)} className={styles.secondaryButton}>
              Go Back
            </button>
          )}
        </div>

        {/* Help Text */}
        {status === 'expired' && (
          <p className={styles.helpText}>
            This link has expired. Please request a new share link from the owner.
          </p>
        )}

        {status === 'error' && (
          <p className={styles.helpText}>
            If you believe this is an error, please contact the person who shared this link.
          </p>
        )}
      </div>
    </div>
  );
}
