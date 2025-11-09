import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import GlassInput from '../GlassInput';
import GlassButton from '../GlassButton';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loginWithOAuth, isLoading, error: authError } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setErrors({ submit: result.error });
    }
  };

  const handleOAuthLogin = (provider) => {
    loginWithOAuth(provider);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue your journey</p>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Field */}
        <div className={styles.fieldGroup}>
          <GlassInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          <div className={styles.passwordField}>
            <GlassInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              className="pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              style={{ marginTop: errors.password ? '-12px' : '0' }}
            >
              {showPassword ? (
                <svg
                  className={styles.passwordToggleIcon}
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
                  className={styles.passwordToggleIcon}
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
        </div>

        {/* Forgot Password */}
        <div className={styles.forgotPassword}>
          <button type="button" onClick={onForgotPassword} className={styles.forgotPasswordLink}>
            Forgot password?
          </button>
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
            {isLoading ? 'Signing in...' : 'Sign In'}
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
          onClick={() => handleOAuthLogin('google')}
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
          onClick={() => handleOAuthLogin('microsoft')}
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

      {/* Sign Up Link */}
      <div className={styles.signupPrompt}>
        <p className={styles.signupText}>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className={styles.signupLink}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
