import React, { useState } from 'react';
import AnimatedBackground from './AnimatedBackground';
import '../styles/glassmorphism.css';

/**
 * Demo page for AnimatedBackground component
 * Shows all three variants and allows testing of intensity control
 */
const AnimatedBackgroundDemo = () => {
  const [variant, setVariant] = useState('auth');
  const [intensity, setIntensity] = useState(1);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatedBackground variant={variant} intensity={intensity} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div className="glass-container" style={{ padding: '2rem', marginTop: '2rem' }}>
          <h1 style={{ marginBottom: '1rem', color: 'var(--color-muted-navy)' }}>
            AnimatedBackground Component Demo
          </h1>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-muted-navy)' }}>Variant</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={variant === 'auth' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setVariant('auth')}
              >
                Auth
              </button>
              <button
                className={variant === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setVariant('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={variant === 'minimal' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setVariant('minimal')}
              >
                Minimal
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-muted-navy)' }}>
              Intensity: {intensity.toFixed(2)}
            </h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'rgba(179, 229, 252, 0.1)',
              borderRadius: '0.5rem',
              marginTop: '1.5rem',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-muted-navy)' }}>Features:</h3>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '1.5rem',
                color: 'var(--color-muted-navy)',
              }}
            >
              <li>3-5 floating orbs with radial gradients</li>
              <li>Smooth looping animations with staggered delays</li>
              <li>Respects prefers-reduced-motion preference</li>
              <li>Three variants: auth, dashboard, minimal</li>
              <li>Adjustable intensity (0-1)</li>
              <li>Positioned behind content with proper z-index</li>
            </ul>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 224, 178, 0.1)',
              borderRadius: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-muted-navy)' }}>
              Accessibility:
            </h3>
            <p style={{ color: 'var(--color-muted-navy)', marginBottom: '0.5rem' }}>
              To test reduced motion support, enable it in your system settings:
            </p>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '1.5rem',
                color: 'var(--color-muted-navy)',
                fontSize: '0.9rem',
              }}
            >
              <li>
                <strong>macOS:</strong> System Preferences → Accessibility → Display → Reduce motion
              </li>
              <li>
                <strong>Windows:</strong> Settings → Ease of Access → Display → Show animations
              </li>
              <li>
                <strong>Linux:</strong> Varies by desktop environment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackgroundDemo;
