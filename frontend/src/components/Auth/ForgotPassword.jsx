import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import AnimatedBackground from '../AnimatedBackground';
import GlassInput from '../GlassInput';
import GlassButton from '../GlassButton';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <AnimatedBackground variant="auth" />
        <main className={styles.mainContainer}>
          <div className={`glass-container ${styles.card}`}>
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <svg
                  className={styles.successIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className={styles.successTitle}>Check your email</h2>
              <p className={styles.successMessage}>
                We've sent a password reset link to{' '}
                <span className={styles.successEmail}>{email}</span>
              </p>
              <p className={styles.successHint}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <GlassButton
                variant="primary"
                onClick={() => navigate('/login')}
                className={styles.submitButton}
              >
                Back to login
              </GlassButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AnimatedBackground variant="auth" />
      <main className={styles.mainContainer}>
        <div className={`glass-container ${styles.card}`}>
          <button onClick={() => navigate('/login')} className={styles.backButton}>
            <svg
              className={styles.backIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to login
          </button>

          <div className={styles.header}>
            <h2 className={styles.title}>Forgot password?</h2>
            <p className={styles.subtitle}>No worries, we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <GlassInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
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
              error={error}
              disabled={isLoading}
            />

            <GlassButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </GlassButton>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
