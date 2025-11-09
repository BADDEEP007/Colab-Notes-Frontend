import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassCard Component
 * 
 * A reusable card component with glassmorphism styling.
 * Features backdrop-filter blur, semi-transparent background, and optional hover effects.
 * 
 * @component
 * @example
 * <GlassCard hover onClick={handleClick} className="custom-class">
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </GlassCard>
 */
const GlassCard = ({ 
  children, 
  hover = false, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'glass-container';
  const hoverClasses = hover ? 'hover-scale cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const combinedClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`.trim();

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

GlassCard.propTypes = {
  /** Content to be rendered inside the card */
  children: PropTypes.node.isRequired,
  /** Enable hover scale effect (1.03x) */
  hover: PropTypes.bool,
  /** Click handler function */
  onClick: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default GlassCard;
