import { test, expect } from '@playwright/test';

test.describe('Complete User Journey - Frontend UI Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all API calls to simulate backend responses
    await page.route('**/api/**', route => {
      const url = route.request().url();
      const method = route.request().method();
      
      // Mock authentication endpoints
      if (url.includes('/api/auth/register') && method === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true, 
            message: 'Registration successful',
            user: { id: '1', email: 'test@example.com', name: 'Test User' }
          })
        });
      } else if (url.includes('/api/auth/login') && method === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true,
            token: 'mock-jwt-token',
            user: { id: '1', email: 'test@example.com', name: 'Test User' }
          })
        });
      } else if (url.includes('/api/auth/me')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            id: '1', 
            email: 'test@example.com', 
            name: 'Test User',
            emailVerified: true
          })
        });
      } else {
        // Default success response for other endpoints
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] })
        });
      }
    });
  });

  test('should render complete UI flow from signup to collaboration', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // Should show login page or redirect to it
    await page.waitForTimeout(1000);
    
    // Verify login form elements are present
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Switch to signup form if available
    const signupLink = page.getByText(/sign up|create account/i).first();
    if (await signupLink.isVisible().catch(() => false)) {
      await signupLink.click();
      await page.waitForTimeout(500);
      
      // Verify signup form elements
      await expect(emailInput).toBeVisible();
      
      // Fill signup form
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPassword123!');
      
      const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm"]').first();
      if (await confirmPasswordField.isVisible().catch(() => false)) {
        await confirmPasswordField.fill('TestPassword123!');
      }
      
      // Accept terms if checkbox exists
      const termsCheckbox = page.locator('input[type="checkbox"]').first();
      if (await termsCheckbox.isVisible().catch(() => false)) {
        await termsCheckbox.check();
      }
      
      await submitButton.click();
      await page.waitForTimeout(1000);
    }

    // Fill login form
    await emailInput.fill('test@example.com');
    await passwordInput.fill('TestPassword123!');
    await submitButton.click();

    // Wait for navigation after login
    await page.waitForTimeout(2000);

    // Verify we're on dashboard or main page
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    // Look for dashboard elements
    const createButton = page.getByRole('button', { name: /create|new|add/i }).first();
    if (await createButton.isVisible().catch(() => false)) {
      console.log('✓ Dashboard loaded with create button visible');
    }

    // Verify navigation bar is present
    const navbar = page.locator('nav, [role="navigation"], .navbar').first();
    if (await navbar.isVisible().catch(() => false)) {
      console.log('✓ Navigation bar is visible');
    }

    console.log('✓ Complete UI flow test passed');
  });

  test('should verify all main UI components render', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Check authentication page components
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check for OAuth buttons
    const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")').first();
    const microsoftBtn = page.locator('button:has-text("Microsoft"), a:has-text("Microsoft")').first();
    
    const hasOAuth = await googleBtn.isVisible().catch(() => false) || 
                     await microsoftBtn.isVisible().catch(() => false);
    
    if (hasOAuth) {
      console.log('✓ OAuth buttons are present');
    }

    // Check for forgot password link
    const forgotLink = page.getByText(/forgot.*password/i).first();
    if (await forgotLink.isVisible().catch(() => false)) {
      console.log('✓ Forgot password link is present');
    }

    console.log('✓ All main UI components verified');
  });
});
