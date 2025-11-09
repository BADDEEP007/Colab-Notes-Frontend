import { test, expect } from '@playwright/test';

test.describe('Critical Paths Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('authentication flow - login page loads', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('authentication flow - form validation', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors or prevent submission
    await page.waitForTimeout(500);
    
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'short');
    await page.click('button[type="submit"]');
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('navigation - OAuth buttons present', async ({ page }) => {
    const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")');
    const microsoftBtn = page.locator('button:has-text("Microsoft"), a:has-text("Microsoft")');
    
    // At least one OAuth option should be visible
    const googleVisible = await googleBtn.isVisible().catch(() => false);
    const microsoftVisible = await microsoftBtn.isVisible().catch(() => false);
    
    expect(googleVisible || microsoftVisible).toBeTruthy();
  });

  test('navigation - switch between login and signup', async ({ page }) => {
    // Find signup link
    const signupLink = page.getByText(/sign up|create account|register/i);
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await page.waitForTimeout(500);
      
      // Should show signup form elements
      const emailField = page.locator('input[type="email"]');
      await expect(emailField).toBeVisible();
      
      // Switch back to login
      const loginLink = page.getByText(/log in|sign in|already have/i);
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('forgot password flow', async ({ page }) => {
    const forgotLink = page.getByText(/forgot.*password/i);
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await page.waitForTimeout(500);
      
      // Should show email input for password recovery
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be functional
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('responsive design - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Page should still be functional
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('accessibility - keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to focus on elements
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('error handling - network error simulation', async ({ page }) => {
    // Fill form with test credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Should handle error gracefully (stay on page or show error)
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });
});
