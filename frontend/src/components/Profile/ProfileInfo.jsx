import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import authApi from '../../api/authApi';
import { useToast } from '../ToastContainer';
import LoadingSpinner from '../LoadingSpinner';

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
      showToast(
        error.response?.data?.message || 'Failed to update profile',
        'error'
      );
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
      showToast(
        error.response?.data?.message || 'Failed to send verification email',
        'error'
      );
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Information
        </h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            aria-label="Edit profile"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Profile Picture
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Avatar based on your name
            </p>
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          ) : (
            <p className="text-gray-900 dark:text-white">
              {user?.name || 'Not set'}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <div className="flex items-center space-x-2">
            <p className="text-gray-900 dark:text-white flex-1">
              {user?.email || 'Not set'}
            </p>
            {user?.emailVerified ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <svg
                  className="w-3 h-3 mr-1"
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <svg
                  className="w-3 h-3 mr-1"
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
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingVerification ? (
                <span className="flex items-center">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Member Since
          </label>
          <p className="text-gray-900 dark:text-white">
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
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
