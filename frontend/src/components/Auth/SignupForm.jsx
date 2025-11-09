import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import GlassInput from '../GlassInput';
import GlassButton from '../GlassButton';
import styles from './SignupForm.module.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  const { register, loginWithOAuth, isLoading, error: authError } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '', submit: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register(formData.email, formData.password, formData.name);

    if (!result.success) {
      setErrors({ submit: result.error });
    }
  };

  const handleOAuthRegister = (provider) => {
    loginWithOAuth(provider);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Get started with Collab Notes</p>
      </div>

      {/* Error Message */}
      {(authError || errors.submit) && (
        <div className={styles.errorMessage}>
          <div className={styles.errorContent}>
            <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className={styles.errorText}>{authError || errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Field */}
        <div className={styles.fieldGroup}>
          <GlassInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            error={errors.name}
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div className={styles.fieldGroup}>
          <GlassInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
            error={errors.email}
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className={styles.fieldGroup}>
          <GlassInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            error={errors.password}
            disabled={isLoading}
          />
          {!errors.password && (
            <p className={styles.passwordHint}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className={styles.fieldGroup}>
          <GlassInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            error={errors.confirmPassword}
            disabled={isLoading}
          />
        </div>

        {/* Terms Acceptance */}
        <div className={styles.termsWrapper}>
          <label className={styles.termsLabel}>
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              className={styles.termsCheckbox}
              disabled={isLoading}
            />
            <span className={styles.termsText}>
              I agree to the{' '}
              <a href="/terms" className={styles.termsLink}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className={styles.termsError}>
              <svg className={styles.termsErrorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className={styles.submitButtonWrapper}>
          <GlassButton
            type="submit"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </GlassButton>
        </div>
      </form>

      {/* Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine}>
          <div className={styles.dividerBorder}></div>
        </div>
        <div className={styles.dividerText}>
          <span className={styles.dividerLabel}>Or continue with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className={styles.oauthButtons}>
        <button
          type="button"
          onClick={() => handleOAuthRegister('google')}
          disabled={isLoading}
          className={styles.oauthButton}
        >
          <svg className={styles.oauthIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className={styles.oauthLabel}>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthRegister('microsoft')}
          disabled={isLoading}
          className={styles.oauthButton}
        >
          <svg className={styles.oauthIcon} viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          <span className={styles.oauthLabel}>Microsoft</span>
        </button>
      </div>

      {/* Switch to Login */}
      <div className={styles.loginPrompt}>
        <p className={styles.loginText}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.loginLink}
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
