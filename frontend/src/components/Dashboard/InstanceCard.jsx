import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InstanceCard.module.css';

/**
 * Instance Card Component - Improved with Glassmorphism
 * Displays instance information with better spacing and design
 */
const InstanceCard = memo(function InstanceCard({ instance, onRename, onDelete, onShare }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { id, name, members = [], role = 'Viewer', updatedAt } = instance;
  const memberCount = members.length || 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCardClick = useCallback(() => {
    navigate(`/instance/${id}`);
  }, [navigate, id]);

  const handleMenuToggle = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleRename = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      if (onRename) {
        const newName = prompt('Enter new instance name:', name);
        if (newName && newName.trim() !== '') {
          onRename(id, newName.trim());
        }
      }
    },
    [onRename, id, name]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      if (onDelete) {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${name}"? This action cannot be undone.`
        );
        if (confirmed) {
          onDelete(id);
        }
      }
    },
    [onDelete, id, name]
  );

  const handleShare = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      if (onShare) {
        onShare(id);
      }
    },
    [onShare, id]
  );

  // Format date
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  // Role badge color gradients
  const roleColors = {
    Owner: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    Editor: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
    Viewer: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
  };

  return (
    <div
      onClick={handleCardClick}
      className={styles.card}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`Open ${name} instance`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{name}</h3>
          <span
            className={styles.roleBadge}
            style={{ background: roleColors[role] || roleColors.Viewer }}
          >
            {role}
          </span>
        </div>

        {/* Context Menu Button */}
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className={styles.menuButton}
            aria-label="Instance options"
            aria-expanded={isMenuOpen}
            title="More options"
          >
            <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* Context Menu (rename, delete, share) */}
          {isMenuOpen && (
            <div className={styles.menu}>
              <button onClick={handleRename} className={styles.menuItem}>
                <svg
                  className={styles.menuItemIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Rename
              </button>
              <button onClick={handleShare} className={styles.menuItem}>
                <svg
                  className={styles.menuItemIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.menuItem} ${styles.menuItemDelete}`}
              >
                <svg
                  className={styles.menuItemIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats - Member count and last updated */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className={styles.statText}>
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </span>
        </div>
        <div className={styles.stat}>
          <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={styles.statText}>{formattedDate}</span>
        </div>
      </div>

      {/* Hover Arrow - Click handler for navigation */}
      <div className={styles.hoverArrow}>
        <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </div>
  );
});

export default InstanceCard;
