import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

/**
 * PublicRoute component that redirects to dashboard if user is already authenticated
 * Used for auth pages (login, signup) to prevent authenticated users from accessing them
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {React.ReactNode} - Public content or redirect
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect authenticated users to dashboard or their intended destination
  if (isAuthenticated) {
    // Redirect to the page they were trying to access, or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
}
