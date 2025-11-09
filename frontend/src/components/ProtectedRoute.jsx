import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';
import styles from './ProtectedRoute.module.css';

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * Also handles permission checking for resources
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Function} [props.checkPermission] - Optional function to check permissions before rendering
 * @param {string} [props.redirectTo] - Optional redirect path if permission check fails
 * @returns {React.ReactNode} - Protected content or redirect
 */
export default function ProtectedRoute({ children, checkPermission, redirectTo = '/dashboard' }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions if a permission check function is provided
  if (checkPermission && !checkPermission()) {
    // Redirect to specified path if permission check fails
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
