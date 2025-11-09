import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassButton from '../GlassButton';
import styles from './InstanceHeader.module.css';
import clsx from 'clsx';

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
  onOpenShareModal,
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
    <nav className={clsx(styles.header, isScrolled && styles.scrolled)}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left: Back button and Instance name */}
          <div className={styles.leftSection}>
            <button
              onClick={handleBackToDashboard}
              className={styles.backButton}
              aria-label="Back to dashboard"
            >
              <svg
                className={styles.backIcon}
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
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{instance?.name || 'Instance'}</h1>
              <p className={styles.subtitle}>
                Your role: <span className={styles.roleText}>{userRole}</span>
              </p>
            </div>
          </div>

          {/* Right: Action buttons and profile */}
          <div className={styles.rightSection}>
            {/* Invite Button - Only for Owners */}
            {userRole === 'Owner' && (
              <button
                onClick={onOpenInviteModal}
                className={styles.actionButton}
                aria-label="Invite members"
              >
                <svg
                  className={styles.actionIcon}
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
                <span className={styles.actionText}>Invite</span>
              </button>
            )}

            {/* Share Button - Only for Owners */}
            {userRole === 'Owner' && (
              <button
                onClick={onOpenShareModal}
                className={clsx(styles.actionButton, styles.secondaryButton)}
                aria-label="Share instance"
              >
                <svg
                  className={styles.actionIcon}
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
                <span className={styles.actionText}>Share</span>
              </button>
            )}

            {/* Profile Avatar */}
            <div className={styles.avatar} aria-label={`Profile: ${user?.name || 'User'}`}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
