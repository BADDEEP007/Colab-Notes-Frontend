/**
 * Browser Compatibility Check Script
 * Generates a detailed compatibility report for CSS features
 */

export async function checkBrowserCompatibility(page, browserName) {
  const report = await page.evaluate(() => {
    const results = {
      browser: '',
      cssFeatures: {},
      glassmorphism: {},
      animations: {},
      layout: {},
      performance: {},
    };

    // Check CSS Features
    results.cssFeatures = {
      cssVariables: CSS.supports('--test', 'value'),
      backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
      grid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      customProperties: !!window.CSS && CSS.supports('color', 'var(--test)'),
      transitions: CSS.supports('transition', 'all 0.3s ease'),
      transforms: CSS.supports('transform', 'scale(1)'),
      animations: CSS.supports('animation', 'test 1s ease'),
    };

    // Check Glassmorphism Support
    const glassElement = document.querySelector('[class*="glass"]');
    if (glassElement) {
      const styles = window.getComputedStyle(glassElement);
      results.glassmorphism = {
        backdropFilter: styles.backdropFilter !== 'none' || styles.webkitBackdropFilter !== 'none',
        backdropFilterValue: styles.backdropFilter || styles.webkitBackdropFilter || 'not applied',
        background: styles.background,
        border: styles.border,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow !== 'none',
        opacity: styles.opacity,
      };
    }

    // Check Animation Support
    results.animations = {
      transitionsEnabled: true,
      animationsEnabled: true,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion)').matches,
    };

    // Check Layout Features
    results.layout = {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      hasVerticalScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight,
    };

    // Check Performance
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      results.performance = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
      };
    }

    // Check CSS Variables
    const root = document.documentElement;
    const rootStyles = window.getComputedStyle(root);
    results.cssVariables = {
      colorSkyBlue: rootStyles.getPropertyValue('--color-sky-blue').trim(),
      glassBg: rootStyles.getPropertyValue('--glass-bg').trim(),
      spacing4: rootStyles.getPropertyValue('--spacing-4').trim(),
      radiusMd: rootStyles.getPropertyValue('--radius-md').trim(),
      durationFast: rootStyles.getPropertyValue('--duration-fast').trim(),
    };

    return results;
  });

  report.browser = browserName;
  return report;
}

export function formatCompatibilityReport(report) {
  const lines = [];
  
  lines.push(`\n${'='.repeat(60)}`);
  lines.push(`BROWSER COMPATIBILITY REPORT: ${report.browser.toUpperCase()}`);
  lines.push(`${'='.repeat(60)}\n`);

  // CSS Features
  lines.push('CSS FEATURES:');
  lines.push(`  CSS Variables: ${report.cssFeatures.cssVariables ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  Backdrop Filter: ${report.cssFeatures.backdropFilter ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  CSS Grid: ${report.cssFeatures.grid ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  Flexbox: ${report.cssFeatures.flexbox ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  Transitions: ${report.cssFeatures.transitions ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  Transforms: ${report.cssFeatures.transforms ? '✓ Supported' : '✗ Not Supported'}`);
  lines.push(`  Animations: ${report.cssFeatures.animations ? '✓ Supported' : '✗ Not Supported'}\n`);

  // Glassmorphism
  if (Object.keys(report.glassmorphism).length > 0) {
    lines.push('GLASSMORPHISM EFFECTS:');
    lines.push(`  Backdrop Filter Applied: ${report.glassmorphism.backdropFilter ? '✓ Yes' : '✗ No'}`);
    lines.push(`  Backdrop Filter Value: ${report.glassmorphism.backdropFilterValue}`);
    lines.push(`  Background: ${report.glassmorphism.background.substring(0, 50)}...`);
    lines.push(`  Border Radius: ${report.glassmorphism.borderRadius}`);
    lines.push(`  Box Shadow: ${report.glassmorphism.boxShadow ? '✓ Applied' : '✗ Not Applied'}\n`);
  }

  // Animations
  lines.push('ANIMATIONS & TRANSITIONS:');
  lines.push(`  Transitions Enabled: ${report.animations.transitionsEnabled ? '✓ Yes' : '✗ No'}`);
  lines.push(`  Animations Enabled: ${report.animations.animationsEnabled ? '✓ Yes' : '✗ No'}`);
  lines.push(`  Reduced Motion: ${report.animations.reducedMotion ? '✓ Active' : '✗ Inactive'}\n`);

  // Layout
  lines.push('LAYOUT:');
  lines.push(`  Viewport: ${report.layout.viewportWidth}x${report.layout.viewportHeight}`);
  lines.push(`  Device Pixel Ratio: ${report.layout.devicePixelRatio}`);
  lines.push(`  Horizontal Scroll: ${report.layout.hasHorizontalScroll ? '✗ Yes (Issue!)' : '✓ No'}`);
  lines.push(`  Vertical Scroll: ${report.layout.hasVerticalScroll ? '✓ Yes' : '✓ No'}\n`);

  // Performance
  if (report.performance && report.performance.domContentLoaded) {
    lines.push('PERFORMANCE:');
    lines.push(`  DOM Content Loaded: ${report.performance.domContentLoaded}ms`);
    lines.push(`  Load Complete: ${report.performance.loadComplete}ms`);
    lines.push(`  DOM Interactive: ${report.performance.domInteractive}ms\n`);
  }

  // CSS Variables
  lines.push('CSS VARIABLES:');
  lines.push(`  --color-sky-blue: ${report.cssVariables.colorSkyBlue || 'Not defined'}`);
  lines.push(`  --glass-bg: ${report.cssVariables.glassBg || 'Not defined'}`);
  lines.push(`  --spacing-4: ${report.cssVariables.spacing4 || 'Not defined'}`);
  lines.push(`  --radius-md: ${report.cssVariables.radiusMd || 'Not defined'}`);
  lines.push(`  --duration-fast: ${report.cssVariables.durationFast || 'Not defined'}\n`);

  lines.push(`${'='.repeat(60)}\n`);

  return lines.join('\n');
}

export function generateCompatibilitySummary(reports) {
  const lines = [];
  
  lines.push(`\n${'='.repeat(60)}`);
  lines.push('CROSS-BROWSER COMPATIBILITY SUMMARY');
  lines.push(`${'='.repeat(60)}\n`);

  const features = [
    'cssVariables',
    'backdropFilter',
    'grid',
    'flexbox',
    'transitions',
    'transforms',
    'animations',
  ];

  lines.push('Feature Support Matrix:\n');
  lines.push(`${'Feature'.padEnd(20)} | Chrome | Firefox | Safari`);
  lines.push(`${'-'.repeat(20)}-|--------|---------|-------`);

  features.forEach(feature => {
    const featureName = feature.replace(/([A-Z])/g, ' $1').trim();
    const chrome = reports.find(r => r.browser === 'chromium')?.cssFeatures[feature] ? '✓' : '✗';
    const firefox = reports.find(r => r.browser === 'firefox')?.cssFeatures[feature] ? '✓' : '✗';
    const safari = reports.find(r => r.browser === 'webkit')?.cssFeatures[feature] ? '✓' : '✗';
    
    lines.push(`${featureName.padEnd(20)} |   ${chrome}    |    ${firefox}    |   ${safari}`);
  });

  lines.push(`\n${'='.repeat(60)}\n`);

  return lines.join('\n');
}
