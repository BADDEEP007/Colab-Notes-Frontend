/**
 * Browser Compatibility Utilities
 * Detects browser features and provides fallbacks for unsupported features
 */

/**
 * Check if backdrop-filter is supported
 * @returns {boolean} True if backdrop-filter is supported
 */
export const supportsBackdropFilter = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
};

/**
 * Check if CSS Grid is supported
 * @returns {boolean} True if CSS Grid is supported
 */
export const supportsCSSGrid = () => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('display', 'grid');
};

/**
 * Check if CSS custom properties (variables) are supported
 * @returns {boolean} True if CSS custom properties are supported
 */
export const supportsCSSVariables = () => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('--css', 'variables');
};

/**
 * Detect browser name and version
 * @returns {Object} Browser information
 */
export const detectBrowser = () => {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 'unknown';

  // Chrome
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Edge (Chromium)
  else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Firefox
  else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Safari
  else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) browserVersion = match[1];
  }

  return { name: browserName, version: browserVersion };
};

/**
 * Check if the browser meets minimum requirements
 * @returns {Object} Compatibility status
 */
export const checkBrowserCompatibility = () => {
  const browser = detectBrowser();
  const minVersions = {
    Chrome: 90,
    Firefox: 88,
    Safari: 14,
    Edge: 90,
  };

  const isSupported = browser.name in minVersions && 
    parseInt(browser.version) >= minVersions[browser.name];

  return {
    browser: browser.name,
    version: browser.version,
    isSupported,
    features: {
      backdropFilter: supportsBackdropFilter(),
      cssGrid: supportsCSSGrid(),
      cssVariables: supportsCSSVariables(),
    },
  };
};

/**
 * Apply fallback classes based on browser support
 */
export const applyBrowserFallbacks = () => {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  
  // Add browser-specific classes
  const browser = detectBrowser();
  html.classList.add(`browser-${browser.name.toLowerCase()}`);
  
  // Add feature support classes
  if (!supportsBackdropFilter()) {
    html.classList.add('no-backdrop-filter');
  }
  
  if (!supportsCSSGrid()) {
    html.classList.add('no-css-grid');
  }
  
  if (!supportsCSSVariables()) {
    html.classList.add('no-css-variables');
  }
};

/**
 * Log browser compatibility information to console
 */
export const logBrowserInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    const compat = checkBrowserCompatibility();
    console.group('🌐 Browser Compatibility');
    console.log('Browser:', compat.browser, compat.version);
    console.log('Supported:', compat.isSupported ? '✅' : '❌');
    console.log('Features:', compat.features);
    console.groupEnd();
  }
};

/**
 * Initialize browser compatibility checks
 * Call this on app initialization
 */
export const initBrowserCompatibility = () => {
  applyBrowserFallbacks();
  logBrowserInfo();
};

export default {
  supportsBackdropFilter,
  supportsCSSGrid,
  supportsCSSVariables,
  detectBrowser,
  checkBrowserCompatibility,
  applyBrowserFallbacks,
  logBrowserInfo,
  initBrowserCompatibility,
};
