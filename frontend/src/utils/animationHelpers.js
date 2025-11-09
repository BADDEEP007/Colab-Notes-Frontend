/**
 * Animation helper utilities for stagger effects and delay calculations
 */

/**
 * Calculate stagger delay for animation sequences
 * @param {number} index - Index of the element in the sequence
 * @param {number} baseDelay - Base delay in ms
 * @param {number} staggerDelay - Delay between each element in ms
 * @returns {number} Total delay in ms
 */
export const calculateStaggerDelay = (index, baseDelay = 0, staggerDelay = 100) => {
  return baseDelay + index * staggerDelay;
};

/**
 * Generate stagger animation delays for a list of elements
 * @param {number} count - Number of elements
 * @param {Object} options - Stagger options
 * @returns {Array<number>} Array of delays in ms
 */
export const generateStaggerDelays = (count, options = {}) => {
  const {
    baseDelay = 0,
    staggerDelay = 100,
    reverse = false,
    from = 'start', // 'start' | 'end' | 'center'
  } = options;

  const delays = [];

  for (let i = 0; i < count; i++) {
    let index = i;

    if (from === 'center') {
      const center = Math.floor(count / 2);
      index = Math.abs(i - center);
    } else if (from === 'end') {
      index = count - 1 - i;
    }

    if (reverse) {
      index = count - 1 - index;
    }

    delays.push(baseDelay + index * staggerDelay);
  }

  return delays;
};

/**
 * Apply stagger animation to a list of elements
 * @param {Array<HTMLElement>} elements - DOM elements to animate
 * @param {Array} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 */
export const applyStaggerAnimation = (elements, keyframes, options = {}) => {
  const {
    duration = 300,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay = 100,
    baseDelay = 0,
    fill = 'forwards',
  } = options;

  elements.forEach((element, index) => {
    if (!element) return;

    const delay = calculateStaggerDelay(index, baseDelay, staggerDelay);

    element.animate(keyframes, {
      duration,
      easing,
      delay,
      fill,
    });
  });
};

/**
 * Create a stagger animation observer for elements entering viewport
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createStaggerObserver = (options = {}) => {
  const {
    keyframes = [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration = 600,
    staggerDelay = 100,
    threshold = 0.1,
    rootMargin = '0px',
  } = options;

  let observedCount = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = calculateStaggerDelay(observedCount, 0, staggerDelay);

          element.animate(keyframes, {
            duration,
            delay,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards',
          });

          observedCount++;
          observer.unobserve(element);
        }
      });
    },
    { threshold, rootMargin }
  );

  return observer;
};

/**
 * Animation delay calculator with easing functions
 * @param {number} progress - Progress value (0-1)
 * @param {string} easing - Easing function name
 * @returns {number} Eased value (0-1)
 */
export const calculateAnimationDelay = (progress, easing = 'linear') => {
  const easingFunctions = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  };

  const easingFn = easingFunctions[easing] || easingFunctions.linear;
  return easingFn(Math.max(0, Math.min(1, progress)));
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preferences
 * @param {number} duration - Default duration in ms
 * @returns {number} Adjusted duration in ms
 */
export const getAnimationDuration = (duration) => {
  return prefersReducedMotion() ? 0 : duration;
};

/**
 * Create a reusable animation sequence
 * @param {Array} steps - Array of animation steps
 * @returns {Function} Function to execute the sequence
 */
export const createAnimationSequence = (steps) => {
  return async (element) => {
    if (!element) return;

    for (const step of steps) {
      const { keyframes, duration, delay = 0, easing = 'ease' } = step;

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const animation = element.animate(keyframes, {
        duration: getAnimationDuration(duration),
        easing,
        fill: 'forwards',
      });

      await animation.finished;
    }
  };
};

export default {
  calculateStaggerDelay,
  generateStaggerDelays,
  applyStaggerAnimation,
  createStaggerObserver,
  calculateAnimationDelay,
  prefersReducedMotion,
  getAnimationDuration,
  createAnimationSequence,
};
