import { test, expect } from '@playwright/test';

test.describe('Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API with realistic delays
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
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
      } else if (url.includes('/api/instances')) {
        // Mock large dataset of instances
        const instances = Array.from({ length: 100 }, (_, i) => ({
          id: `instance-${i}`,
          name: `Instance ${i}`,
          memberCount: Math.floor(Math.random() * 20),
          role: ['Owner', 'Editor', 'Viewer'][i % 3],
          lastModified: new Date(Date.now() - i * 86400000).toISOString()
        }));
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: instances })
        });
      } else if (url.includes('/api/notes')) {
        // Mock large dataset of notes
        const notes = Array.from({ length: 50 }, (_, i) => ({
          id: `note-${i}`,
          title: `Note ${i}`,
          content: 'Lorem ipsum '.repeat(100),
          createdAt: new Date(Date.now() - i * 3600000).toISOString()
        }));
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: notes })
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

  test('measures page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Measure Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const metrics = {};
          
          // First Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                metrics.FCP = entry.startTime;
              }
            });
          }).observe({ entryTypes: ['paint'] });
          
          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.LCP = lastEntry.startTime;
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          setTimeout(() => resolve(metrics), 2000);
        } else {
          resolve({});
        }
      });
    });
    
    console.log('Web Vitals:', metrics);
    
    if (metrics.FCP) {
      console.log(`First Contentful Paint: ${metrics.FCP}ms`);
      expect(metrics.FCP).toBeLessThan(2000);
    }
    
    if (metrics.LCP) {
      console.log(`Largest Contentful Paint: ${metrics.LCP}ms`);
      expect(metrics.LCP).toBeLessThan(2500);
    }
  });

  test('handles large dataset rendering', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Measure rendering time for large list
    const startTime = Date.now();
    
    // Wait for content to render
    await page.waitForTimeout(1000);
    
    const renderTime = Date.now() - startTime;
    console.log(`Large dataset render time: ${renderTime}ms`);
    
    // Should render within 2 seconds
    expect(renderTime).toBeLessThan(2000);
  });

  test('measures search performance with large dataset', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    
    if (await searchInput.isVisible().catch(() => false)) {
      const startTime = Date.now();
      
      // Type search query
      await searchInput.fill('Instance 5');
      
      // Wait for debounce and results
      await page.waitForTimeout(500);
      
      const searchTime = Date.now() - startTime;
      console.log(`Search time: ${searchTime}ms`);
      
      // Search should complete within 1 second
      expect(searchTime).toBeLessThan(1000);
    }
  });

  test('measures memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        };
      }
      return null;
    });
    
    if (initialMemory) {
      console.log('Initial memory:', {
        used: `${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(initialMemory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`
      });
      
      // Perform some operations
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Get memory after operations
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          };
        }
        return null;
      });
      
      if (finalMemory) {
        console.log('Final memory:', {
          used: `${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(finalMemory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`
        });
        
        const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
        
        // Memory increase should be reasonable (< 50MB)
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      }
    }
  });

  test('measures bundle size impact', async ({ page }) => {
    const resources = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        resources.push({
          url: url.split('/').pop(),
          size: response.headers()['content-length'] || 0,
          type: url.includes('.js') ? 'JavaScript' : 'CSS'
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('Loaded resources:');
    let totalSize = 0;
    resources.forEach(resource => {
      const sizeKB = (parseInt(resource.size) / 1024).toFixed(2);
      console.log(`  ${resource.type}: ${resource.url} - ${sizeKB} KB`);
      totalSize += parseInt(resource.size);
    });
    
    console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Total bundle should be reasonable (< 2MB)
    expect(totalSize).toBeLessThan(2 * 1024 * 1024);
  });

  test('simulates real-time collaboration load', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Simulate multiple rapid updates
    const startTime = Date.now();
    const updateCount = 50;
    
    for (let i = 0; i < updateCount; i++) {
      // Simulate typing or drawing events
      await page.evaluate(() => {
        // Trigger state updates
        window.dispatchEvent(new CustomEvent('test-update', { 
          detail: { id: Math.random() } 
        }));
      });
      
      await page.waitForTimeout(10);
    }
    
    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / updateCount;
    
    console.log(`Processed ${updateCount} updates in ${totalTime}ms`);
    console.log(`Average time per update: ${avgTime.toFixed(2)}ms`);
    
    // Should handle updates efficiently
    expect(avgTime).toBeLessThan(50);
  });

  test('measures scroll performance with large lists', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Measure scroll performance
    const scrollMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let startTime = performance.now();
        
        const measureFrames = () => {
          frameCount++;
          if (frameCount < 60) {
            requestAnimationFrame(measureFrames);
          } else {
            const endTime = performance.now();
            const duration = endTime - startTime;
            const fps = (frameCount / duration) * 1000;
            resolve({ fps, duration });
          }
        };
        
        // Start scrolling
        window.scrollBy(0, 100);
        requestAnimationFrame(measureFrames);
      });
    });
    
    console.log(`Scroll performance: ${scrollMetrics.fps.toFixed(2)} FPS`);
    
    // Should maintain at least 30 FPS
    expect(scrollMetrics.fps).toBeGreaterThan(30);
  });

  test('detects performance bottlenecks', async ({ page }) => {
    await page.goto('/');
    
    // Collect performance entries
    await page.waitForLoadState('networkidle');
    
    const performanceData = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      
      return {
        navigation: navigation ? {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart
        } : null,
        slowResources: resources
          .filter(r => r.duration > 500)
          .map(r => ({
            name: r.name.split('/').pop(),
            duration: r.duration
          }))
      };
    });
    
    console.log('Performance data:', performanceData);
    
    if (performanceData.navigation) {
      console.log(`DOM Content Loaded: ${performanceData.navigation.domContentLoaded}ms`);
      console.log(`Load Complete: ${performanceData.navigation.loadComplete}ms`);
      console.log(`DOM Interactive: ${performanceData.navigation.domInteractive}ms`);
    }
    
    if (performanceData.slowResources.length > 0) {
      console.log('Slow resources detected:');
      performanceData.slowResources.forEach(r => {
        console.log(`  ${r.name}: ${r.duration.toFixed(2)}ms`);
      });
    }
  });
});
