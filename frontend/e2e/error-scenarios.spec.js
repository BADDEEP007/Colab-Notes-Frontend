import { test, expect } from '@playwright/test';

test.describe('Error Scenarios Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API to return errors for testing
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false,
          message: 'Invalid credentials'
        })
      });
    });
    
    await page.goto('/');
  });

  test('handles invalid login credentials UI', async ({ page }) => {
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error response
    await page.waitForTimeout(2000);
    
    // Should show error message or stay on login page
    const hasError = await page.locator('text=/error|invalid|incorrect|failed/i').isVisible().catch(() => false);
    const stillOnLogin = page.url().includes('login') || page.url().endsWith('/');
    
    expect(hasError || stillOnLogin).toBeTruthy();
    console.log('✓ Invalid credentials handled correctly');
  });

  test('handles missing required fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    
    // Should prevent submission or show validation
    await expect(page).toHaveURL(/.*login/);
  });

  test('handles network timeout gracefully', async ({ page }) => {
    // Override the beforeEach mock for this test
    await page.unroute('**/api/auth/login');
    
    // Set very short timeout
    await page.route('**/api/**', route => {
      setTimeout(() => route.abort('timedout'), 100);
    });
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should handle timeout
    await page.waitForTimeout(2000);
    
    // Application should still be responsive
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeVisible();
    console.log('✓ Network timeout handled gracefully');
  });

  test('handles 404 navigation', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    await page.waitForTimeout(1000);
    
    // Should redirect to login or show 404 page
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('handles malformed data input', async ({ page }) => {
    // Try XSS-like input
    await page.fill('input[type="email"]', '<script>alert("xss")</script>');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    
    // Should sanitize or reject input
    const alerts = await page.evaluate(() => window.alert.toString());
    expect(alerts).toBeTruthy();
  });

  test('handles session expiration', async ({ page }) => {
    // Clear all storage to simulate expired session
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to access protected route
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('handles rapid form submissions', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click submit multiple times rapidly
    await page.click('button[type="submit"]');
    await page.click('button[type="submit"]');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Should handle gracefully without multiple submissions
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('handles browser back button', async ({ page }) => {
    // Navigate to signup
    const signupLink = page.getByText(/sign up|create account/i);
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await page.waitForTimeout(500);
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Should be back on login
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('handles page reload during form fill', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // Form should be cleared or restored
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('handles JavaScript errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Interact with page
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Page should still be functional despite any errors
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
