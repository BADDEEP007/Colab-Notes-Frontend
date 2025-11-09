import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import NotificationDropdown from '../NotificationDropdown';
import styles from './Navbar.module.css';

/**
 * Dashboard Navbar Component
 * Displays navigation bar with logo, search, profile, and notifications
 * Requirements: 4.4, 19.1, 19.3, 20.4
 */
export default function DashboardNavbar({ onSearch, showSearch = true, hideProfile = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.profile-dropdown-container') &&
        !event.target.closest('.notifications-dropdown-container')
      ) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Centered Navbar */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navbarContent}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/dashboard')}>
            <div className={styles.logoIcon}>
              <svg
                className={styles.logoIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 3v6a1 1 0 001 1h6"
                />
                <circle cx="17" cy="7" r="2" fill="currentColor" />
              </svg>
            </div>
            <h1 className={styles.logoText}>Collab Notes</h1>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <div className={styles.searchIcon}>
                  <svg
                    className={styles.searchIconSvg}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search your instances"
                  className={styles.searchInput}
                  aria-label="Search instances"
                />
              </div>
            </div>
          )}

          {/* Action Icons */}
          <div className={styles.actions}>
            {/* Friends */}
            <button
              onClick={() => navigate('/friends')}
              className={styles.actionButton}
              aria-label="Friends"
              title="Friends"
            >
              <svg
                className={styles.actionButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigate('/settings')}
              className={styles.actionButton}
              aria-label="Settings"
              title="Settings"
            >
              <svg
                className={styles.actionButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Help */}
            <button
              onClick={() => navigate('/help')}
              className={styles.actionButton}
              aria-label="Help"
              title="Help"
            >
              <svg
                className={styles.actionButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Notifications */}
            <div className={`notifications-dropdown-container ${styles.notificationsContainer}`}>
              <button
                onClick={toggleNotificationsDropdown}
                className={styles.actionButton}
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                title="Notifications"
              >
                <svg
                  className={styles.actionButtonIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className={styles.notificationsDropdown}>
                  <NotificationDropdown onClose={() => setIsNotificationsOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Section - Outside navbar */}
      {!hideProfile && (
        <div className={`profile-dropdown-container ${styles.profileWrapper}`}>
        <button
          onClick={toggleProfileDropdown}
          className={styles.profileButton}
          aria-label="User menu"
          aria-expanded={isProfileOpen}
          title="Profile menu"
        >
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=B3E5FC&color=355C7D`
            }
            alt={user?.name || 'User'}
            className={styles.profileAvatar}
          />
          <span className={styles.profileName}>{user?.name || 'User'}</span>
        </button>

        {isProfileOpen && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileInfo}>
              <p className={styles.profileInfoName}>{user?.name}</p>
              <p className={styles.profileInfoEmail}>{user?.email}</p>
            </div>
            <div className={styles.profileMenu}>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsProfileOpen(false);
                }}
                className={styles.profileMenuItem}
              >
                <svg
                  className={styles.profileMenuItemIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className={`${styles.profileMenuItem} ${styles.profileMenuItemLogout}`}
              >
                <svg
                  className={styles.profileMenuItemIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
        </div>
      )}
    </>
  );
}
