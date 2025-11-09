import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect swipe gestures
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {number} options.minSwipeDistance - Minimum distance for swipe (default: 50px)
 * @returns {Object} Ref to attach to element
 */
const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
} = {}) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > minSwipeDistance) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY > minSwipeDistance) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      // Reset values
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance]);

  return elementRef;
};

export default useSwipeGesture;
