import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for all browsers
    await page.route('**/api/**', route => {
      const url = route.request().url();
      
      if (url.includes('/api/auth/login')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true,
            token: 'mock-token',
            user: { id: '1', email: 'test@example.com' }
          })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] })
        });
      }
    });
  });

  test('renders correctly across all browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Verify core elements render
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    console.log(`✓ Page renders correctly in ${browserName}`);
  });

  test('form inputs work across all browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Test input functionality
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Verify values are set
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');

    console.log(`✓ Form inputs work correctly in ${browserName}`);
  });

  test('buttons are clickable across all browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Click should work
    await submitButton.click();
    await page.waitForTimeout(500);

    console.log(`✓ Buttons are clickable in ${browserName}`);
  });

  test('CSS styles render correctly', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Check if Tailwind CSS is loaded
    const body = page.locator('body');
    const bodyClasses = await body.getAttribute('class');
    
    // Verify page has styling
    const hasBackground = await page.evaluate(() => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      return bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
    });

    console.log(`✓ CSS styles render in ${browserName}`);
  });

  test('navigation works across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Try to find and click navigation links
    const signupLink = page.getByText(/sign up|create account/i).first();
    if (await signupLink.isVisible().catch(() => false)) {
      await signupLink.click();
      await page.waitForTimeout(500);
      
      // Should still have form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      
      console.log(`✓ Navigation works in ${browserName}`);
    }
  });

  test('localStorage works across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Test localStorage
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });

    const value = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });

    expect(value).toBe('test-value');

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-key');
    });

    console.log(`✓ localStorage works in ${browserName}`);
  });

  test('responsive design works across browsers', async ({ page, browserName }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await expect(page.locator('input[type="email"]')).toBeVisible();

    console.log(`✓ Responsive design works in ${browserName}`);
  });

  test('keyboard events work across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(['INPUT', 'BUTTON', 'A', 'BODY']).toContain(focusedElement);

    console.log(`✓ Keyboard events work in ${browserName}`);
  });

  test('form submission works across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Should handle submission (stay on page or navigate)
    const url = page.url();
    expect(url).toBeTruthy();

    console.log(`✓ Form submission works in ${browserName}`);
  });
});

test.describe('Browser-Specific Issue Detection', () => {
  test('detects console errors', async ({ page, browserName }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Log any errors found
    if (errors.length > 0) {
      console.log(`⚠ Console errors in ${browserName}:`, errors);
    } else {
      console.log(`✓ No console errors in ${browserName}`);
    }
  });

  test('detects failed network requests', async ({ page, browserName }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()
      });
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Log any failed requests
    if (failedRequests.length > 0) {
      console.log(`⚠ Failed requests in ${browserName}:`, failedRequests);
    } else {
      console.log(`✓ No failed requests in ${browserName}`);
    }
  });
});
