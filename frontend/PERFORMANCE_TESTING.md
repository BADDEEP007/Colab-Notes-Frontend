# Performance Testing Guide

## Overview

This document outlines the performance testing strategy for the Collab Notes frontend application, including benchmarks, optimization techniques, and monitoring approaches.

## Performance Benchmarks

### Target Metrics

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| First Contentful Paint (FCP) | < 1.5s | < 2.0s |
| Largest Contentful Paint (LCP) | < 2.0s | < 2.5s |
| Time to Interactive (TTI) | < 3.0s | < 3.5s |
| First Input Delay (FID) | < 100ms | < 300ms |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |
| Total Bundle Size | < 500KB | < 1MB |
| Initial Load Time | < 2s | < 3s |

### Real-Time Collaboration Metrics

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| WebSocket Connection Time | < 500ms | < 1s |
| Note Update Latency | < 100ms | < 200ms |
| Drawing Update Latency | < 50ms | < 100ms |
| Concurrent Users Supported | 10+ | 5+ |

## Running Performance Tests

### Automated Performance Tests

```bash
# Run all performance tests
npx playwright test e2e/performance.spec.js

# Run specific performance test
npx playwright test e2e/performance.spec.js -g "page load"

# Run with performance profiling
npx playwright test e2e/performance.spec.js --trace on
```

### Manual Performance Testing

#### 1. Chrome DevTools Performance

```bash
# Start dev server
npm run dev

# Open Chrome DevTools (F12)
# Go to Performance tab
# Click Record
# Interact with application
# Stop recording and analyze
```

#### 2. Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view

# Run specific categories
lighthouse http://localhost:5173 --only-categories=performance --view
```

#### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# This will generate a visual report of bundle composition
```

## Performance Testing Scenarios

### 1. Large Dataset Testing

Test with:
- 100+ instances
- 50+ notes per container
- 20+ active users
- Large note content (10,000+ characters)
- Complex whiteboard drawings (100+ objects)

```javascript
// Mock large dataset in tests
const instances = Array.from({ length: 100 }, (_, i) => ({
  id: `instance-${i}`,
  name: `Instance ${i}`,
  memberCount: Math.floor(Math.random() * 20),
  role: ['Owner', 'Editor', 'Viewer'][i % 3]
}));
```

### 2. Real-Time Collaboration Load

Simulate:
- Multiple users editing simultaneously
- Rapid note updates (10+ per second)
- Continuous whiteboard drawing
- Frequent online status changes

### 3. Network Conditions

Test under various network conditions:

```bash
# Slow 3G
npx playwright test --network-profile=Slow3G

# Fast 3G
npx playwright test --network-profile=Fast3G

# Offline
npx playwright test --network-profile=Offline
```

## Performance Optimization Techniques

### 1. Code Splitting

```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Instance = lazy(() => import('./pages/Instance'));
const Whiteboard = lazy(() => import('./components/Whiteboard'));
```

### 2. Memoization

```javascript
// Expensive computations
const sortedInstances = useMemo(() => {
  return instances.sort((a, b) => b.updatedAt - a.updatedAt);
}, [instances]);

// Component memoization
const InstanceCard = memo(({ instance }) => {
  // Component implementation
});
```

### 3. Virtual Scrolling

```javascript
// For large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={instances.length}
  itemSize={120}
>
  {({ index, style }) => (
    <div style={style}>
      <InstanceCard instance={instances[index]} />
    </div>
  )}
</FixedSizeList>
```

### 4. Debouncing and Throttling

```javascript
// Auto-save debouncing
const debouncedSave = useMemo(
  () => debounce((content) => saveNote(content), 500),
  []
);

// Scroll throttling
const throttledScroll = useMemo(
  () => throttle((e) => handleScroll(e), 100),
  []
);
```

### 5. Image Optimization

```javascript
// Lazy loading images
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
/>

// Use WebP format with fallback
<picture>
  <source srcSet={imageWebP} type="image/webp" />
  <img src={imagePng} alt="Description" />
</picture>
```

## Monitoring Performance

### 1. Web Vitals Tracking

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  console.log(metric.name, metric.value);
  // Send to analytics service
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Custom Performance Marks

```javascript
// Mark start of operation
performance.mark('note-save-start');

// Perform operation
await saveNote(content);

// Mark end and measure
performance.mark('note-save-end');
performance.measure('note-save', 'note-save-start', 'note-save-end');

// Get measurement
const measure = performance.getEntriesByName('note-save')[0];
console.log(`Note save took ${measure.duration}ms`);
```

### 3. Real-Time Metrics

Monitor in production:
- WebSocket connection stability
- Average message latency
- Failed request rate
- Client-side error rate
- Memory usage over time

## Performance Regression Testing

### Continuous Integration

Add performance tests to CI pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npx playwright install
      - run: npx playwright test e2e/performance.spec.js
```

### Performance Budget

Set budgets in `vite.config.js`:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Keep chunks under 500KB
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
});
```

## Troubleshooting Performance Issues

### Common Issues and Solutions

#### 1. Slow Initial Load

**Symptoms**: High FCP/LCP times

**Solutions**:
- Enable code splitting
- Optimize bundle size
- Use CDN for static assets
- Enable compression (gzip/brotli)
- Implement service worker caching

#### 2. Janky Scrolling

**Symptoms**: Low FPS during scroll

**Solutions**:
- Implement virtual scrolling
- Use CSS `will-change` property
- Reduce DOM complexity
- Throttle scroll event handlers
- Use `requestAnimationFrame`

#### 3. Memory Leaks

**Symptoms**: Increasing memory usage over time

**Solutions**:
- Clean up event listeners
- Cancel pending requests on unmount
- Clear intervals/timeouts
- Properly dispose of Fabric.js objects
- Use WeakMap for caching

#### 4. Slow Real-Time Updates

**Symptoms**: High latency in collaboration

**Solutions**:
- Implement debouncing for updates
- Use WebSocket compression
- Batch multiple updates
- Optimize state update logic
- Use operational transformation

## Performance Testing Checklist

Before release, verify:

- [ ] All performance tests pass
- [ ] Lighthouse score > 90
- [ ] Bundle size within budget
- [ ] No memory leaks detected
- [ ] Smooth scrolling (60 FPS)
- [ ] Fast initial load (< 2s)
- [ ] Real-time updates < 100ms latency
- [ ] Works well with 100+ items
- [ ] Handles poor network conditions
- [ ] No console errors or warnings

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Playwright Performance Testing](https://playwright.dev/docs/test-assertions)
