import DashboardNavbar from '../components/Dashboard/Navbar';
import { ProfileInfo, ChangePassword } from '../components/Profile';
import styles from './ProfilePage.module.css';

/**
 * Profile Page Component
 * Displays user profile information and account settings
 * Requirements: 18.1, 18.2, 18.3
 */
export default function ProfilePage() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <DashboardNavbar showSearch={false} />

      {/* Main Content */}
      <main id="main-content" className={styles.main} role="main">
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile information and security settings</p>
        </div>

        {/* Profile Sections */}
        <div className={styles.sections}>
          {/* Profile Information */}
          <ProfileInfo />

          {/* Change Password */}
          <ChangePassword />

          {/* Account Actions */}
          <div className={styles.accountActions}>
            <h2 className={styles.accountActionsTitle}>Account Actions</h2>
            <div className={styles.actionsList}>
              <div className={styles.actionItem}>
                <div className={styles.actionInfo}>
                  <h3>Download Your Data</h3>
                  <p>Export all your notes and data</p>
                </div>
                <button
                  className={`${styles.actionButton} ${styles.primary}`}
                  aria-label="Download data"
                >
                  Download
                </button>
              </div>

              <div className={styles.actionItem}>
                <div className={`${styles.actionInfo} ${styles.danger}`}>
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button
                  className={`${styles.actionButton} ${styles.danger}`}
                  aria-label="Delete account"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
