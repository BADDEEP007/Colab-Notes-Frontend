import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Tooltip.module.css';
import clsx from 'clsx';

/**
 * Tooltip Component
 *
 * A reusable tooltip component that shows on hover and long press.
 * Positions dynamically to avoid overflow and is accessible to screen readers.
 *
 * @component
 * @example
 * <Tooltip content="Save your work">
 *   <button>Save</button>
 * </Tooltip>
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  // Calculate optimal tooltip position to avoid overflow
  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Check if tooltip overflows viewport
    if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = 'top';
    } else if (position === 'left' && triggerRect.left - tooltipRect.width < 0) {
      newPosition = 'right';
    } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewportWidth) {
      newPosition = 'left';
    }

    setCalculatedPosition(newPosition);
  };

  // Show tooltip with delay
  const showTooltip = () => {
    if (disabled) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return timer;
  };

  // Hide tooltip
  const hideTooltip = () => {
    setIsVisible(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    const timer = showTooltip();
    setLongPressTimer(timer);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    hideTooltip();
  };

  // Handle touch start (long press)
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Longer delay for touch
    setLongPressTimer(timer);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    hideTooltip();
  };

  // Handle focus
  const handleFocus = () => {
    const timer = showTooltip();
    setLongPressTimer(timer);
  };

  // Handle blur
  const handleBlur = () => {
    hideTooltip();
  };

  // Calculate position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible]);

  // Clone children and add event handlers
  const childElement = React.Children.only(children);
  const enhancedChild = React.cloneElement(childElement, {
    ref: triggerRef,
    onMouseEnter: (e) => {
      handleMouseEnter();
      if (childElement.props.onMouseEnter) {
        childElement.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e) => {
      handleMouseLeave();
      if (childElement.props.onMouseLeave) {
        childElement.props.onMouseLeave(e);
      }
    },
    onTouchStart: (e) => {
      handleTouchStart();
      if (childElement.props.onTouchStart) {
        childElement.props.onTouchStart(e);
      }
    },
    onTouchEnd: (e) => {
      handleTouchEnd();
      if (childElement.props.onTouchEnd) {
        childElement.props.onTouchEnd(e);
      }
    },
    onFocus: (e) => {
      handleFocus();
      if (childElement.props.onFocus) {
        childElement.props.onFocus(e);
      }
    },
    onBlur: (e) => {
      handleBlur();
      if (childElement.props.onBlur) {
        childElement.props.onBlur(e);
      }
    },
    'aria-describedby': isVisible ? tooltipId.current : undefined,
  });

  return (
    <div className={clsx(styles.wrapper, className)}>
      {enhancedChild}
      <div
        ref={tooltipRef}
        id={tooltipId.current}
        role="tooltip"
        className={clsx(styles.tooltip, styles[calculatedPosition], isVisible && styles.visible)}
        aria-hidden={!isVisible}
      >
        {content}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  /** Element that triggers the tooltip */
  children: PropTypes.element.isRequired,
  /** Tooltip content */
  content: PropTypes.node.isRequired,
  /** Preferred position of tooltip */
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Delay before showing tooltip (ms) */
  delay: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Disable tooltip */
  disabled: PropTypes.bool,
};

export default Tooltip;
