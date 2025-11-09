/**
 * Performance monitoring utilities for animations
 */

/**
 * Monitor frame rate during animations
 * @param {Function} callback - Callback with FPS data
 * @returns {Function} Stop monitoring function
 */
export const monitorFrameRate = (callback) => {
  let lastTime = performance.now();
  let frames = 0;
  let animationId;

  const measureFPS = (currentTime) => {
    frames++;
    const delta = currentTime - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frames * 1000) / delta);
      callback({ fps, frames, delta });
      frames = 0;
      lastTime = currentTime;
    }

    animationId = requestAnimationFrame(measureFPS);
  };

  animationId = requestAnimationFrame(measureFPS);

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};

/**
 * Measure animation performance
 * @param {string} animationName - Name of the animation
 * @param {Function} animationFn - Animation function to measure
 * @returns {Promise<Object>} Performance metrics
 */
export const measureAnimationPerformance = async (animationName, animationFn) => {
  const startTime = performance.now();
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

  let frameCount = 0;
  let minFPS = Infinity;
  let maxFPS = 0;
  let totalFPS = 0;

  const stopMonitoring = monitorFrameRate(({ fps }) => {
    frameCount++;
    minFPS = Math.min(minFPS, fps);
    maxFPS = Math.max(maxFPS, fps);
    totalFPS += fps;
  });

  try {
    await animationFn();
  } finally {
    stopMonitoring();
  }

  const endTime = performance.now();
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  const duration = endTime - startTime;
  const memoryUsed = endMemory - startMemory;
  const avgFPS = frameCount > 0 ? totalFPS / frameCount : 0;

  return {
    name: animationName,
    duration,
    memoryUsed,
    frameCount,
    avgFPS,
    minFPS: minFPS === Infinity ? 0 : minFPS,
    maxFPS,
  };
};

/**
 * Check if animations are performing well
 * @param {number} fps - Current FPS
 * @returns {Object} Performance status
 */
export const checkAnimationPerformance = (fps) => {
  if (fps >= 55) {
    return { status: 'excellent', message: 'Animations running smoothly' };
  } else if (fps >= 45) {
    return { status: 'good', message: 'Animations performing well' };
  } else if (fps >= 30) {
    return { status: 'fair', message: 'Animations may feel slightly sluggish' };
  } else {
    return { status: 'poor', message: 'Animations are janky, consider optimizations' };
  }
};

/**
 * Detect if device is low-end
 * @returns {boolean} True if device is low-end
 */
export const isLowEndDevice = () => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;

  // Check device memory (if available)
  const memory = navigator.deviceMemory || 4;

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Consider low-end if:
  // - Less than 4 cores
  // - Less than 4GB RAM
  // - Mobile device with less than 2 cores
  return cores < 4 || memory < 4 || (isMobile && cores < 2);
};

/**
 * Get recommended animation settings based on device
 * @returns {Object} Recommended settings
 */
export const getRecommendedAnimationSettings = () => {
  const lowEnd = isLowEndDevice();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      enableAnimations: false,
      duration: 0,
      complexity: 'none',
      reason: 'User prefers reduced motion',
    };
  }

  if (lowEnd) {
    return {
      enableAnimations: true,
      duration: 0.2,
      complexity: 'low',
      reason: 'Low-end device detected',
    };
  }

  return {
    enableAnimations: true,
    duration: 1,
    complexity: 'high',
    reason: 'High-performance device',
  };
};

/**
 * Log animation performance to console (development only)
 * @param {Object} metrics - Performance metrics
 */
export const logAnimationPerformance = (metrics) => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group(`🎬 Animation Performance: ${metrics.name}`);
  console.log(`Duration: ${metrics.duration.toFixed(2)}ms`);
  console.log(`Average FPS: ${metrics.avgFPS.toFixed(1)}`);
  console.log(`Min FPS: ${metrics.minFPS}`);
  console.log(`Max FPS: ${metrics.maxFPS}`);
  console.log(`Frame Count: ${metrics.frameCount}`);

  if (metrics.memoryUsed) {
    console.log(`Memory Used: ${(metrics.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
  }

  const status = checkAnimationPerformance(metrics.avgFPS);
  console.log(`Status: ${status.status} - ${status.message}`);
  console.groupEnd();
};

/**
 * Create a performance observer for long animation frames
 * @param {Function} callback - Callback when long frames detected
 * @returns {PerformanceObserver|null} Observer instance
 */
export const observeLongAnimationFrames = (callback) => {
  if (!window.PerformanceObserver) return null;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 16.67) {
          // Longer than 60fps frame
          callback({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
    return observer;
  } catch (error) {
    console.warn('Performance observer not supported:', error);
    return null;
  }
};

/**
 * Throttle animation updates for better performance
 * @param {Function} callback - Animation callback
 * @param {number} fps - Target FPS (default 60)
 * @returns {Function} Throttled callback
 */
export const throttleAnimation = (callback, fps = 60) => {
  const interval = 1000 / fps;
  let lastTime = 0;

  return (...args) => {
    const now = performance.now();

    if (now - lastTime >= interval) {
      lastTime = now;
      callback(...args);
    }
  };
};

export default {
  monitorFrameRate,
  measureAnimationPerformance,
  checkAnimationPerformance,
  isLowEndDevice,
  getRecommendedAnimationSettings,
  logAnimationPerformance,
  observeLongAnimationFrames,
  throttleAnimation,
};
