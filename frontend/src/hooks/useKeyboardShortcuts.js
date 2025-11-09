import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing keyboard shortcuts
 * Provides a centralized way to handle keyboard navigation and shortcuts
 * 
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled (default: true)
 * 
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+s': handleSave,
 *   'ctrl+z': handleUndo,
 *   'ctrl+y': handleRedo,
 *   'escape': handleClose,
 * });
 */
export default function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      // Build key combination string
      const keys = [];
      if (event.ctrlKey || event.metaKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      keys.push(event.key.toLowerCase());

      const combination = keys.join('+');

      // Check if this combination has a handler
      const handler = shortcuts[combination];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Hook for managing focus trap in modals
 * Keeps focus within a container element
 * 
 * @param {React.RefObject} containerRef - Reference to the container element
 * @param {boolean} isActive - Whether the focus trap is active
 */
export function useFocusTrap(containerRef, isActive = true) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when trap activates
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerRef, isActive]);
}

/**
 * Hook for managing focus restoration
 * Restores focus to the previously focused element when component unmounts
 * 
 * @param {boolean} shouldRestore - Whether to restore focus (default: true)
 */
export function useFocusRestore(shouldRestore = true) {
  useEffect(() => {
    if (!shouldRestore) return;

    const previouslyFocused = document.activeElement;

    return () => {
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [shouldRestore]);
}
