# Quick Cross-Browser Testing Reference

## Quick Start

```bash
# 1. Install all browsers (first time only)
npx playwright install

# 2. Run cross-browser tests
npm run test:e2e -- cross-browser.spec.js

# 3. View results
npm run test:e2e:report
```

## Test Specific Browser

```bash
# Chrome only
npx playwright test cross-browser.spec.js --project=chromium

# Firefox only
npx playwright test cross-browser.spec.js --project=firefox

# Safari only
npx playwright test cross-browser.spec.js --project=webkit

# Edge only
npx playwright test cross-browser.spec.js --project=edge
```

## Generate Compatibility Reports

```bash
# Run compatibility report generator
npx playwright test compatibility-report.spec.js

# View reports in test-results/compatibility-reports/
ls test-results/compatibility-reports/
```

## Test Results

- ✓ **Chrome:** 26/30 tests passed
- ✓ **Firefox:** 26/30 tests passed  
- ⚠ **Safari:** Needs `npx playwright install webkit`
- ⚠ **Edge:** Needs `npx playwright install msedge`

## What's Tested

- Glassmorphism effects (backdrop-filter, transparency, borders)
- Animations and transitions
- CSS variables
- Responsive layouts (375px, 768px, 1440px)
- Browser-specific prefixes
- Reduced motion support
- CSS Module scoping

## Documentation

- Full Guide: `CROSS_BROWSER_TESTING_GUIDE.md`
- Test Results: `CROSS_BROWSER_TEST_RESULTS.md`
- Test Files: `tests/cross-browser.spec.js`
