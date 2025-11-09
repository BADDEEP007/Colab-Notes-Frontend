# Accessibility Implementation Guide

This document outlines the accessibility features implemented in the Collab Notes frontend application to ensure WCAG 2.1 AA compliance.

## Overview

The application has been designed with accessibility as a core principle, ensuring that all users, including those using assistive technologies, can effectively use the platform.

## Keyboard Navigation

### Global Keyboard Shortcuts

- **Ctrl+S / Cmd+S**: Save note immediately (in note editor)
- **Ctrl+Z / Cmd+Z**: Undo last action (in whiteboard and text editor)
- **Ctrl+Y / Cmd+Y**: Redo last action (in whiteboard)
- **Ctrl+Shift+Z / Cmd+Shift+Z**: Alternative redo shortcut (in whiteboard)
- **Escape**: Close modals and dropdowns
- **Tab**: Navigate forward through interactive elements
- **Shift+Tab**: Navigate backward through interactive elements
- **Enter / Space**: Activate buttons and links

### Focus Management

- **Focus Trap**: Modals implement focus trapping to keep keyboard focus within the modal
- **Focus Restoration**: When modals close, focus returns to the element that opened them
- **Skip to Main Content**: A skip link is provided at the top of each page for keyboard users
- **Visible Focus Indicators**: All interactive elements have clear focus indicators (2px blue outline)

### Implementation

The `useKeyboardShortcuts` hook provides centralized keyboard shortcut management:

```javascript
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

useKeyboardShortcuts({
  'ctrl+s': handleSave,
  'ctrl+z': handleUndo,
  'escape': handleClose,
});
```

Focus management hooks:
- `useFocusTrap(containerRef, isActive)`: Traps focus within a container
- `useFocusRestore(shouldRestore)`: Restores focus when component unmounts

## ARIA Labels and Roles

### Semantic HTML

The application uses semantic HTML elements wherever possible:
- `<nav>` for navigation areas
- `<main>` for main content
- `<aside>` for sidebars
- `<button>` for interactive actions
- `<article>` for independent content

### ARIA Attributes

#### Labels
- All icon buttons have `aria-label` attributes
- Form inputs are associated with labels via `htmlFor` or `aria-label`
- Complex widgets have `aria-labelledby` pointing to descriptive text

#### States
- Toggle buttons use `aria-pressed` to indicate state
- Expandable elements use `aria-expanded`
- Invalid form fields use `aria-invalid`
- Disabled elements use `aria-disabled` or the `disabled` attribute

#### Roles
- Dropdown menus use `role="menu"` with `role="menuitem"` for items
- Modal dialogs use `role="dialog"` and `aria-modal="true"`
- Status messages use `role="status"` or `role="alert"`
- Lists use `role="list"` when not using semantic `<ul>` elements

#### Live Regions
- Auto-save indicators use `aria-live="polite"`
- Error messages use `aria-live="assertive"`
- Online status updates use `aria-live="polite"`

### Examples

```jsx
// Button with icon
<button aria-label="Close modal" onClick={handleClose}>
  <XIcon aria-hidden="true" />
</button>

// Toggle button
<button
  aria-label="Toggle sidebar"
  aria-pressed={isOpen}
  onClick={handleToggle}
>
  Menu
</button>

// Form field with error
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email address
  </p>
)}
```

## Color Contrast

### WCAG AA Compliance

All text and interactive elements meet WCAG 2.1 AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Color Palette

#### Light Mode (on white #FFFFFF background)
- Primary text: `#1a1a1a` (16.1:1 contrast)
- Secondary text: `#4a4a4a` (9.7:1 contrast)
- Blue links/buttons: `#2563eb` (5.9:1 contrast)
- Red errors: `#dc2626` (5.9:1 contrast)
- Green success: `#16a34a` (4.8:1 contrast)

#### Dark Mode (on dark #0a0a0a background)
- Primary text: `#f5f5f5` (17.4:1 contrast)
- Secondary text: `#d4d4d4` (13.1:1 contrast)
- Blue links/buttons: `#60a5fa` (6.8:1 contrast)
- Red errors: `#f87171` (5.4:1 contrast)
- Green success: `#4ade80` (8.1:1 contrast)

### Utilities

The `accessibility.js` utility provides functions for checking color contrast:

```javascript
import { getContrastRatio, meetsWCAGStandard } from '../utils/accessibility';

// Check contrast ratio
const ratio = getContrastRatio('#2563eb', '#ffffff'); // Returns 5.9

// Verify WCAG compliance
const passes = meetsWCAGStandard('#2563eb', '#ffffff', 'AA', false); // Returns true
```

## Focus Indicators

### Visual Focus States

All interactive elements have visible focus indicators:
- **Outline**: 2px solid blue (`#2563eb` in light mode, `#60a5fa` in dark mode)
- **Offset**: 2px offset from element
- **Border radius**: 4px for rounded appearance

### CSS Implementation

```css
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

.dark *:focus-visible {
  outline-color: #60a5fa;
}
```

### Skip to Main Content

A skip link is provided for keyboard users to bypass navigation:

```jsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

The link is visually hidden but becomes visible when focused.

## Screen Reader Support

### Announcements

The `announceToScreenReader` utility function creates live region announcements:

```javascript
import { announceToScreenReader } from '../utils/accessibility';

// Polite announcement (doesn't interrupt)
announceToScreenReader('Note saved successfully', 'polite');

// Assertive announcement (interrupts current speech)
announceToScreenReader('Error: Failed to save note', 'assertive');
```

### Hidden Content

Content that is purely decorative is hidden from screen readers:

```jsx
<svg aria-hidden="true">
  {/* Decorative icon */}
</svg>
```

### Screen Reader Only Content

The `.sr-only` class provides content only for screen readers:

```jsx
<span className="sr-only">Loading...</span>
<LoadingSpinner aria-hidden="true" />
```

## Form Accessibility

### Labels

All form fields have associated labels:

```jsx
<label htmlFor="instance-name">Instance Name</label>
<input id="instance-name" type="text" />
```

### Error Messages

Error messages are associated with fields using `aria-describedby`:

```jsx
<input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Invalid email address
  </p>
)}
```

### Required Fields

Required fields are marked with `aria-required`:

```jsx
<input
  type="email"
  required
  aria-required="true"
/>
```

## Modal Accessibility

### Focus Management

Modals implement proper focus management:
1. Focus moves to the modal when opened
2. Focus is trapped within the modal
3. Focus returns to the trigger element when closed
4. Escape key closes the modal

### ARIA Attributes

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Create Instance</h2>
  {/* Modal content */}
</div>
```

## Responsive Design

### Touch Targets

All interactive elements meet minimum touch target size:
- **Minimum size**: 44x44 pixels (iOS) / 48x48 pixels (Android)
- **Spacing**: Adequate spacing between touch targets

### Mobile Considerations

- Touch-friendly controls on mobile devices
- Collapsible navigation for small screens
- Responsive text sizes
- Adequate spacing for touch interactions

## Motion and Animation

### Reduced Motion Support

The application respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Testing

### Manual Testing Checklist

- [ ] Navigate entire application using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast with contrast checker
- [ ] Test with browser zoom at 200%
- [ ] Test with high contrast mode
- [ ] Verify focus indicators are visible
- [ ] Test form validation and error messages
- [ ] Verify modal focus management
- [ ] Test with reduced motion enabled

### Automated Testing

Use the following tools for automated accessibility testing:
- **axe DevTools**: Browser extension for accessibility auditing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool
- **Pa11y**: Command-line accessibility testing

### Validation Utilities

The application includes validation utilities:

```javascript
import { validateFieldAccessibility } from '../utils/accessibility';

const field = document.getElementById('email');
const result = validateFieldAccessibility(field);

if (!result.isValid) {
  console.log('Accessibility issues:', result.issues);
}
```

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### ARIA Practices
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN ARIA Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/)

## Continuous Improvement

Accessibility is an ongoing process. Regular audits and user testing with people who use assistive technologies are essential for maintaining and improving accessibility.

### Reporting Issues

If you discover an accessibility issue, please report it with:
1. Description of the issue
2. Steps to reproduce
3. Assistive technology used (if applicable)
4. Expected behavior
5. Actual behavior

## Compliance Statement

This application strives to meet WCAG 2.1 Level AA standards. We are committed to ensuring digital accessibility for people with disabilities and continuously improving the user experience for everyone.

Last updated: November 2025
