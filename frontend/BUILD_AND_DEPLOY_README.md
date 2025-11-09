# Build and Deployment Configuration

This document provides an overview of the build and deployment configuration for the Collab Notes frontend application.

## Quick Links

- **[Environment Configuration Guide](./ENV_CONFIG.md)** - Complete guide to environment variables
- **[Proxy Configuration Guide](./PROXY_CONFIG.md)** - Development proxy setup and troubleshooting
- **[Deployment Guide](./DEPLOYMENT.md)** - Platform-specific deployment instructions

## Overview

The application uses Vite as the build tool with optimized configurations for different environments:

- **Development:** Fast builds with source maps and debug info
- **Staging:** Production-like builds for testing
- **Production:** Fully optimized builds with minification and tree-shaking

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs on `http://localhost:5173` with hot module replacement.

### Building

```bash
# Development build (with source maps)
npm run build:dev

# Staging build
npm run build:staging

# Production build (optimized)
npm run build:prod

# Preview production build locally
npm run preview
```

### Analyzing Bundle Size

```bash
npm run analyze
```

## Build Configuration

### Vite Configuration

The `vite.config.js` file includes:

1. **Manual Code Splitting:**
   - Vendor chunks for React, Zustand, Socket.io, Fabric.js, Axios
   - Component chunks by feature (Dashboard, Instance, Notes, Friends, Auth)
   - Page-level chunks for route-based code splitting
   - Store and API modules in separate chunks

2. **Production Optimizations:**
   - Terser minification with console.log removal in production
   - Tree-shaking enabled
   - Optimized chunk naming for better caching
   - Source maps disabled in production

3. **Development Features:**
   - Proxy configuration for API and WebSocket
   - Fast refresh for React components
   - Source maps for debugging

### Build Scripts

| Script | Purpose | Environment |
|--------|---------|-------------|
| `npm run dev` | Start dev server | development |
| `npm run build` | Default build | production |
| `npm run build:dev` | Build with debug info | development |
| `npm run build:staging` | Build for staging | staging |
| `npm run build:prod` | Optimized production build | production |
| `npm run preview` | Preview production build | - |
| `npm run analyze` | Analyze bundle size | - |

## Environment Variables

### Required Variables

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_ENV=development
```

### Optional Variables

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_WHITEBOARD=true
VITE_ENABLE_OAUTH=true
VITE_DEBUG=false
```

See [ENV_CONFIG.md](./ENV_CONFIG.md) for complete documentation.

## Proxy Configuration

During development, the Vite dev server proxies requests to avoid CORS issues:

- `/api/*` → Backend API
- `/socket.io/*` → WebSocket server
- `/auth/google` → Google OAuth callback
- `/auth/microsoft` → Microsoft OAuth callback

See [PROXY_CONFIG.md](./PROXY_CONFIG.md) for detailed configuration.

## Deployment

### Supported Platforms

- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ AWS S3 + CloudFront
- ✅ Docker
- ✅ Traditional hosting (Apache/Nginx)

### Quick Deploy

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
npm run build:prod
netlify deploy --prod --dir=dist
```

**Docker:**
```bash
docker build -t collabnotes-frontend .
docker run -d -p 80:80 collabnotes-frontend
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Build Output

After building, the `dist/` directory contains:

```
dist/
├── index.html                          # Entry point
├── assets/
│   ├── index-[hash].css               # Styles
│   ├── index-[hash].js                # Main entry
│   ├── vendor-react-[hash].js         # React libraries
│   ├── vendor-socket-[hash].js        # Socket.io
│   ├── vendor-whiteboard-[hash].js    # Fabric.js
│   ├── vendor-http-[hash].js          # Axios
│   ├── vendor-state-[hash].js         # Zustand
│   ├── vendor-misc-[hash].js          # Other dependencies
│   ├── components-*-[hash].js         # Component chunks
│   ├── page-*-[hash].js               # Page chunks
│   ├── store-[hash].js                # State management
│   └── api-[hash].js                  # API layer
└── [other static assets]
```

## Performance Optimizations

### Implemented

- ✅ Code splitting by route and feature
- ✅ Vendor chunk separation
- ✅ Tree-shaking
- ✅ Minification with Terser
- ✅ Asset optimization
- ✅ Lazy loading for heavy components
- ✅ Optimized chunk naming for caching

### Recommended

- 🔄 Enable gzip/brotli compression on server
- 🔄 Use CDN for static assets
- 🔄 Implement service worker for offline support
- 🔄 Add bundle size monitoring to CI/CD

## Troubleshooting

### Build Issues

**Problem:** Build fails with module errors

**Solution:**
```bash
rm -rf node_modules dist
npm install
npm run build:prod
```

**Problem:** Environment variables not working

**Solution:**
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- Check that `.env` file exists

### Deployment Issues

**Problem:** 404 on routes after deployment

**Solution:**
- Configure server for SPA routing
- See platform-specific configuration in DEPLOYMENT.md

**Problem:** API requests fail in production

**Solution:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on backend
- Ensure backend is accessible

## File Structure

```
frontend/
├── .env                        # Local environment variables (gitignored)
├── .env.example               # Environment template
├── .env.development           # Development defaults
├── .env.staging               # Staging configuration
├── .env.production            # Production configuration
├── vite.config.js             # Vite build configuration
├── package.json               # Dependencies and scripts
├── BUILD_AND_DEPLOY_README.md # This file
├── ENV_CONFIG.md              # Environment variables guide
├── PROXY_CONFIG.md            # Proxy configuration guide
├── DEPLOYMENT.md              # Deployment instructions
└── src/                       # Application source code
```

## Best Practices

1. **Always test builds locally** before deploying:
   ```bash
   npm run build:prod
   npm run preview
   ```

2. **Use environment-specific builds:**
   - Development: `npm run build:dev`
   - Staging: `npm run build:staging`
   - Production: `npm run build:prod`

3. **Keep environment files secure:**
   - Never commit `.env` with real credentials
   - Use platform-specific environment variable management
   - Rotate OAuth credentials regularly

4. **Monitor bundle size:**
   ```bash
   npm run analyze
   ```

5. **Test in staging before production:**
   - Deploy to staging first
   - Test all features
   - Verify API connectivity
   - Check OAuth flows

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
      - run: npm run preview # Test build
```

## Support

For issues or questions:

1. Check the relevant guide:
   - Environment issues → [ENV_CONFIG.md](./ENV_CONFIG.md)
   - Proxy issues → [PROXY_CONFIG.md](./PROXY_CONFIG.md)
   - Deployment issues → [DEPLOYMENT.md](./DEPLOYMENT.md)

2. Review Vite documentation:
   - [Vite Build Guide](https://vitejs.dev/guide/build.html)
   - [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

3. Check application logs and browser console

## Version History

- **v1.0.0** - Initial build and deployment configuration
  - Vite build optimization
  - Environment variable management
  - Development proxy setup
  - Multi-platform deployment support
