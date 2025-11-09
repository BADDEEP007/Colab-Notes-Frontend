import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassButton from '../GlassButton';

/**
 * Instance Header Component
 * Displays instance name, invite/share buttons, and profile avatar
 * Requirements: 5.1
 */
export default function InstanceHeader({ 
  instance, 
  userRole, 
  user,
  onOpenInviteModal, 
  onOpenShareModal 
}) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <nav 
      className={`sticky top-0 z-sticky transition-shadow duration-300 ${isScrolled ? 'shadow-glass-hover' : ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(179, 229, 252, 0.8) 0%, rgba(255, 224, 178, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button and Instance name */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1 lg:flex-initial">
            <button
              onClick={handleBackToDashboard}
              className="p-2 text-navy hover:bg-white/30 rounded-lg transition-all duration-300 touch-manipulation shrink-0"
              style={{ color: 'var(--color-muted-navy)' }}
              aria-label="Back to dashboard"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 
                className="text-base sm:text-xl lg:text-2xl font-bold truncate"
                style={{ color: 'var(--color-muted-navy)' }}
              >
                {instance?.name || 'Instance'}
              </h1>
              <p 
                className="text-xs sm:text-sm hidden sm:block"
                style={{ color: 'var(--color-muted-navy)', opacity: 0.8 }}
              >
                Your role: <span className="font-medium">{userRole}</span>
              </p>
            </div>
          </div>

          {/* Right: Action buttons and profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Invite Button - Only for Owners */}
            {userRole === 'Owner' && (
              <GlassButton
                variant="primary"
                onClick={onOpenInviteModal}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm"
                aria-label="Invite members"
              >
                <svg
                  className="h-5 w-5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span className="hidden sm:inline">Invite</span>
              </GlassButton>
            )}

            {/* Share Button - Only for Owners */}
            {userRole === 'Owner' && (
              <GlassButton
                variant="secondary"
                onClick={onOpenShareModal}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm"
                aria-label="Share instance"
              >
                <svg
                  className="h-5 w-5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </GlassButton>
            )}

            {/* Profile Avatar */}
            <div 
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-white font-semibold shadow-glass"
              style={{ background: 'var(--gradient-primary)' }}
              aria-label={`Profile: ${user?.name || 'User'}`}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
