# Environment Configuration Guide

This document explains how to configure environment variables for the Collab Notes frontend application across different environments.

## Overview

The application uses Vite's environment variable system with the `VITE_` prefix. Variables are loaded based on the current mode (development, staging, production).

## Environment Files

- `.env` - Local overrides (gitignored, create from .env.example)
- `.env.example` - Template with all available variables and documentation
- `.env.development` - Development environment defaults
- `.env.staging` - Staging environment configuration
- `.env.production` - Production environment configuration

## Setup Instructions

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your local configuration:
   - Set OAuth client IDs if testing OAuth features
   - Adjust API URLs if your backend runs on different ports
   - Enable/disable features as needed

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Different Environments

```bash
# Development build (with source maps and debug info)
npm run build:dev

# Staging build
npm run build:staging

# Production build (optimized, minified, no console logs)
npm run build:prod
```

## Required Environment Variables

### API Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_SOCKET_URL` | WebSocket server URL | `http://localhost:3000` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `10000` |

### OAuth Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | If OAuth enabled |
| `VITE_MICROSOFT_CLIENT_ID` | Microsoft OAuth Client ID | If OAuth enabled |

### Application Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENV` | Environment name | `development` |
| `VITE_APP_NAME` | Application display name | `Collab Notes` |
| `VITE_AUTOSAVE_DELAY` | Auto-save debounce (ms) | `500` |
| `VITE_SOCKET_RECONNECT_ATTEMPTS` | WebSocket reconnection attempts | `5` |
| `VITE_SOCKET_RECONNECT_DELAY` | Delay between reconnects (ms) | `3000` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_AI_FEATURES` | Enable AI summarization/assistance | `true` |
| `VITE_ENABLE_WHITEBOARD` | Enable whiteboard features | `true` |
| `VITE_ENABLE_OAUTH` | Enable OAuth login | `true` |

### Optional: Analytics & Monitoring

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | No |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | No |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance tracking | No |

## Accessing Environment Variables

In your code, access variables using `import.meta.env`:

```javascript
// API configuration
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;

// Feature flags
const aiEnabled = import.meta.env.VITE_ENABLE_AI_FEATURES === 'true';

// Environment check
const isDevelopment = import.meta.env.VITE_ENV === 'development';
const isProduction = import.meta.env.VITE_ENV === 'production';
```

## Deployment

### Vercel

Add environment variables in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Redeploy to apply changes

### Netlify

Add environment variables in the Netlify dashboard:
1. Go to Site Settings → Build & Deploy → Environment
2. Add each variable
3. Trigger a new deploy

### Docker

Pass environment variables via docker-compose or Dockerfile:

```yaml
# docker-compose.yml
services:
  frontend:
    build: .
    environment:
      - VITE_API_BASE_URL=https://api.collabnotes.com
      - VITE_SOCKET_URL=wss://socket.collabnotes.com
      - VITE_ENV=production
```

### Traditional Hosting

1. Build with the appropriate environment:
   ```bash
   npm run build:prod
   ```

2. The built files in `dist/` contain the environment variables baked in at build time

3. Upload the `dist/` folder to your hosting provider

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** with real credentials to version control
2. **Client-side variables are public** - Don't store secrets in `VITE_*` variables
3. **OAuth Client IDs are safe** to expose (they're public by design)
4. **API keys and secrets** should only be stored on the backend
5. **Use different OAuth credentials** for each environment

## Troubleshooting

### Variables not updating

1. Restart the dev server after changing `.env` files
2. Clear browser cache and rebuild
3. Check that variable names start with `VITE_`

### Build fails with missing variables

1. Ensure all required variables are set in the environment-specific file
2. Check for typos in variable names
3. Verify the correct mode is being used for the build

### OAuth not working

1. Verify OAuth client IDs are correct for the environment
2. Check that redirect URIs are configured in OAuth provider console
3. Ensure `VITE_ENABLE_OAUTH` is set to `true`

## Best Practices

1. **Use environment-specific files** for default values
2. **Use `.env` for local overrides** only
3. **Document all variables** in `.env.example`
4. **Use feature flags** to enable/disable features per environment
5. **Keep sensitive data on the backend** - never in frontend env vars
6. **Test builds** for each environment before deploying
7. **Use meaningful defaults** that work for most developers

## Support

For questions or issues with environment configuration, please refer to:
- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- Project README.md
- Team documentation
