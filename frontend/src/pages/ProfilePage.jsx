import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/Dashboard/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { ChangePassword } from '../components/Profile';
import useAuthStore from '../store/useAuthStore';
import styles from './ProfilePage.module.css';

/**
 * Profile Page Component
 * Displays user profile information and account settings
 * Requirements: 18.1, 18.2, 18.3
 */
export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gender: user?.gender || 'Not specified',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      gender: user?.gender || 'Not specified',
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <AnimatedBackground variant="dashboard" intensity={0.8} />

      {/* Navbar */}
      <DashboardNavbar showSearch={false} hideProfile={true} />

      {/* Main Content */}
      <main id="main-content" className={styles.main} role="main">
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className={styles.pageTitle}>Profile</h1>
        </div>

        {/* Profile Card */}
        <div className={`glass-container ${styles.profileCard}`}>
          <div className={styles.profileLayout}>
            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=B3E5FC&color=355C7D&size=400`
                  }
                  alt={user?.name || 'User'}
                  className={styles.avatar}
                />
                <button className={styles.cameraButton} aria-label="Change profile picture">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
              {!isEditing ? (
                <div className={styles.viewMode}>
                  <div className={styles.infoField}>
                    <label className={styles.label}>Name:</label>
                    <p className={styles.value}>{user?.name || 'User name'}</p>
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.label}>Email:</label>
                    <div className={styles.emailValue}>
                      <p className={styles.value}>{user?.email || 'user@example.com'}</p>
                      <span className={styles.verifiedBadge}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                          />
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.label}>Gender:</label>
                    <p className={styles.value}>{user?.gender || 'Not specified'}</p>
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.label}>Member Since:</label>
                    <p className={styles.value}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'January 2024'}
                    </p>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      EDIT PROFILE
                    </button>

                    <button className={styles.signOutButton} onClick={handleSignOut}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      SIGN OUT
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.editMode}>
                  <div className={styles.infoField}>
                    <label className={styles.label}>Name:</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.input}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.label}>Email:</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.input}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.label}>Gender:</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className={styles.input}
                    >
                      <option value="Not specified">Not specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.saveButton}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'SAVE CHANGES'}
                    </button>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className={styles.additionalSections}>
          {/* Change Password Component */}
          <div className={styles.sectionWrapper}>
            <ChangePassword />
          </div>
        </div>
      </main>
    </div>
  );
}
