import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './GlassInput.module.css';

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

  const inputClasses = [
    styles.input,
    icon && styles.inputWithIcon,
    error && styles.inputError,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [
    styles.label,
    icon && styles.labelWithIcon,
    shouldFloat && styles.labelFloating,
    error && styles.labelError,
  ]
    .filter(Boolean)
    .join(' ');

  const iconClasses = [styles.icon, error && styles.iconError].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {icon && <div className={iconClasses}>{icon}</div>}

        {label && (
          <label htmlFor={inputId} className={labelClasses}>
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
        <div id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.errorIcon}
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
