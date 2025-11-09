import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useNoteStore from '../../store/useNoteStore';

/**
 * EditorNavbar Component
 * Navigation bar for the container/editor page with glassmorphism styling
 * Displays container title, auto-save indicator, and profile avatar
 * Requirements: 6.1
 * 
 * @param {Object} props
 * @param {string} props.containerTitle - Title of the container
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {boolean} props.isAutoSaving - Whether auto-save is in progress
 * @param {Date} props.lastSaved - Last saved timestamp
 */
export default function EditorNavbar({ 
  containerTitle = 'Untitled Container', 
  onBack,
  isAutoSaving = false,
  lastSaved = null
}) {
  const { user } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = Math.floor((now - new Date(lastSaved)) / 1000);
    
    if (diff < 5) return 'Saved just now';
    if (diff < 60) return `Saved ${diff}s ago`;
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved at ${new Date(lastSaved).toLocaleTimeString()}`;
  };

  return (
    <nav className={`glass-container sticky top-0 z-fixed transition-shadow duration-300 ${isScrolled ? 'shadow-glass-hover' : ''}`}>
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button and Container title */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1 lg:flex-initial">
            <button
              onClick={onBack}
              className="glass-button p-2 text-navy hover:scale-103 transition-all shrink-0"
              aria-label="Back to instance"
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
              <h1 className="text-base sm:text-xl font-bold text-navy truncate">
                {containerTitle}
              </h1>
            </div>
          </div>

          {/* Center: Auto-save indicator with pulse animation */}
          <div className="flex items-center gap-2 shrink-0">
            {isAutoSaving ? (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse"></div>
                <span className="text-sm text-navy hidden sm:inline">Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-navy hidden sm:inline">
                  {getLastSavedText()}
                </span>
              </>
            ) : null}
          </div>

          {/* Right: Profile avatar dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold hover:scale-103 transition-all shadow-glass"
              aria-label="Profile menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 glass-container scale-in min-w-[200px] z-dropdown">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-glass-border">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-navy opacity-70 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add profile navigation logic here
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-navy hover:bg-glass-bg-light rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add settings navigation logic here
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-navy hover:bg-glass-bg-light rounded-lg transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add logout logic here
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-coral hover:bg-glass-bg-light rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-base"
          onClick={() => setShowProfileMenu(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
