import React from 'react';
import styles from './BrandingPanel.module.css';

/**
 * BrandingPanel Component
 *
 * Displays branding, features, and testimonials for the authentication pages.
 * Content changes based on whether user is on login or signup mode.
 *
 * @param {Object} props
 * @param {boolean} props.isLogin - Whether the current mode is login (vs signup)
 */
const BrandingPanel = ({ isLogin }) => {
  return (
    <div className={`glass-container ${styles.container}`}>
      {/* Logo & Title */}
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg
              className={styles.logoSvg}
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
              <circle cx="17" cy="7" r="2" fill="currentColor" />
            </svg>
          </div>
          <h1 className={styles.logoTitle}>Collab Notes</h1>
        </div>
        <h2 className={styles.mainTitle}>
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </h2>
        <p className={styles.subtitle}>
          {isLogin ? 'Continue your collaborative journey' : 'Start collaborating with your team'}
        </p>
      </div>

      {/* Features */}
      <div className={styles.features}>
        {isLogin ? (
          <>
            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`}>
                <svg
                  className={styles.featureIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Pick Up Where You Left Off</h3>
                <p className={styles.featureDescription}>
                  Your notes are synced and ready to go
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconSecondary}`}>
                <svg
                  className={styles.featureIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Stay Productive</h3>
                <p className={styles.featureDescription}>
                  Access your workspace from anywhere anytime
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconTertiary}`}>
                <svg
                  className={styles.featureIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Team Collaboration</h3>
                <p className={styles.featureDescription}>
                  Reconnect with your team and keep collaborating
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`}>
                <svg
                  className={styles.featureIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Real-time Collaboration</h3>
                <p className={styles.featureDescription}>
                  Work together seamlessly with instant synchronization
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconSecondary}`}>
                <svg
                  className={styles.featureIconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>AI-Powered Assistance</h3>
                <p className={styles.featureDescription}>
                  Smart summaries and suggestions boost your productivity
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.featureIconTertiary}`}>
                <svg
                  className={styles.featureIconSvg}
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
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Secure & Private</h3>
                <p className={styles.featureDescription}>
                  Enterprise-grade security keeps your data safe
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Testimonial Section */}
      <div className={styles.testimonial}>
        <p className={styles.testimonialQuote}>
          {isLogin
            ? '"Logging back in feels like coming home to my team."'
            : '"The best collaboration tool we\'ve ever used. Simple, powerful, beautiful."'}
        </p>
        <p className={styles.testimonialAuthor}>
          {isLogin ? '— Codester' : '— Baddeep'}
        </p>
      </div>
    </div>
  );
};

export default BrandingPanel;
