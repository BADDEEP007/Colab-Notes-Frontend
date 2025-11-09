import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './AnimatedBackground.module.css';
import clsx from 'clsx';

/**
 * AnimatedBackground Component
 *
 * Renders floating orbs with radial gradients that animate smoothly in the background.
 * Supports different variants for different pages and respects user's motion preferences.
 *
 * @param {Object} props
 * @param {string} props.variant - Visual variant: 'auth', 'dashboard', or 'minimal'
 * @param {number} props.intensity - Animation intensity from 0 to 1 (default: 1)
 */
const AnimatedBackground = ({ variant = 'auth', intensity = 1 }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Generate orb configurations based on variant
  const orbs = useMemo(() => {
    const orbConfigs = {
      auth: [
        {
          id: 1,
          gradient:
            'radial-gradient(circle, rgba(179, 229, 252, 0.4) 0%, rgba(179, 229, 252, 0) 70%)',
          size: '600px',
          top: '10%',
          left: '10%',
          animationDelay: '0s',
          animationDuration: '20s',
        },
        {
          id: 2,
          gradient:
            'radial-gradient(circle, rgba(255, 224, 178, 0.4) 0%, rgba(255, 224, 178, 0) 70%)',
          size: '500px',
          top: '60%',
          left: '70%',
          animationDelay: '2s',
          animationDuration: '18s',
        },
        {
          id: 3,
          gradient:
            'radial-gradient(circle, rgba(255, 171, 145, 0.3) 0%, rgba(255, 171, 145, 0) 70%)',
          size: '450px',
          top: '30%',
          left: '80%',
          animationDelay: '4s',
          animationDuration: '22s',
        },
        {
          id: 4,
          gradient:
            'radial-gradient(circle, rgba(179, 229, 252, 0.35) 0%, rgba(179, 229, 252, 0) 70%)',
          size: '550px',
          top: '70%',
          left: '20%',
          animationDelay: '6s',
          animationDuration: '24s',
        },
        {
          id: 5,
          gradient:
            'radial-gradient(circle, rgba(255, 224, 178, 0.35) 0%, rgba(255, 224, 178, 0) 70%)',
          size: '480px',
          top: '40%',
          left: '50%',
          animationDelay: '8s',
          animationDuration: '20s',
        },
      ],
      dashboard: [
        {
          id: 1,
          gradient:
            'radial-gradient(circle, rgba(179, 229, 252, 0.3) 0%, rgba(179, 229, 252, 0) 70%)',
          size: '500px',
          top: '15%',
          left: '15%',
          animationDelay: '0s',
          animationDuration: '22s',
        },
        {
          id: 2,
          gradient:
            'radial-gradient(circle, rgba(255, 224, 178, 0.3) 0%, rgba(255, 224, 178, 0) 70%)',
          size: '450px',
          top: '65%',
          left: '75%',
          animationDelay: '3s',
          animationDuration: '20s',
        },
        {
          id: 3,
          gradient:
            'radial-gradient(circle, rgba(255, 171, 145, 0.25) 0%, rgba(255, 171, 145, 0) 70%)',
          size: '400px',
          top: '50%',
          left: '50%',
          animationDelay: '6s',
          animationDuration: '24s',
        },
      ],
      minimal: [
        {
          id: 1,
          gradient:
            'radial-gradient(circle, rgba(179, 229, 252, 0.2) 0%, rgba(179, 229, 252, 0) 70%)',
          size: '400px',
          top: '20%',
          left: '20%',
          animationDelay: '0s',
          animationDuration: '25s',
        },
        {
          id: 2,
          gradient:
            'radial-gradient(circle, rgba(255, 224, 178, 0.2) 0%, rgba(255, 224, 178, 0) 70%)',
          size: '350px',
          top: '70%',
          left: '70%',
          animationDelay: '4s',
          animationDuration: '23s',
        },
      ],
    };

    return orbConfigs[variant] || orbConfigs.auth;
  }, [variant]);

  return (
    <div
      className={clsx(styles.animatedBackground, prefersReducedMotion && styles.reducedMotion)}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={clsx(styles.orb, prefersReducedMotion && styles.static)}
          style={{
            background: orb.gradient,
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            animationDelay: prefersReducedMotion ? '0s' : orb.animationDelay,
            animationDuration: prefersReducedMotion ? '0s' : orb.animationDuration,
            opacity: intensity,
          }}
        />
      ))}
    </div>
  );
};

AnimatedBackground.propTypes = {
  variant: PropTypes.oneOf(['auth', 'dashboard', 'minimal']),
  intensity: PropTypes.number,
};

export default AnimatedBackground;
