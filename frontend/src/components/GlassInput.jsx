import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * GlassInput Component
 * 
 * A reusable input component with glassmorphism styling and floating label animation.
 * Supports icons, error messages, and disabled state.
 * 
 * @component
 * @example
 * <GlassInput
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   icon={<EmailIcon />}
 *   error="Invalid email address"
 * />
 */
const GlassInput = ({ 
  label,
  type = 'text',
  value,
  onChange,
  icon,
  error,
  disabled = false,
  placeholder,
  className = '',
  id,
  name,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine if label should float
  const shouldFloat = isFocused || value;
  
  // Generate unique ID if not provided
  const inputId = id || `glass-input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = `glass-input ${error ? 'error' : ''} ${icon ? 'pl-12' : ''} ${className}`.trim();
  
  const containerStyle = {
    position: 'relative',
    width: '100%'
  };
  
  const labelStyle = {
    position: 'absolute',
    left: icon ? '3rem' : '1rem',
    top: shouldFloat ? '-0.5rem' : '50%',
    transform: shouldFloat ? 'translateY(0) scale(0.85)' : 'translateY(-50%)',
    transformOrigin: 'left',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: error ? 'var(--color-light-coral)' : 'var(--color-muted-navy)',
    backgroundColor: shouldFloat ? 'var(--color-off-white)' : 'transparent',
    padding: shouldFloat ? '0 0.25rem' : '0',
    fontSize: shouldFloat ? 'var(--font-size-sm)' : 'var(--font-size-base)',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: shouldFloat ? 1 : 0.6
  };
  
  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: error ? 'var(--color-light-coral)' : 'var(--color-muted-navy)',
    opacity: 0.7,
    pointerEvents: 'none',
    zIndex: 1
  };
  
  const errorStyle = {
    marginTop: '0.5rem',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-light-coral)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={containerStyle}>
        {icon && (
          <div style={iconStyle}>
            {icon}
          </div>
        )}
        
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-required={required}
          required={required}
          {...props}
        />
      </div>
      
      {error && (
        <div id={`${inputId}-error`} style={errorStyle} role="alert">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

GlassInput.propTypes = {
  /** Input label text */
  label: PropTypes.string,
  /** Input type */
  type: PropTypes.string,
  /** Input value */
  value: PropTypes.string,
  /** Change handler function */
  onChange: PropTypes.func,
  /** Icon element to display on the left */
  icon: PropTypes.node,
  /** Error message to display below input */
  error: PropTypes.string,
  /** Disable the input */
  disabled: PropTypes.bool,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Input ID */
  id: PropTypes.string,
  /** Input name */
  name: PropTypes.string,
  /** Whether the field is required */
  required: PropTypes.bool,
};

export default GlassInput;
