import styles from './LoadingSpinner.module.css';
import clsx from 'clsx';

/**
 * LoadingSpinner component - Reusable loading indicator
 * Requirements: All requirements with async operations
 */
export default function LoadingSpinner({ size = 'medium', className = '', fullScreen = false }) {
  const spinner = (
    <div
      className={clsx(styles.spinner, styles[size], className)}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.fullScreenContent}>
          {spinner}
          <p className={styles.fullScreenText}>Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}

/**
 * LoadingOverlay component - Full-screen loading overlay
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <LoadingSpinner size="large" />
        <p className={styles.overlayText}>{message}</p>
      </div>
    </div>
  );
}

/**
 * LoadingButton component - Button with loading state
 */
export function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(styles.loadingButton, (loading || disabled) && styles.disabled, className)}
      {...props}
    >
      {loading && <LoadingSpinner size="small" className={styles.buttonSpinner} />}
      <span className={clsx(styles.buttonContent, loading && styles.loading)}>{children}</span>
    </button>
  );
}

/**
 * SkeletonLoader component - Skeleton loading placeholder
 */
export function SkeletonLoader({ className = '', variant = 'text' }) {
  return (
    <div
      className={clsx(
        styles.skeleton,
        styles[`skeleton${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        className
      )}
      role="status"
      aria-label="Loading content"
    >
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
}

/**
 * CardSkeleton component - Skeleton for card layouts
 */
export function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.cardSkeleton}>
          <SkeletonLoader variant="title" />
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="text" className={styles.cardSkeletonTextShort} />
          <div className={styles.cardSkeletonButtons}>
            <SkeletonLoader variant="button" />
            <SkeletonLoader variant="button" />
          </div>
        </div>
      ))}
    </>
  );
}
