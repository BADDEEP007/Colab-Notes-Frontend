import { useState, useEffect, useRef, Children, cloneElement } from 'react';

/**
 * AnimatePresence - Wrapper component for mount/unmount animations
 * Allows children to animate out before being removed from the DOM
 */
const AnimatePresence = ({ 
  children, 
  exitDuration = 300,
  mode = 'wait' // 'wait' | 'sync'
}) => {
  const [visibleChildren, setVisibleChildren] = useState(children);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If children changed and we have visible children
    if (children !== visibleChildren) {
      if (!children && visibleChildren) {
        // Children removed - trigger exit animation
        setIsExiting(true);
        
        timeoutRef.current = setTimeout(() => {
          setVisibleChildren(null);
          setIsExiting(false);
        }, exitDuration);
      } else {
        // Children added or changed
        if (mode === 'wait' && visibleChildren) {
          // Wait for exit before showing new children
          setIsExiting(true);
          
          timeoutRef.current = setTimeout(() => {
            setVisibleChildren(children);
            setIsExiting(false);
          }, exitDuration);
        } else {
          // Show new children immediately
          setVisibleChildren(children);
          setIsExiting(false);
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, visibleChildren, exitDuration, mode]);

  if (!visibleChildren) return null;

  // Add exit class to children if exiting
  if (isExiting && visibleChildren) {
    return Children.map(visibleChildren, child => {
      if (!child) return null;
      return cloneElement(child, {
        className: `${child.props.className || ''} animate-exit`,
        'data-exiting': 'true'
      });
    });
  }

  return visibleChildren;
};

export default AnimatePresence;
