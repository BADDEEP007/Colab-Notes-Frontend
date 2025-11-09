import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../AnimatedBackground';
import BrandingPanel from './BrandingPanel';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();

  const handleSwitchToSignup = () => {
    setMode('signup');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const isLogin = mode === 'login';

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* Main Container */}
      <main id="main-content" className={styles.mainContainer} role="main">
        <div className={styles.grid}>
          {/* Form Panel - ALWAYS ON LEFT with FADE ANIMATION */}
          <div className={styles.formPanel}>
            <div className={`glass-container ${styles.formCard}`}>
              <div key={mode} className={styles.formContent}>
                {isLogin ? (
                  <LoginForm
                    onSwitchToSignup={handleSwitchToSignup}
                    onForgotPassword={handleForgotPassword}
                  />
                ) : (
                  <SignupForm onSwitchToLogin={handleSwitchToLogin} />
                )}
              </div>
            </div>
          </div>

          {/* Branding Panel - ALWAYS ON RIGHT with FADE ANIMATION */}
          <div className={styles.brandingPanel}>
            <div key={`branding-${mode}`} className={styles.brandingContent}>
              <BrandingPanel isLogin={isLogin} />
            </div>
          </div>
        </div>

        {/* Mobile Branding - Compact version */}
        <div className={`glass-container ${styles.mobileBranding}`}>
          <div className={styles.mobileBrandingHeader}>
            <div className={styles.mobileBrandingIcon}>
              <svg
                className={styles.mobileBrandingIconSvg}
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
                <circle cx="17" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className={styles.mobileBrandingTitle}>Collab Notes</h1>
          </div>
          <p className={styles.mobileBrandingSubtitle}>Collaborate in real-time with your team</p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
