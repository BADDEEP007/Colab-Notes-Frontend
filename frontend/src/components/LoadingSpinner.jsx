/**
 * LoadingSpinner component - Reusable loading indicator
 * Requirements: All requirements with async operations
 */
export default function LoadingSpinner({ size = 'medium', className = '', fullScreen = false }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-blue-600 border-t-transparent ${
        sizeClasses[size] || sizeClasses.medium
      } ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-gray-600">Loading...</p>
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4 min-w-[200px]">
        <LoadingSpinner size="large" />
        <p className="text-gray-700 font-medium">{message}</p>
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
      className={`relative inline-flex items-center justify-center gap-2 ${className} ${
        loading || disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="small" className="absolute left-4" />
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
}

/**
 * SkeletonLoader component - Skeleton loading placeholder
 */
export function SkeletonLoader({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-lg',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant] || variants.text} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
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
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
          <SkeletonLoader variant="title" />
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="text" className="w-2/3" />
          <div className="flex gap-2 pt-2">
            <SkeletonLoader variant="button" />
            <SkeletonLoader variant="button" />
          </div>
        </div>
      ))}
    </>
  );
}
