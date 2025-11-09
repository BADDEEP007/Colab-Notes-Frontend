/**
 * Lazy Loading Utilities
 * Provides utilities for lazy loading heavy components and optimizing bundle size
 */

import { lazy } from 'react';

/**
 * Lazy load a component with retry logic
 * @param {Function} importFn - Dynamic import function
 * @param {number} retries - Number of retries (default 3)
 * @returns {React.LazyExoticComponent} Lazy component
 */
export const lazyWithRetry = (importFn, retries = 3) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (retriesLeft) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, retries - retriesLeft) * 1000;
            setTimeout(() => {
              console.log(`Retrying import... (${retriesLeft} attempts left)`);
              attemptImport(retriesLeft - 1);
            }, delay);
          });
      };
      
      attemptImport(retries);
    });
  });
};

/**
 * Preload a lazy component
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise} Import promise
 */
export const preloadComponent = (importFn) => {
  return importFn();
};

/**
 * Create an intersection observer for lazy loading
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, defaultOptions);
};

/**
 * Lazy load images with intersection observer
 * @param {HTMLElement} element - Image element
 * @param {string} src - Image source
 */
export const lazyLoadImage = (element, src) => {
  const observer = createLazyLoadObserver((target) => {
    target.src = src;
    target.classList.add('loaded');
    observer.unobserve(target);
  });

  observer.observe(element);
};

/**
 * Check if component should be lazy loaded based on device
 * @param {string} componentName - Component name
 * @returns {boolean} True if should lazy load
 */
export const shouldLazyLoad = (componentName) => {
  // Always lazy load on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobile) return true;

  // Lazy load heavy components
  const heavyComponents = [
    'Whiteboard',
    'NoteEditor',
    'AIToolbar',
    'ContainerPage',
  ];

  return heavyComponents.includes(componentName);
};

/**
 * Prefetch components that are likely to be needed
 * @param {Array<Function>} importFns - Array of import functions
 */
export const prefetchComponents = (importFns) => {
  // Only prefetch on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFns.forEach((importFn) => {
        preloadComponent(importFn);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      importFns.forEach((importFn) => {
        preloadComponent(importFn);
      });
    }, 1000);
  }
};

/**
 * Create a lazy loading wrapper with loading state
 * @param {Function} importFn - Dynamic import function
 * @param {React.Component} LoadingComponent - Loading component
 * @returns {React.LazyExoticComponent} Lazy component
 */
export const lazyWithLoading = (importFn, LoadingComponent) => {
  const LazyComponent = lazy(importFn);
  
  return (props) => (
    <React.Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

/**
 * Measure component load time
 * @param {string} componentName - Component name
 * @param {Function} importFn - Import function
 * @returns {Promise} Import promise with timing
 */
export const measureComponentLoadTime = async (componentName, importFn) => {
  const startTime = performance.now();
  
  try {
    const component = await importFn();
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    return component;
  } catch (error) {
    console.error(`Failed to load ${componentName}:`, error);
    throw error;
  }
};

/**
 * Optimize re-renders by memoizing heavy components
 * @param {React.Component} Component - Component to memoize
 * @param {Function} arePropsEqual - Custom comparison function
 * @returns {React.MemoExoticComponent} Memoized component
 */
export const optimizeComponent = (Component, arePropsEqual) => {
  return React.memo(Component, arePropsEqual);
};

export default {
  lazyWithRetry,
  preloadComponent,
  createLazyLoadObserver,
  lazyLoadImage,
  shouldLazyLoad,
  prefetchComponents,
  lazyWithLoading,
  measureComponentLoadTime,
  optimizeComponent,
};
