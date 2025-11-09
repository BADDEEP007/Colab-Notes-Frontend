import { useState } from 'react';
import authApi from '../../api/authApi';
import { useToast } from '../ToastContainer';
import LoadingSpinner from '../LoadingSpinner';
import styles from './ChangePassword.module.css';

/**
 * ChangePassword Component
 * Allows users to change their password
 * Requirements: 18.1, 18.2
 */
export default function ChangePassword() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('one number');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(formData.oldPassword, formData.newPassword);
      showToast('Password changed successfully', 'success');

      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';

      // Check if it's an incorrect old password error
      if (error.response?.status === 401 || errorMessage.toLowerCase().includes('incorrect')) {
        setErrors({ oldPassword: 'Current password is incorrect' });
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    } else if (strength <= 4) {
      return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    } else {
      return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Change Password</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Current Password */}
        <div className={styles.field}>
          <label htmlFor="oldPassword" className={styles.label}>
            Current Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.old ? 'text' : 'password'}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.oldPassword ? styles.inputError : ''}`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('old')}
              className={styles.toggleButton}
              aria-label={showPasswords.old ? 'Hide password' : 'Show password'}
            >
              {showPasswords.old ? (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.oldPassword && <p className={styles.errorMessage}>{errors.oldPassword}</p>}
        </div>

        {/* New Password */}
        <div className={styles.field}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className={styles.toggleButton}
              aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
            >
              {showPasswords.new ? (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className={styles.strengthContainer}>
              <div className={styles.strengthHeader}>
                <span className={styles.strengthLabel}>Password strength:</span>
                <span
                  className={`${styles.strengthValue} ${
                    passwordStrength.label === 'Weak'
                      ? styles.strengthWeak
                      : passwordStrength.label === 'Medium'
                        ? styles.strengthMedium
                        : styles.strengthStrong
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className={styles.strengthBar}>
                <div
                  className={`${styles.strengthProgress} ${
                    passwordStrength.label === 'Weak'
                      ? styles.progressWeak
                      : passwordStrength.label === 'Medium'
                        ? styles.progressMedium
                        : styles.progressStrong
                  }`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}

          {errors.newPassword && <p className={styles.errorMessage}>{errors.newPassword}</p>}

          <p className={styles.hint}>
            Password must be at least 8 characters and contain uppercase, lowercase, and numbers
          </p>
        </div>

        {/* Confirm New Password */}
        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm New Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className={styles.toggleButton}
              aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
            >
              {showPasswords.confirm ? (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.toggleIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className={styles.submitWrapper}>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? (
              <span className={styles.submitButtonContent}>
                <LoadingSpinner size="small" className="mr-2" />
                Changing Password...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
