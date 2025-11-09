import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import useAuthStore from './store/useAuthStore';

// Lazy load page components for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const EmailVerificationPage = lazy(() => import('./pages/EmailVerificationPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InstancePage = lazy(() => import('./pages/InstancePage'));
const ContainerPage = lazy(() => import('./pages/ContainerPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ShareLinkAccessPage = lazy(() => import('./pages/ShareLinkAccessPage'));

/**
 * Skip to Main Content Link Component
 * Provides keyboard users a way to skip navigation and go directly to main content
 */


/**
 * Main App Component with Routing
 * Configures BrowserRouter with protected and public routes
 * Checks authentication status on mount
 */
export default function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // Check authentication status on app initialization
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <SkipToMainContent />
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingSpinner size="large" />
              </div>
            }
          >
            <Routes>
              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route path="/verify-email" element={<EmailVerificationPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instance/:instanceId"
                element={
                  <ProtectedRoute>
                    <InstancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instance/:instanceId/container/:containerId/note/:noteId"
                element={
                  <ProtectedRoute>
                    <ContainerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <FriendsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/share/instance/:resourceId"
                element={<ShareLinkAccessPage />}
              />
              <Route
                path="/share/note/:resourceId"
                element={<ShareLinkAccessPage />}
              />
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
              />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}
