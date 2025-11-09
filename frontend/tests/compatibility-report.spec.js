/**
 * Browser Compatibility Report Generator
 * Generates detailed compatibility reports for each browser
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4
 */

import { test } from '@playwright/test';
import { checkBrowserCompatibility, formatCompatibilityReport, generateCompatibilitySummary } from './browser-compatibility-check.js';

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';
const reports = [];

test.describe('Browser Compatibility Report', () => {
  
  test('generate compatibility report for current browser', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Generate compatibility report
    const report = await checkBrowserCompatibility(page, browserName);
    reports.push(report);
    
    // Format and log the report
    const formattedReport = formatCompatibilityReport(report);
    console.log(formattedReport);
    
    // Save report to file
    const fs = await import('fs');
    const path = await import('path');
    
    const reportDir = path.join(process.cwd(), 'test-results', 'compatibility-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportFile = path.join(reportDir, `${browserName}-compatibility-report.txt`);
    fs.writeFileSync(reportFile, formattedReport);
    
    console.log(`Report saved to: ${reportFile}`);
  });

  test('test glassmorphism at different viewports', async ({ page, browserName }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' },
    ];

    const viewportReports = [];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');

      const report = await checkBrowserCompatibility(page, `${browserName}-${viewport.name}`);
      viewportReports.push(report);

      console.log(`\n${browserName.toUpperCase()} - ${viewport.name} (${viewport.width}x${viewport.height})`);
      console.log(`Horizontal Scroll: ${report.layout.hasHorizontalScroll ? '✗ YES (ISSUE)' : '✓ NO'}`);
      console.log(`Backdrop Filter: ${report.glassmorphism.backdropFilter ? '✓ WORKING' : '✗ NOT WORKING'}`);
    }

    // Save viewport-specific report
    const fs = await import('fs');
    const path = await import('path');
    
    const reportDir = path.join(process.cwd(), 'test-results', 'compatibility-reports');
    const reportFile = path.join(reportDir, `${browserName}-viewport-report.json`);
    
    fs.writeFileSync(reportFile, JSON.stringify(viewportReports, null, 2));
    console.log(`\nViewport report saved to: ${reportFile}`);
  });

  test('test animations and transitions', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Test button transitions
    const button = page.locator('button[type="submit"]').first();
    
    if (await button.count() > 0) {
      // Get initial state
      const initialTransform = await button.evaluate(el => 
        window.getComputedStyle(el).transform
      );

      // Hover
      await button.hover();
      await page.waitForTimeout(400); // Wait for transition

      // Get hover state
      const hoverTransform = await button.evaluate(el => 
        window.getComputedStyle(el).transform
      );

      console.log(`\n${browserName.toUpperCase()} - Button Transitions:`);
      console.log(`Initial Transform: ${initialTransform}`);
      console.log(`Hover Transform: ${hoverTransform}`);
      console.log(`Transition Working: ${initialTransform !== hoverTransform ? '✓ YES' : '⚠ SAME'}`);
    }

    // Test input focus transitions
    const input = page.locator('input[type="email"]').first();
    
    if (await input.count() > 0) {
      const initialBorder = await input.evaluate(el => 
        window.getComputedStyle(el).borderColor
      );

      await input.focus();
      await page.waitForTimeout(400);

      const focusBorder = await input.evaluate(el => 
        window.getComputedStyle(el).borderColor
      );

      console.log(`\n${browserName.toUpperCase()} - Input Focus:`);
      console.log(`Initial Border: ${initialBorder}`);
      console.log(`Focus Border: ${focusBorder}`);
      console.log(`Focus Transition: ${initialBorder !== focusBorder ? '✓ WORKING' : '⚠ SAME'}`);
    }
  });

  test('test reduced motion support', async ({ page, browserName }) => {
    // Test with reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    const reducedMotionReport = await page.evaluate(() => {
      const bodyBefore = window.getComputedStyle(document.body, '::before');
      
      return {
        reducedMotionActive: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        bodyBeforeAnimation: bodyBefore.animationDuration,
        bodyBeforeAnimationName: bodyBefore.animationName,
      };
    });

    console.log(`\n${browserName.toUpperCase()} - Reduced Motion:`);
    console.log(`Reduced Motion Active: ${reducedMotionReport.reducedMotionActive ? '✓ YES' : '✗ NO'}`);
    console.log(`Animation Duration: ${reducedMotionReport.bodyBeforeAnimation}`);
    console.log(`Properly Reduced: ${['0s', '0.01ms', '0ms'].includes(reducedMotionReport.bodyBeforeAnimation) ? '✓ YES' : '✗ NO'}`);

    // Test without reduced motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    const normalMotionReport = await page.evaluate(() => {
      const bodyBefore = window.getComputedStyle(document.body, '::before');
      
      return {
        reducedMotionActive: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        bodyBeforeAnimation: bodyBefore.animationDuration,
      };
    });

    console.log(`\n${browserName.toUpperCase()} - Normal Motion:`);
    console.log(`Reduced Motion Active: ${normalMotionReport.reducedMotionActive ? '✗ YES (SHOULD BE NO)' : '✓ NO'}`);
    console.log(`Animation Duration: ${normalMotionReport.bodyBeforeAnimation}`);
  });

  test('test CSS module scoping', async ({ page, browserName }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    const moduleScopingReport = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class]');
      const classPatterns = {
        hasModuleClasses: false,
        hasUnderscoreClasses: false,
        hasHashClasses: false,
        sampleClasses: [],
      };

      elements.forEach(el => {
        const classes = el.className;
        if (typeof classes === 'string' && classes.length > 0) {
          // CSS modules typically generate classes with underscores or hashes
          if (classes.includes('_')) {
            classPatterns.hasUnderscoreClasses = true;
            classPatterns.hasModuleClasses = true;
          }
          if (/[a-f0-9]{5,}/.test(classes)) {
            classPatterns.hasHashClasses = true;
            classPatterns.hasModuleClasses = true;
          }
          
          if (classPatterns.sampleClasses.length < 5) {
            classPatterns.sampleClasses.push(classes.split(' ')[0]);
          }
        }
      });

      return classPatterns;
    });

    console.log(`\n${browserName.toUpperCase()} - CSS Module Scoping:`);
    console.log(`Module Classes Found: ${moduleScopingReport.hasModuleClasses ? '✓ YES' : '✗ NO'}`);
    console.log(`Underscore Pattern: ${moduleScopingReport.hasUnderscoreClasses ? '✓ YES' : '✗ NO'}`);
    console.log(`Hash Pattern: ${moduleScopingReport.hasHashClasses ? '✓ YES' : '✗ NO'}`);
    console.log(`Sample Classes: ${moduleScopingReport.sampleClasses.join(', ')}`);
  });
});

// Generate summary after all tests
test.afterAll(async () => {
  if (reports.length > 0) {
    const summary = generateCompatibilitySummary(reports);
    console.log(summary);

    // Save summary
    const fs = await import('fs');
    const path = await import('path');
    
    const reportDir = path.join(process.cwd(), 'test-results', 'compatibility-reports');
    const summaryFile = path.join(reportDir, 'compatibility-summary.txt');
    
    fs.writeFileSync(summaryFile, summary);
    console.log(`Summary saved to: ${summaryFile}`);
  }
});
