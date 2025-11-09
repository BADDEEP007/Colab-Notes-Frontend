import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import authApi from '../../api/authApi';
import { useToast } from '../ToastContainer';
import LoadingSpinner from '../LoadingSpinner';
import styles from './ProfileInfo.module.css';

/**
 * ProfileInfo Component
 * Displays user information with edit capabilities
 * Requirements: 18.3
 */
export default function ProfileInfo() {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Update user profile (assuming there's an update endpoint)
      // For now, we'll just update the local state
      updateUser({
        name: formData.name,
        email: formData.email,
      });

      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await authApi.sendVerificationEmail();
      showToast('Verification email sent successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send verification email', 'error');
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile Information</h2>
        {!isEditing && (
          <button onClick={handleEdit} className={styles.editButton} aria-label="Edit profile">
            Edit Profile
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div className={styles.avatarInfo}>
            <p className={styles.avatarLabel}>Profile Picture</p>
            <p className={styles.avatarDescription}>Avatar based on your name</p>
          </div>
        </div>

        {/* Name Field */}
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your name"
            />
          ) : (
            <p className={styles.value}>{user?.name || 'Not set'}</p>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div className={styles.emailContainer}>
            <p className={styles.emailValue}>{user?.email || 'Not set'}</p>
            {user?.emailVerified ? (
              <span className={`${styles.badge} ${styles.badgeVerified}`}>
                <svg
                  className={styles.badgeIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            ) : (
              <span className={`${styles.badge} ${styles.badgeUnverified}`}>
                <svg
                  className={styles.badgeIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Unverified
              </span>
            )}
          </div>
          {!user?.emailVerified && (
            <button
              onClick={handleSendVerification}
              disabled={isSendingVerification}
              className={styles.verificationButton}
            >
              {isSendingVerification ? (
                <span className={styles.verificationButtonContent}>
                  <LoadingSpinner size="small" className="mr-2" />
                  Sending...
                </span>
              ) : (
                'Send verification email'
              )}
            </button>
          )}
        </div>

        {/* Account Created */}
        <div className={styles.field}>
          <label className={styles.label}>Member Since</label>
          <p className={styles.value}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Unknown'}
          </p>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className={styles.actions}>
            <button onClick={handleSave} disabled={isLoading} className={styles.saveButton}>
              {isLoading ? (
                <span className={styles.saveButtonContent}>
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button onClick={handleCancel} disabled={isLoading} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
