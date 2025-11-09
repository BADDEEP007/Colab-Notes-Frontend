import { useEffect } from 'react';
import './Sidebar.css';

/**
 * Sidebar Component
 * Navigation sidebar with accessibility features
 * Accessibility: ARIA labels, keyboard navigation, focus management
 */
export default function Sidebar({ isOpen, onToggle }) {
  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={isOpen}
      >
        <div className="sidebar-header">
          <h3 id="sidebar-title">Menu</h3>
          <button
            className="close-btn"
            onClick={onToggle}
            aria-label="Close sidebar"
            aria-controls="sidebar-nav"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav" id="sidebar-nav" aria-labelledby="sidebar-title">
          <ul role="list">
            <li>
              <a href="/" aria-label="Go to Dashboard">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/profile" aria-label="Go to Profile">
                Profile
              </a>
            </li>
            <li>
              <a href="/notes" aria-label="Go to My Notes">
                My Notes
              </a>
            </li>
            <li>
              <a href="/shared" aria-label="Go to Shared Notes">
                Shared Notes
              </a>
            </li>
            <li>
              <a href="/classes" aria-label="Go to Classes">
                Classes
              </a>
            </li>
            <li>
              <a href="/settings" aria-label="Go to Settings">
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info" role="region" aria-label="User information">
            <div className="avatar" aria-hidden="true">
              👤
            </div>
            <div className="user-details">
              <span className="username">John Doe</span>
              <span className="status" role="status" aria-live="polite">
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
        />
      )}
    </>
  );
}