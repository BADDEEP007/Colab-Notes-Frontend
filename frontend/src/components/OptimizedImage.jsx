import { useState, useEffect, useRef } from 'react';

/**
 * Optimized Image Component
 * Provides lazy loading, WebP support with fallback, and loading states
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS classes
 * @param {string} props.fallback - Fallback image if src fails to load
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onError - Callback when image fails to load
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  fallback = null,
  lazy = true,
  onLoad,
  onError,
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || !imgRef.current) {
      setImageSrc(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, lazy]);

  // Handle image load
  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  // Handle image error
  const handleError = (e) => {
    setIsLoading(false);
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  // Get WebP version of image if supported
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return null;
    
    // Check if browser supports WebP
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
    
    if (supportsWebP && originalSrc.match(/\.(jpg|jpeg|png)$/i)) {
      // Replace extension with .webp if available
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(imageSrc);
  const displaySrc = imageError && fallback ? fallback : optimizedSrc;

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {isLoading && imageSrc && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}
      {imageError && !fallback && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
