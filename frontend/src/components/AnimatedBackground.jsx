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

  // Generate orb configurations based on variant with color cycling
  const orbs = useMemo(() => {
    const orbConfigs = {
      auth: [
        {
          id: 1,
          size: '600px',
          top: '10%',
          left: '10%',
          animationDelay: '0s',
          animationDuration: '20s',
          colorIndex: 0,
        },
        {
          id: 2,
          size: '500px',
          top: '60%',
          left: '70%',
          animationDelay: '4s',
          animationDuration: '18s',
          colorIndex: 1,
        },
        {
          id: 3,
          size: '450px',
          top: '30%',
          left: '80%',
          animationDelay: '8s',
          animationDuration: '22s',
          colorIndex: 2,
        },
        {
          id: 4,
          size: '550px',
          top: '70%',
          left: '20%',
          animationDelay: '12s',
          animationDuration: '24s',
          colorIndex: 3,
        },
        {
          id: 5,
          size: '480px',
          top: '40%',
          left: '50%',
          animationDelay: '16s',
          animationDuration: '20s',
          colorIndex: 4,
        },
      ],
      dashboard: [
        {
          id: 1,
          size: '500px',
          top: '15%',
          left: '15%',
          animationDelay: '0s',
          animationDuration: '22s',
          colorIndex: 0,
        },
        {
          id: 2,
          size: '450px',
          top: '65%',
          left: '75%',
          animationDelay: '7s',
          animationDuration: '20s',
          colorIndex: 2,
        },
        {
          id: 3,
          size: '400px',
          top: '50%',
          left: '50%',
          animationDelay: '14s',
          animationDuration: '24s',
          colorIndex: 4,
        },
      ],
      minimal: [
        {
          id: 1,
          size: '400px',
          top: '20%',
          left: '20%',
          animationDelay: '0s',
          animationDuration: '25s',
          colorIndex: 0,
        },
        {
          id: 2,
          size: '350px',
          top: '70%',
          left: '70%',
          animationDelay: '10s',
          animationDuration: '23s',
          colorIndex: 3,
        },
      ],
    };

    return orbConfigs[variant] || orbConfigs.auth;
  }, [variant]);

  // Generate floating shapes with colors and directions
  const shapes = useMemo(() => {
    const directions = [0, 45, 90, 135, 180, 225, 270, 315]; // 8 directions
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 1.5,
      duration: 18 + (i % 8) * 2,
      size: 40 + (i % 8) * 10,
      left: (i * 10 + 5) % 95,
      top: (i * 12 + 8) % 90,
      colorIndex: i % 6,
      direction: directions[i % 8],
    }));
  }, []);

  // Generate particles with colors and directions
  const particles = useMemo(() => {
    const directions = ['up', 'upRight', 'upLeft', 'diagonal', 'wave'];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      duration: 10 + (i % 6) * 2,
      size: 3 + (i % 6),
      left: (i * 2.8) % 100,
      top: (i * 5.5) % 100,
      colorIndex: i % 6,
      direction: directions[i % 5],
    }));
  }, []);



  // Generate dynamic lines with multiple directions and colors
  const dynamicLines = useMemo(() => {
    const directions = [
      { startX: 0, startY: 15, angle: 20 },
      { startX: 100, startY: 25, angle: 160 },
      { startX: 15, startY: 0, angle: 70 },
      { startX: 85, startY: 0, angle: 110 },
      { startX: 0, startY: 50, angle: 0 },
      { startX: 100, startY: 55, angle: 180 },
      { startX: 0, startY: 75, angle: 35 },
      { startX: 100, startY: 80, angle: 145 },
      { startX: 25, startY: 100, angle: -65 },
      { startX: 75, startY: 100, angle: -115 },
      { startX: 50, startY: 0, angle: 90 },
      { startX: 50, startY: 100, angle: -90 },
      { startX: 0, startY: 35, angle: 15 },
      { startX: 100, startY: 45, angle: 165 },
      { startX: 10, startY: 50, angle: 45 },
      { startX: 90, startY: 60, angle: 135 },
    ];

    return directions.map((dir, i) => ({
      id: i,
      startX: dir.startX,
      startY: dir.startY,
      angle: dir.angle,
      length: 350 + (i % 5) * 100,
      delay: i * 1.5,
      duration: 8 + (i % 4) * 2,
      colorIndex: i % 6,
    }));
  }, []);

  // Generate flowing waves with different angles
  const flowWaves = useMemo(() => {
    const angles = [0, 15, -10, 25, -20];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 15 + i * 20,
      delay: i * 3,
      duration: 12 + i * 1.5,
      angle: angles[i],
      direction: i % 2 === 0 ? 'left' : 'right',
    }));
  }, []);



  return (
    <div
      className={clsx(styles.animatedBackground, prefersReducedMotion && styles.reducedMotion)}
      aria-hidden="true"
    >
      {/* Gradient Orbs with color cycling */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={clsx(styles.orb, prefersReducedMotion && styles.static)}
          data-color-index={orb.colorIndex}
          style={{
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

      {/* Floating Shapes with directional movement */}
      {!prefersReducedMotion &&
        shapes.map((shape) => (
          <div
            key={`shape-${shape.id}`}
            className={styles.shape}
            data-color-index={shape.colorIndex}
            data-direction={shape.direction}
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
            }}
          />
        ))}

      {/* Particles with directional movement */}
      {!prefersReducedMotion &&
        particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className={styles.particle}
            data-color-index={particle.colorIndex}
            data-direction={particle.direction}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}



      {/* Dynamic Lines with color cycling */}
      {!prefersReducedMotion &&
        dynamicLines.map((line) => (
          <div
            key={`line-${line.id}`}
            className={styles.dynamicLine}
            data-color-index={line.colorIndex}
            style={{
              left: `${line.startX}%`,
              top: `${line.startY}%`,
              width: `${line.length}px`,
              transform: `rotate(${line.angle}deg)`,
              animationDelay: `${line.delay}s`,
              animationDuration: `${line.duration}s`,
            }}
          />
        ))}



      {/* Flowing Waves with different angles */}
      {!prefersReducedMotion &&
        flowWaves.map((wave) => (
          <div
            key={`wave-${wave.id}`}
            className={styles.flowWave}
            data-direction={wave.direction}
            style={{
              top: `${wave.top}%`,
              animationDelay: `${wave.delay}s`,
              animationDuration: `${wave.duration}s`,
              transform: `rotate(${wave.angle}deg)`,
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
