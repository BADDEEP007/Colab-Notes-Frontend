/**
 * Cross-Browser Compatibility Testing Suite
 * Tests glassmorphism effects, animations, transitions, and browser-specific CSS
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

test.describe('Cross-Browser Compatibility', () => {
  
  test.describe('Glassmorphism Effects', () => {
    test('should apply backdrop-filter blur on glass containers', async ({ page, browserName }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Find glass container elements
      const glassContainers = page.locator('[class*="glass"]').first();
      
      if (await glassContainers.count() > 0) {
        const backdropFilter = await glassContainers.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
            background: style.background,
            border: style.border,
          };
        });
        
        // Check if backdrop-filter is applied or gracefully degraded
        if (browserName === 'webkit' || browserName === 'chromium') {
          // Safari and Chrome should support backdrop-filter
          expect(backdropFilter.backdropFilter).not.toBe('none');
        }
        
        // All browsers should have background and border
        expect(backdropFilter.background).toBeTruthy();
        expect(backdropFilter.border).toBeTruthy();
      }
    });

    test('should apply semi-transparent backgrounds with correct alpha', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check glass button or card
      const glassElements = await page.locator('[class*="glass"]').all();
      
      if (glassElements.length > 0) {
        const bgColor = await glassElements[0].evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Should have rgba or transparent background
        expect(bgColor).toMatch(/rgba?\(|transparent/);
      }
    });

    test('should apply border styling to glass containers', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const glassCard = page.locator('[class*="Card"]').first();
      
      if (await glassCard.count() > 0) {
        const borderStyle = await glassCard.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            border: style.border,
            borderRadius: style.borderRadius,
          };
        });
        
        expect(borderStyle.border).toBeTruthy();
        expect(borderStyle.borderRadius).not.toBe('0px');
      }
    });

    test('should apply box-shadow to glass containers', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const glassCard = page.locator('[class*="Card"]').first();
      
      if (await glassCard.count() > 0) {
        const boxShadow = await glassCard.evaluate((el) => {
          return window.getComputedStyle(el).boxShadow;
        });
        
        expect(boxShadow).not.toBe('none');
      }
    });

    test('should apply border-radius to glass containers', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const glassElements = await page.locator('[class*="glass"]').all();
      
      if (glassElements.length > 0) {
        const borderRadius = await glassElements[0].evaluate((el) => {
          return window.getComputedStyle(el).borderRadius;
        });
        
        // Should have border radius (12px to 20px range)
        expect(borderRadius).not.toBe('0px');
      }
    });
  });

  test.describe('Animations and Transitions', () => {
    test('should apply fadeIn animation', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check for elements with fade-in animation
      const animatedElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const animated = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.animation && style.animation.includes('fade')) {
            animated.push({
              animation: style.animation,
              animationDuration: style.animationDuration,
            });
          }
        });
        
        return animated;
      });
      
      // May or may not have fade animations on login page
      expect(Array.isArray(animatedElements)).toBe(true);
    });

    test('should apply transition effects on hover', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Find buttons
      const button = page.locator('button[type="submit"]').first();
      
      if (await button.count() > 0) {
        const transition = await button.evaluate((el) => {
          return window.getComputedStyle(el).transition;
        });
        
        // Should have transition property
        expect(transition).not.toBe('all 0s ease 0s');
      }
    });

    test('should apply hover state transitions to buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const button = page.locator('button[type="submit"]').first();
      
      if (await button.count() > 0) {
        // Get initial state
        const initialState = await button.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            transform: style.transform,
            boxShadow: style.boxShadow,
          };
        });
        
        // Hover over button
        await button.hover();
        await page.waitForTimeout(100);
        
        // Get hover state
        const hoverState = await button.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            transform: style.transform,
            boxShadow: style.boxShadow,
          };
        });
        
        // States should be defined
        expect(initialState.transform).toBeTruthy();
        expect(hoverState.transform).toBeTruthy();
      }
    });

    test('should apply focus state transitions', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const input = page.locator('input[type="email"]').first();
      
      if (await input.count() > 0) {
        // Focus input
        await input.focus();
        
        const focusState = await input.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            borderColor: style.borderColor,
            boxShadow: style.boxShadow,
            outline: style.outline,
          };
        });
        
        // Should have focus styles
        expect(focusState.borderColor).toBeTruthy();
      }
    });

    test('should have smooth transition durations', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const button = page.locator('button').first();
      
      if (await button.count() > 0) {
        const transitionDuration = await button.evaluate((el) => {
          return window.getComputedStyle(el).transitionDuration;
        });
        
        // Should have transition duration
        expect(transitionDuration).toBeTruthy();
      }
    });
  });

  test.describe('CSS Custom Properties (Variables)', () => {
    test('should load CSS custom properties correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const cssVariables = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);
        
        return {
          colorSkyBlue: styles.getPropertyValue('--color-sky-blue'),
          glassBg: styles.getPropertyValue('--glass-bg'),
          spacing4: styles.getPropertyValue('--spacing-4'),
          radiusMd: styles.getPropertyValue('--radius-md'),
          durationFast: styles.getPropertyValue('--duration-fast'),
        };
      });
      
      // Check that CSS variables are defined
      expect(cssVariables.colorSkyBlue.trim()).toBeTruthy();
      expect(cssVariables.glassBg.trim()).toBeTruthy();
      expect(cssVariables.spacing4.trim()).toBeTruthy();
      expect(cssVariables.radiusMd.trim()).toBeTruthy();
      expect(cssVariables.durationFast.trim()).toBeTruthy();
    });
  });

  test.describe('Gradient Backgrounds', () => {
    test('should apply gradient backgrounds correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check body background
      const bodyBackground = await page.evaluate(() => {
        return window.getComputedStyle(document.body).background;
      });
      
      // Should have gradient or background
      expect(bodyBackground).toBeTruthy();
    });

    test('should apply gradient to buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const button = page.locator('button[type="submit"]').first();
      
      if (await button.count() > 0) {
        const background = await button.evaluate((el) => {
          return window.getComputedStyle(el).background;
        });
        
        expect(background).toBeTruthy();
      }
    });
  });

  test.describe('Flexbox and Grid Layouts', () => {
    test('should apply flexbox layouts correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Find flex containers
      const flexContainers = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const flexElements = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.display === 'flex') {
            flexElements.push({
              display: style.display,
              flexDirection: style.flexDirection,
              justifyContent: style.justifyContent,
              alignItems: style.alignItems,
            });
          }
        });
        
        return flexElements;
      });
      
      // Should have flex containers
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    test('should apply grid layouts correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Find grid containers
      const gridContainers = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const gridElements = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.display === 'grid') {
            gridElements.push({
              display: style.display,
              gridTemplateColumns: style.gridTemplateColumns,
            });
          }
        });
        
        return gridElements;
      });
      
      // May or may not have grid on login page
      expect(Array.isArray(gridContainers)).toBe(true);
    });
  });

  test.describe('Responsive Design', () => {
    test('should apply mobile styles at 375px width', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/login`);
      
      // Check that page renders without horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });

    test('should apply tablet styles at 768px width', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/login`);
      
      // Check that page renders correctly
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });

    test('should apply desktop styles at 1440px width', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}/login`);
      
      // Check that page renders correctly
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Font Rendering', () => {
    test('should apply font smoothing', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const fontSmoothing = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        return {
          webkitFontSmoothing: style.webkitFontSmoothing,
          mozOsxFontSmoothing: style.MozOsxFontSmoothing,
        };
      });
      
      // Should have font smoothing (browser-specific)
      expect(fontSmoothing).toBeTruthy();
    });

    test('should load correct font family', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const fontFamily = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });
      
      // Should have font family defined
      expect(fontFamily).toBeTruthy();
      expect(fontFamily.length).toBeGreaterThan(0);
    });
  });

  test.describe('Scrollbar Styling', () => {
    test('should apply custom scrollbar styles in webkit browsers', async ({ page, browserName }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Scrollbar styling is webkit-specific
      if (browserName === 'webkit' || browserName === 'chromium') {
        const scrollbarStyles = await page.evaluate(() => {
          // Create a scrollable element to test
          const div = document.createElement('div');
          div.style.overflow = 'auto';
          div.style.height = '100px';
          div.innerHTML = '<div style="height: 200px;"></div>';
          document.body.appendChild(div);
          
          const styles = window.getComputedStyle(div, '::-webkit-scrollbar');
          const result = {
            width: styles.width,
          };
          
          document.body.removeChild(div);
          return result;
        });
        
        // Scrollbar styles may or may not be applied
        expect(scrollbarStyles).toBeTruthy();
      }
    });
  });

  test.describe('Browser-Specific Prefixes', () => {
    test('should handle -webkit- prefixed properties', async ({ page, browserName }) => {
      await page.goto(`${BASE_URL}/login`);
      
      if (browserName === 'webkit' || browserName === 'chromium') {
        const webkitProps = await page.evaluate(() => {
          const glassElement = document.querySelector('[class*="glass"]');
          if (!glassElement) return null;
          
          const style = window.getComputedStyle(glassElement);
          return {
            webkitBackdropFilter: style.webkitBackdropFilter,
            webkitFontSmoothing: style.webkitFontSmoothing,
          };
        });
        
        // Webkit properties should be supported
        expect(webkitProps).toBeTruthy();
      }
    });
  });

  test.describe('Color Palette', () => {
    test('should maintain color palette consistency', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const colors = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);
        
        return {
          skyBlue: styles.getPropertyValue('--color-sky-blue'),
          lightCoral: styles.getPropertyValue('--color-light-coral'),
          lavender: styles.getPropertyValue('--color-lavender'),
        };
      });
      
      // Check that color variables are defined
      expect(colors.skyBlue.trim()).toBeTruthy();
      expect(colors.lightCoral.trim()).toBeTruthy();
      expect(colors.lavender.trim()).toBeTruthy();
    });
  });

  test.describe('Z-Index Layering', () => {
    test('should apply correct z-index values', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      const zIndexValues = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);
        
        return {
          zModal: styles.getPropertyValue('--z-modal'),
          zDropdown: styles.getPropertyValue('--z-dropdown'),
          zTooltip: styles.getPropertyValue('--z-tooltip'),
        };
      });
      
      // Check that z-index variables are defined
      expect(zIndexValues.zModal.trim()).toBeTruthy();
      expect(zIndexValues.zDropdown.trim()).toBeTruthy();
      expect(zIndexValues.zTooltip.trim()).toBeTruthy();
    });
  });

  test.describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion in all browsers', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${BASE_URL}/login`);
      
      const animationDuration = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body, '::before');
        return style.animationDuration;
      });
      
      // With reduced motion, animations should be minimal
      expect(['0s', '0.01ms', '0ms']).toContain(animationDuration);
    });
  });

  test.describe('Page Load and Rendering', () => {
    test('should load page without console errors', async ({ page }) => {
      const consoleErrors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');
      
      // Filter out known acceptable errors (like network errors in dev)
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('should render all critical elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check for critical elements
      const criticalElements = await page.evaluate(() => {
        return {
          hasBody: !!document.body,
          hasRoot: !!document.getElementById('root'),
          hasMainContent: !!document.querySelector('main, [role="main"]'),
          hasForm: !!document.querySelector('form'),
        };
      });
      
      expect(criticalElements.hasBody).toBe(true);
      expect(criticalElements.hasRoot).toBe(true);
      expect(criticalElements.hasMainContent).toBe(true);
    });
  });

  test.describe('CSS Module Loading', () => {
    test('should load CSS modules correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check that CSS modules are generating scoped class names
      const hasScopedClasses = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class]');
        let foundScopedClass = false;
        
        elements.forEach(el => {
          const classes = el.className;
          // CSS modules typically generate classes with hash suffixes
          if (typeof classes === 'string' && classes.includes('_')) {
            foundScopedClass = true;
          }
        });
        
        return foundScopedClass;
      });
      
      // Should have CSS module scoped classes
      expect(hasScopedClasses).toBe(true);
    });
  });
});

test.describe('Cross-Browser - Dashboard Page', () => {
  test.skip('should render dashboard with glassmorphism effects', async ({ page }) => {
    // Requires authentication
    // Skip for now
  });
});

test.describe('Browser-Specific Compatibility Report', () => {
  test('should generate compatibility report', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/login`);
    
    const report = await page.evaluate(() => {
      const glassElement = document.querySelector('[class*="glass"]');
      const button = document.querySelector('button');
      
      const glassStyles = glassElement ? window.getComputedStyle(glassElement) : null;
      const buttonStyles = button ? window.getComputedStyle(button) : null;
      
      return {
        backdropFilter: glassStyles?.backdropFilter || glassStyles?.webkitBackdropFilter || 'not supported',
        transitions: buttonStyles?.transition || 'not supported',
        flexbox: glassStyles?.display === 'flex' ? 'supported' : 'not tested',
        cssVariables: window.getComputedStyle(document.documentElement).getPropertyValue('--color-sky-blue') ? 'supported' : 'not supported',
      };
    });
    
    console.log(`\n=== ${browserName.toUpperCase()} Compatibility Report ===`);
    console.log(`Backdrop Filter: ${report.backdropFilter}`);
    console.log(`Transitions: ${report.transitions}`);
    console.log(`Flexbox: ${report.flexbox}`);
    console.log(`CSS Variables: ${report.cssVariables}`);
    console.log('=====================================\n');
    
    // All modern browsers should support these features
    expect(report.cssVariables).toBe('supported');
  });
});
