import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook for programmatic animations using Web Animations API
 * @param {Object} options - Animation options
 * @returns {Object} Animation controls
 */
export const useAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  const animate = useCallback(
    (keyframes, animationOptions = {}) => {
      if (!elementRef.current) return null;

      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      // Merge with default options
      const finalOptions = {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
        ...options,
        ...animationOptions,
      };

      // Create and play animation
      animationRef.current = elementRef.current.animate(keyframes, finalOptions);

      return animationRef.current;
    },
    [options]
  );

  const cancel = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
    }
  }, []);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  const play = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  return {
    ref: elementRef,
    animate,
    cancel,
    pause,
    play,
    reverse,
    animation: animationRef.current,
  };
};

/**
 * Hook for fade-in animation on mount
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Animation delay in ms
 */
export const useFadeIn = (duration = 600, delay = 0) => {
  const { ref, animate } = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      animate([{ opacity: 0 }, { opacity: 1 }], { duration, delay: 0 });
    }, delay);

    return () => clearTimeout(timer);
  }, [animate, duration, delay]);

  return ref;
};

/**
 * Hook for slide-in animation on mount
 * @param {string} direction - Direction: 'left', 'right', 'top', 'bottom'
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Animation delay in ms
 */
export const useSlideIn = (direction = 'left', duration = 500, delay = 0) => {
  const { ref, animate } = useAnimation();

  useEffect(() => {
    const transforms = {
      left: ['translateX(-100%)', 'translateX(0)'],
      right: ['translateX(100%)', 'translateX(0)'],
      top: ['translateY(-100%)', 'translateY(0)'],
      bottom: ['translateY(100%)', 'translateY(0)'],
    };

    const timer = setTimeout(() => {
      animate(
        [
          { transform: transforms[direction][0], opacity: 0 },
          { transform: transforms[direction][1], opacity: 1 },
        ],
        { duration, delay: 0 }
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [animate, direction, duration, delay]);

  return ref;
};

/**
 * Hook for scale-in animation on mount
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Animation delay in ms
 */
export const useScaleIn = (duration = 300, delay = 0) => {
  const { ref, animate } = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(
        [
          { transform: 'scale(0.95)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration, delay: 0 }
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [animate, duration, delay]);

  return ref;
};

export default useAnimation;
