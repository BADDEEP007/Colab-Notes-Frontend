# Collab Notes - Complete Design System & Layout Guide

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Glassmorphism Effects](#glassmorphism-effects)
6. [Component Styles](#component-styles)
7. [Layout Patterns](#layout-patterns)
8. [Animation System](#animation-system)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)
11. [Performance Optimization](#performance-optimization)
12. [Browser Compatibility](#browser-compatibility)

---

## Design Philosophy

### Core Principles
- **Light & Fluid**: Soft glassmorphism aesthetic with light color tones
- **Collaborative**: Design reflects focus and teamwork
- **Productive**: Clean interface that minimizes distractions
- **Futuristic**: Modern glass effects with smooth animations
- **Accessible**: WCAG AA compliant with keyboard navigation

### Visual Language
- Soft, translucent surfaces with backdrop blur
- Gentle gradients (blue → peach)
- Subtle shadows for depth
- Smooth, natural animations
- Consistent spacing and alignment

---

## Color System

### Primary Colors
```css
--color-sky-blue: #B3E5FC      /* Primary brand color */
--color-soft-peach: #FFE0B2    /* Secondary brand color */
--color-off-white: #F9FAFB     /* Background base */
--color-muted-navy: #355C7D    /* Text and icons */
--color-light-coral: #FFAB91   /* Highlights and errors */
```

### Semantic Colors
```css
--color-success: #81C784       /* Success states */
--color-error: #FFAB91         /* Error states */
--color-warning: #FFD54F       /* Warning states */
--color-info: #B3E5FC          /* Info states */
```

### Glass Effect Colors
```css
--glass-bg: rgba(255, 255, 255, 0.75)           /* Standard glass */
--glass-bg-light: rgba(255, 255, 255, 0.55)     /* Light glass */
--glass-bg-dark: rgba(255, 255, 255, 0.88)      /* Dark glass */
--glass-border: rgba(255, 255, 255, 0.35)       /* Glass borders */
```

### Gradients
```css
/* Primary gradient - Blue to Peach with smooth mid-point */
--gradient-primary: linear-gradient(135deg, #B3E5FC 0%, #D4E9F7 50%, #FFE0B2 100%)

/* Secondary gradient - Peach to Coral */
--gradient-secondary: linear-gradient(135deg, #FFE0B2 0%, #FFCCA0 50%, #FFAB91 100%)

/* Background gradient - Multi-stop for ultra-smooth transitions */
--gradient-bg: linear-gradient(135deg, 
  #e0f2fe 0%, 
  #f0f4f8 25%, 
  #fef2f2 50%, 
  #f5f0f8 75%, 
  #ede9fe 100%
)

/* Button gradients */
--gradient-button: linear-gradient(135deg, #B3E5FC 0%, #D4E9F7 50%, #FFE0B2 100%)
--gradient-button-hover: linear-gradient(135deg, #81D4FA 0%, #B8DCEF 50%, #FFCC80 100%)
```

### Color Usage Guidelines
- **Primary (Sky Blue)**: Main actions, links, active states
- **Secondary (Soft Peach)**: Secondary actions, highlights
- **Navy**: Body text, icons, headings
- **Coral**: Errors, destructive actions, urgent notifications
- **White/Off-White**: Backgrounds, cards, containers

---

## Typography

### Font Family
```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
```

### Font Sizes
```css
--font-size-xs: 0.75rem      /* 12px - Small labels */
--font-size-sm: 0.875rem     /* 14px - Secondary text */
--font-size-base: 1rem       /* 16px - Body text */
--font-size-lg: 1.125rem     /* 18px - Large body */
--font-size-xl: 1.25rem      /* 20px - Small headings */
--font-size-2xl: 1.5rem      /* 24px - Medium headings */
--font-size-3xl: 1.875rem    /* 30px - Large headings */
--font-size-4xl: 2.25rem     /* 36px - Hero text */
```

### Font Weights
```css
--font-normal: 400           /* Body text */
--font-medium: 500           /* Emphasized text */
--font-semibold: 600         /* Buttons, labels */
--font-bold: 700             /* Headings */
```

### Typography Scale (Responsive)
- **Mobile**: Base 16px, scales down for smaller screens
- **Tablet**: Base 16px, slightly larger headings
- **Desktop**: Base 16px, full scale for headings

### Usage Guidelines
- **Headings**: Use semibold or bold weights
- **Body**: Use normal weight (400)
- **Buttons**: Use semibold (600)
- **Labels**: Use medium (500)
- **Line Height**: 1.5 for body, 1.2 for headings

---

## Spacing System

### Base Unit: 4px
All spacing follows a 4px base unit for consistency.

### Spacing Scale
```css
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-5: 1.25rem    /* 20px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
--spacing-12: 3rem      /* 48px */
--spacing-16: 4rem      /* 64px */
```

### Spacing Usage
- **Tight spacing**: 8px (spacing-2) - Between related elements
- **Normal spacing**: 16px (spacing-4) - Standard component spacing
- **Loose spacing**: 24px (spacing-6) - Between sections
- **Section spacing**: 32px+ (spacing-8+) - Between major sections

### Layout Spacing
- **Container padding**: 16px mobile, 24px tablet, 32px desktop
- **Card padding**: 16px-24px
- **Button padding**: 12px vertical, 24px horizontal
- **Input padding**: 12px vertical, 16px horizontal

---

## Glassmorphism Effects

### Core Glass Properties
```css
/* Standard Glass Container */
.glass-container {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
}
```

### Blur Levels
```css
--glass-blur-light: blur(8px)     /* Subtle blur for light elements */
--glass-blur: blur(16px)          /* Standard blur for containers */
--glass-blur-heavy: blur(24px)    /* Heavy blur for emphasis */
```

### Shadow Depths
```css
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12)           /* Standard */
--glass-shadow-hover: 0 12px 40px 0 rgba(31, 38, 135, 0.20)    /* Hover */
--glass-shadow-elevated: 0 16px 48px 0 rgba(31, 38, 135, 0.25) /* Elevated */
```

### Glass Variants

#### Light Glass
```css
.glass-container-light {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  /* Use for: Subtle overlays, secondary containers */
}
```

#### Dark Glass
```css
.glass-container-dark {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  /* Use for: Primary containers, modals, important cards */
}
```

### Browser Fallbacks
For browsers without backdrop-filter support:
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-container {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(200, 200, 200, 0.4);
  }
}
```

### Usage Guidelines
- **Cards**: Standard glass with 24px border-radius
- **Modals**: Dark glass with elevated shadow
- **Buttons**: Light glass with gradient overlay
- **Inputs**: Light glass with focus glow
- **Navigation**: Standard glass with sticky positioning

---

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #B3E5FC 0%, #D4E9F7 50%, #FFE0B2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.btn-primary:hover {
  transform: scale(1.03) translateZ(0);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.20);
}

.btn-primary:active {
  transform: scale(0.98) translateZ(0);
}
```

#### Secondary Button (Glass)
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  color: #355C7D;
  border: 1px solid rgba(255, 255, 255, 0.35);
  /* Use for: Secondary actions, cancel buttons */
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #355C7D;
  /* Use for: Tertiary actions, subtle interactions */
}
```

### Input Fields

#### Glass Input
```css
.glass-input {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 16px;
  padding: 12px 16px;
  min-height: 44px; /* Touch-friendly */
  transition: all 0.25s ease;
}

.glass-input:focus {
  border-color: #B3E5FC;
  box-shadow: 0 0 0 3px rgba(179, 229, 252, 0.2);
  outline: none;
}

.glass-input.error {
  border-color: #FFAB91;
}
```

### Cards

#### Standard Card
```css
.card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: scale(1.03) translateZ(0);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.20);
}
```

### Modals

#### Modal Container
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1040;
}

.modal-content {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  max-width: 600px;
  padding: 32px;
  box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.25);
}
```

### Navigation

#### Top Navigation Bar
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding: 16px 24px;
  z-index: 1020;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.08);
}
```

#### Sidebar
```css
.sidebar {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.35);
  width: 300px;
  height: 100vh;
  padding: 24px;
  transition: transform 0.4s ease;
}
```

---

## Layout Patterns

### Page Structure
```
┌─────────────────────────────────────────┐
│         Navigation Bar (Fixed)          │
├──────────┬──────────────────┬───────────┤
│          │                  │           │
│ Sidebar  │   Main Content   │  Right    │
│ (300px)  │   (Flexible)     │  Panel    │
│          │                  │  (280px)  │
│          │                  │           │
└──────────┴──────────────────┴───────────┘
```

###
### Grid S
ystem

#### Responsive Grid
```css
.responsive-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;                    /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);       /* Tablet: 2 columns */
  }
}

@media (min-width: 1280px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);       /* Desktop: 3 columns */
  }
}
```

### Container Widths
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;                               /* Mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px;                             /* Tablet */
  }
}

@media (min-width: 1200px) {
  .container {
    padding: 0 32px;                             /* Desktop */
  }
}
```

### Layout Utilities
```css
/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Gap utilities */
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }

/* Centering utilities */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Animation System

### Animation Durations
```css
--duration-fast: 0.25s      /* Quick interactions (hover, click) */
--duration-medium: 0.4s     /* Standard transitions (page elements) */
--duration-slow: 0.6s       /* Page transitions, modals */
--duration-slower: 1s       /* Complex animations */
```

### Easing Functions
```css
--easing: cubic-bezier(0.4, 0, 0.2, 1)           /* Standard easing */
--easing-in: cubic-bezier(0.4, 0, 1, 1)          /* Deceleration */
--easing-out: cubic-bezier(0, 0, 0.2, 1)         /* Acceleration */
--easing-in-out: cubic-bezier(0.4, 0, 0.2, 1)    /* Smooth in-out */
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* Spring effect */
```

### Animation Patterns

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.4s ease;
}
```

#### Slide In
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.4s ease;
}
```

#### Scale In (Modals)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in-modal {
  animation: scaleIn 0.3s ease;
}
```

#### Hover Animations
```css
/* Card hover */
.hover-scale-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}

.hover-scale-card:hover {
  transform: scale(1.03) translateZ(0);
}

/* Button press */
.interactive-button {
  transition: transform 0.25s ease;
}

.interactive-button:hover {
  transform: scale(1.03) translateZ(0);
}

.interactive-button:active {
  transform: scale(0.98) translateZ(0);
}
```

### Animation Guidelines
- **Hover effects**: 0.25s duration, scale 1.03x
- **Click effects**: 0.25s duration, scale 0.98x
- **Page transitions**: 0.4-0.6s duration
- **Modal animations**: 0.3s scale-in
- **Always use GPU acceleration**: Add `translateZ(0)`
- **Respect reduced motion**: Disable animations for users who prefer reduced motion

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base styles: 0-767px (Mobile) */

/* Tablet: 768px - 1199px */
@media (min-width: 768px) { }

/* Desktop: 1200px+ */
@media (min-width: 1200px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

### Responsive Patterns

#### Sidebar Behavior
```css
/* Mobile: Hidden by default, slide in when active */
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    transform: translateX(100%);
    transition: transform 0.4s ease;
  }
  
  .sidebar.active {
    transform: translateX(0);
  }
}

/* Tablet & Desktop: Always visible */
@media (min-width: 768px) {
  .sidebar {
    position: relative;
    width: 300px;
  }
}
```

#### Modal Behavior
```css
/* Mobile: Full-screen */
@media (max-width: 767px) {
  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

/* Tablet & Desktop: Centered */
@media (min-width: 768px) {
  .modal-content {
    max-width: 600px;
    border-radius: 24px;
  }
}
```

#### Typography Scaling
```css
/* Mobile */
.heading-1 { font-size: 1.875rem; }  /* 30px */

/* Tablet */
@media (min-width: 768px) {
  .heading-1 { font-size: 2rem; }    /* 32px */
}

/* Desktop */
@media (min-width: 1200px) {
  .heading-1 { font-size: 2.25rem; } /* 36px */
}
```

### Touch Interactions
```css
/* Touch-friendly minimum sizes */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Touch feedback */
.touch-feedback:active::after {
  content: '';
  position: absolute;
  background: rgba(179, 229, 252, 0.4);
  border-radius: 50%;
  animation: ripple 0.6s ease-out;
}
```

---

## Accessibility

### Focus Indicators
```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid #B3E5FC;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(179, 229, 252, 0.2);
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Reader Support
```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Make visible on focus */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Skip Links
```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 16px 24px;
  background: #355C7D;
  color: white;
  border-radius: 0 0 16px 0;
}

.skip-link:focus {
  left: 0;
}
```

### ARIA Live Regions
```html
<!-- Status messages -->
<div role="status" aria-live="polite" class="sr-only">
  Changes saved successfully
</div>

<!-- Error messages -->
<div role="alert" aria-live="assertive" class="sr-only">
  Error: Please fill in all required fields
</div>
```

### Keyboard Navigation
- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow keys**: Navigate within menus and lists

### Color Contrast
- **Body text**: 4.5:1 minimum (WCAG AA)
- **Large text**: 3:1 minimum
- **Interactive elements**: 3:1 minimum
- **Navy (#355C7D) on white**: 7.8:1 ✅
- **Sky Blue (#B3E5FC) on white**: 1.8:1 ⚠️ (Use for backgrounds only)

---

## Performance Optimization

### CSS Performance

#### CSS Containment
```css
/* Isolate component rendering */
.card {
  contain: layout style paint;
}

/* Optimize lists */
.list-item {
  contain: layout style;
}

/* Optimize grids */
.grid-item {
  contain: layout paint;
}
```

#### Content Visibility
```css
/* Lazy render off-screen content */
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
```

#### GPU Acceleration
```css
/* Force GPU acceleration for animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
```

### Bundle Optimization
- **CSS code splitting**: Enabled in Vite config
- **CSS minification**: Enabled for production
- **Tree-shaking**: Remove unused styles
- **Critical CSS**: Extract above-the-fold styles

### Image Optimization
- Use WebP format with fallbacks
- Lazy load images below the fold
- Use responsive images with srcset
- Optimize image sizes (max 1920px width)

### Font Loading
```css
/* Optimize font loading */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}
```

---

## Browser Compatibility

### Supported Browsers
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### Feature Detection
```javascript
// Check backdrop-filter support
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)');

// Check CSS Grid support
const supportsCSSGrid = CSS.supports('display', 'grid');

// Check CSS variables support
const supportsCSSVariables = CSS.supports('--css', 'variables');
```

### Fallbacks

#### Backdrop Filter Fallback
```css
/* Modern browsers */
.glass-container {
  backdrop-filter: blur(16px);
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(1px)) {
  .glass-container {
    background: rgba(255, 255, 255, 0.92);
  }
}
```

#### CSS Grid Fallback
```css
/* Modern browsers */
.grid {
  display: grid;
}

/* Fallback for older browsers */
@supports not (display: grid) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }
}
```

---

## Implementation Guidelines

### File Structure
```
src/
├── styles/
│   ├── glassmorphism.css      # Main design system
│   ├── index.css              # Global styles
│   └── tailwind.css           # Tailwind utilities
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   └── Card/
│       ├── Card.jsx
│       └── Card.module.css
└── utils/
    ├── browserCompatibility.js
    ├── performanceMonitor.js
    └── lazyLoad.js
```

### Component Development Checklist

When creating new components:

- [ ] Apply appropriate glass effect variant
- [ ] Use design system spacing (4px base unit)
- [ ] Use design system colors from CSS variables
- [ ] Add hover and active states
- [ ] Include focus indicators for accessibility
- [ ] Add ARIA labels and roles
- [ ] Test keyboard navigation
- [ ] Ensure touch-friendly sizes (44px minimum)
- [ ] Add responsive behavior
- [ ] Test on multiple browsers
- [ ] Optimize for performance (containment, will-change)
- [ ] Add loading and error states
- [ ] Document component usage

### CSS Class Naming Convention

Use BEM (Block Element Modifier) methodology:

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--elevated { }
.card--compact { }
.card__header--sticky { }
```

### Utility-First Approach

Combine utility classes with custom components:

```jsx
<div className="glass-container p-6 rounded-xl shadow-glass">
  <h2 className="text-2xl font-semibold text-navy mb-4">
    Card Title
  </h2>
  <p className="text-base text-navy">
    Card content goes here
  </p>
</div>
```

---

## Design Tokens Reference

### Quick Reference Table

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sky-blue` | #B3E5FC | Primary actions, links |
| `--color-soft-peach` | #FFE0B2 | Secondary actions |
| `--color-muted-navy` | #355C7D | Text, icons |
| `--glass-blur` | blur(16px) | Standard containers |
| `--glass-blur-light` | blur(8px) | Light overlays |
| `--glass-blur-heavy` | blur(24px) | Modals, emphasis |
| `--radius-lg` | 1rem (16px) | Buttons, inputs |
| `--radius-xl` | 1.5rem (24px) | Cards, containers |
| `--spacing-4` | 1rem (16px) | Standard spacing |
| `--spacing-6` | 1.5rem (24px) | Section spacing |
| `--duration-fast` | 0.25s | Hover, click |
| `--duration-medium` | 0.4s | Transitions |

---

## Common Patterns

### Authentication Page Layout
```jsx
<div className="auth-page">
  <div className="auth-form glass-container-dark">
    <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
    <input className="glass-input mb-4" type="email" />
    <input className="glass-input mb-6" type="password" />
    <button className="btn-primary w-full">Login</button>
  </div>
  <div className="auth-background">
    {/* Animated background */}
  </div>
</div>
```

### Dashboard Grid Layout
```jsx
<div className="dashboard">
  <nav className="navbar">
    {/* Navigation content */}
  </nav>
  
  <aside className="sidebar">
    {/* Sidebar content */}
  </aside>
  
  <main className="main-content">
    <div className="responsive-grid">
      {instances.map(instance => (
        <div key={instance.id} className="glass-container hover-scale-card">
          {/* Instance card content */}
        </div>
      ))}
    </div>
  </main>
</div>
```

### Modal Pattern
```jsx
<div className="modal-overlay" onClick={handleClose}>
  <div className="modal-content scale-in-modal" onClick={e => e.stopPropagation()}>
    <button className="modal-close-button" aria-label="Close">×</button>
    <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
    <div className="modal-body">
      {/* Modal content */}
    </div>
    <div className="modal-footer flex justify-end gap-4">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## Testing Guidelines

### Visual Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile (iOS Safari, Chrome Android)
- Test on different screen sizes (320px, 768px, 1280px, 1920px)
- Test with different zoom levels (100%, 125%, 150%)
- Test in light and dark mode (if applicable)

### Accessibility Testing
- Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Test color contrast ratios
- Test with reduced motion enabled
- Test with high contrast mode

### Performance Testing
- Measure FPS during animations (target: 60fps)
- Check bundle size (CSS should be < 100KB gzipped)
- Test on low-end devices
- Monitor memory usage
- Check for layout shifts (CLS)

---

## Resources

### Design Tools
- **Figma**: Design mockups and prototypes
- **ColorBox**: Color palette generation
- **Type Scale**: Typography scale calculator
- **Contrast Checker**: WCAG contrast validation

### Development Tools
- **Chrome DevTools**: Performance profiling
- **Lighthouse**: Accessibility and performance audits
- **axe DevTools**: Accessibility testing
- **React DevTools**: Component debugging

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Tricks](https://css-tricks.com/)
- [Can I Use](https://caniuse.com/)

---

## Changelog

### Version 1.0.0 (Current)
- Initial design system implementation
- Glassmorphism effects with optimized blur values
- Comprehensive color system
- Responsive grid layouts
- Animation system with natural timing
- Accessibility features (focus indicators, screen reader support)
- Performance optimizations (CSS containment, GPU acceleration)
- Cross-browser compatibility with fallbacks

---

**Last Updated**: November 2025  
**Maintained By**: Collab Notes Frontend Team  
**Status**: Production Ready ✅
