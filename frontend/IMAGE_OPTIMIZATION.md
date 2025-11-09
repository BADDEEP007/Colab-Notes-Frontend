# Image Optimization Guide

This document provides guidelines for optimizing images and assets in the Collab Notes frontend application.

## Optimization Strategies

### 1. Image Formats

- **WebP**: Use WebP format for all images where possible (70-90% smaller than PNG/JPEG)
- **JPEG**: Use for photographs and complex images
- **PNG**: Use for images requiring transparency
- **SVG**: Use for icons, logos, and simple graphics

### 2. Image Compression

#### Online Tools
- [TinyPNG](https://tinypng.com/) - PNG and JPEG compression
- [Squoosh](https://squoosh.app/) - Advanced image compression with WebP support
- [ImageOptim](https://imageoptim.com/) - Mac app for image optimization

#### Command Line Tools
```bash
# Install imagemagick for batch processing
brew install imagemagick

# Convert to WebP
convert input.jpg -quality 85 output.webp

# Resize and compress
convert input.jpg -resize 800x600 -quality 85 output.jpg

# Batch convert all JPEGs to WebP
for file in *.jpg; do convert "$file" -quality 85 "${file%.jpg}.webp"; done
```

### 3. Responsive Images

Use the `OptimizedImage` component for automatic lazy loading and WebP support:

```jsx
import { OptimizedImage } from '@/components';

<OptimizedImage
  src="/images/photo.jpg"
  alt="Description"
  className="w-full h-auto"
  lazy={true}
  fallback="/images/placeholder.jpg"
/>
```

### 4. Image Sizing Guidelines

- **Avatars**: 128x128px (max 20KB)
- **Thumbnails**: 300x300px (max 50KB)
- **Hero Images**: 1920x1080px (max 200KB)
- **Icons**: Use SVG when possible

### 5. Lazy Loading

The `OptimizedImage` component automatically implements lazy loading using Intersection Observer API. Images load when they're 50px from entering the viewport.

### 6. Asset Organization

```
public/
├── images/
│   ├── avatars/          # User avatars (WebP, 128x128)
│   ├── thumbnails/       # Preview images (WebP, 300x300)
│   ├── backgrounds/      # Background images (WebP, optimized)
│   └── placeholders/     # Fallback images
└── icons/
    └── *.svg             # SVG icons
```

## Implementation Checklist

- [ ] Convert all PNG/JPEG images to WebP format
- [ ] Compress all images to appropriate quality levels
- [ ] Use `OptimizedImage` component for all image rendering
- [ ] Implement lazy loading for images below the fold
- [ ] Add appropriate alt text for accessibility
- [ ] Test image loading on slow connections
- [ ] Verify WebP fallback works in older browsers

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Image Size**: < 500KB per page
- **Image Load Time**: < 200ms per image

## Browser Support

The `OptimizedImage` component includes:
- WebP support detection
- Automatic fallback to original format
- Lazy loading with Intersection Observer
- Loading states and error handling

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate dimensions** - don't load larger images than needed
3. **Implement progressive loading** - show low-quality placeholder first
4. **Cache images** - use appropriate cache headers
5. **Use CDN** - serve images from CDN for better performance
6. **Monitor performance** - track image loading metrics

## Example Usage

### Basic Image
```jsx
<OptimizedImage
  src="/images/photo.jpg"
  alt="Team photo"
  className="rounded-lg"
/>
```

### Avatar with Fallback
```jsx
<OptimizedImage
  src={user.avatar}
  alt={user.name}
  className="w-12 h-12 rounded-full"
  fallback="/images/default-avatar.png"
/>
```

### Eager Loading (Above the Fold)
```jsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  className="w-full"
  lazy={false}
/>
```

## Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [WebP Format Documentation](https://developers.google.com/speed/webp)
- [Lazy Loading Images](https://web.dev/lazy-loading-images/)
