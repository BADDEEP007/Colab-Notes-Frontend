import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import NotificationDropdown from '../NotificationDropdown';

/**
 * Dashboard Navbar Component
 * Displays navigation bar with logo, search, profile, and notifications
 * Requirements: 4.4, 19.1, 19.3, 20.4
 */
export default function DashboardNavbar({ onSearch, showSearch = true }) {
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
      if (!event.target.closest('.profile-dropdown-container') && 
          !event.target.closest('.notifications-dropdown-container')) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-fixed glass-container transition-shadow duration-300 ${isScrolled ? 'shadow-glass-hover' : ''}`} 
      style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glass hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy hidden sm:block" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Collab Notes</h1>
          </div>

          {/* Search Bar - Desktop with debounce (300ms) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-navy" style={{ opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search instances..."
                  className="glass-input w-full pl-12 pr-4 py-2.5"
                  aria-label="Search instances"
                />
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Friends Button */}
            <button
              onClick={() => navigate('/friends')}
              className="glass-button p-2.5 sm:p-3 rounded-xl hover:scale-110 transition-all"
              aria-label="Friends"
              title="Friends"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* Notifications Indicator */}
            <div className="notifications-dropdown-container relative">
              <button
                onClick={toggleNotificationsDropdown}
                className="glass-button p-2.5 sm:p-3 rounded-xl hover:scale-110 transition-all relative"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                title="Notifications"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-secondary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glass pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 scale-in">
                  <NotificationDropdown onClose={() => setIsNotificationsOpen(false)} />
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="profile-dropdown-container relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 sm:gap-3 glass-button p-2 sm:p-2.5 rounded-xl hover:scale-105 transition-all"
                aria-label="User menu"
                aria-expanded={isProfileOpen}
                title="Profile menu"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=B3E5FC&color=355C7D`}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-white/50"
                />
                <span className="hidden lg:block text-sm font-medium text-navy max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
                <svg className="hidden sm:block w-4 h-4 text-navy" style={{ opacity: 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-container p-2 scale-in">
                  <div className="px-4 py-3 border-b border-white/30">
                    <p className="text-sm font-semibold text-navy">{user?.name}</p>
                    <p className="text-xs text-navy truncate" style={{ opacity: 0.7 }}>{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-navy hover:bg-white/50 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-coral hover:bg-white/50 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-navy" style={{ opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search instances..."
                className="glass-input w-full pl-12 pr-4 py-2.5"
                aria-label="Search instances"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
