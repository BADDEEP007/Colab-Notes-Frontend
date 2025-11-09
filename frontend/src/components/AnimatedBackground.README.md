# AnimatedBackground Component

A React component that renders floating orbs with radial gradients that animate smoothly in the background. Fully accessible with support for reduced motion preferences.

## Features

- **Three Variants**: `auth`, `dashboard`, and `minimal` for different page contexts
- **Smooth Animations**: Floating orbs with staggered delays (2s, 4s intervals)
- **Accessibility**: Automatically detects and respects `prefers-reduced-motion` preference
- **Performance Optimized**: GPU-accelerated animations with proper z-index layering
- **Customizable Intensity**: Control animation opacity from 0 to 1

## Usage

### Basic Usage

```jsx
import AnimatedBackground from './components/AnimatedBackground';

function MyPage() {
  return (
    <div>
      <AnimatedBackground variant="auth" />
      {/* Your page content */}
    </div>
  );
}
```

### With Custom Intensity

```jsx
<AnimatedBackground variant="dashboard" intensity={0.7} />
```

## Props

| Prop        | Type                                 | Default  | Description                                         |
| ----------- | ------------------------------------ | -------- | --------------------------------------------------- |
| `variant`   | `'auth' \| 'dashboard' \| 'minimal'` | `'auth'` | Visual variant determining number and style of orbs |
| `intensity` | `number`                             | `1`      | Animation opacity from 0 to 1                       |

## Variants

### Auth Variant

- **Orbs**: 5 floating orbs
- **Colors**: Blue, peach, and coral gradients
- **Use Case**: Login, signup, and authentication pages

### Dashboard Variant

- **Orbs**: 3 floating orbs
- **Colors**: Softer blue, peach, and coral gradients
- **Use Case**: Dashboard and main application pages

### Minimal Variant

- **Orbs**: 2 floating orbs
- **Colors**: Very subtle blue and peach gradients
- **Use Case**: Editor pages and focused work areas

## Accessibility

The component automatically detects the user's motion preferences:

- **Normal Motion**: Full floating animations with smooth transitions
- **Reduced Motion**: Static orbs with increased blur for visual consistency

### Testing Reduced Motion

To test the reduced motion support:

- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **Windows**: Settings → Ease of Access → Display → Show animations (turn off)
- **Linux**: Varies by desktop environment

## Implementation Details

### Animation Timing

- Each orb has a unique animation duration (18s-25s)
- Staggered delays create natural, non-repetitive motion
- Animations use `ease-in-out` easing for smooth transitions

### Performance

- Uses CSS transforms for GPU acceleration
- Positioned with `position: fixed` and `z-index: -1`
- `pointer-events: none` ensures no interaction interference
- `will-change` property for optimized rendering

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires CSS `backdrop-filter` support for optimal visual effect.

## Demo

A demo page is available at `AnimatedBackground.demo.jsx` showing all variants and intensity controls.

## Related Components

- Uses CSS variables from `styles/glassmorphism.css`
- Designed to work with glass container components
- Complements the overall glassmorphism design system
