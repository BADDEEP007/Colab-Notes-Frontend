import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassButton Component
 * 
 * A reusable button component with glassmorphism styling and shimmer effect.
 * Supports multiple variants, loading state, and disabled state.
 * 
 * @component
 * @example
 * <GlassButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </GlassButton>
 * 
 * <GlassButton variant="secondary" loading>
 *   Loading...
 * </GlassButton>
 */
const GlassButton = ({ 
  children, 
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ariaPressed,
  ...props 
}) => {
  // Determine the variant class
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost'
  };

  const baseClass = variantClasses[variant] || variantClasses.primary;
  const isDisabled = disabled || loading;
  
  const combinedClasses = `${baseClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span 
            className="spin" 
            role="status"
            aria-label="Loading"
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%'
            }} 
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

GlassButton.propTypes = {
  /** Content to be rendered inside the button */
  children: PropTypes.node.isRequired,
  /** Button variant style */
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  /** Show loading spinner */
  loading: PropTypes.bool,
  /** Disable the button */
  disabled: PropTypes.bool,
  /** Click handler function */
  onClick: PropTypes.func,
  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  ariaLabel: PropTypes.string,
  /** Pressed state for toggle buttons */
  ariaPressed: PropTypes.bool,
};

export default GlassButton;
