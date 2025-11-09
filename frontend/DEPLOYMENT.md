# Deployment Guide

This guide covers deploying the Collab Notes frontend application to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [Docker](#docker)
  - [Traditional Hosting](#traditional-hosting)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. ✅ Node.js 18+ installed
2. ✅ npm or yarn package manager
3. ✅ Backend API deployed and accessible
4. ✅ OAuth credentials configured (if using OAuth)
5. ✅ Environment variables prepared for production

## Build Process

### Development Build

For testing with source maps and debug info:

```bash
npm run build:dev
```

### Staging Build

For staging environment:

```bash
npm run build:staging
```

### Production Build

For production deployment (optimized, minified):

```bash
npm run build:prod
```

The build output will be in the `dist/` directory.

### Build Verification

After building, verify the output:

```bash
# Check build size
du -sh dist/

# Preview the build locally
npm run preview
```

## Deployment Platforms

### Vercel

Vercel provides zero-configuration deployment for Vite applications.

#### Quick Deploy

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

#### GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `dist`
6. Add environment variables in project settings
7. Deploy

#### Environment Variables

Add in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_BASE_URL=https://api.collabnotes.com
VITE_SOCKET_URL=wss://socket.collabnotes.com
VITE_ENV=production
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

### Netlify

Netlify offers similar zero-config deployment.

#### Quick Deploy

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build:prod
   netlify deploy --prod --dir=dist
   ```

#### GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build Command:** `npm run build:prod`
   - **Publish Directory:** `dist`
6. Add environment variables in Site Settings → Build & Deploy → Environment
7. Deploy

#### Redirects for SPA

Create `public/_redirects` file:

```
/*    /index.html   200
```

This ensures client-side routing works correctly.

#### Environment Variables

Add in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_API_BASE_URL=https://api.collabnotes.com
VITE_SOCKET_URL=wss://socket.collabnotes.com
VITE_ENV=production
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

### AWS S3 + CloudFront

For AWS deployment with CDN.

#### Step 1: Build

```bash
npm run build:prod
```

#### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://collabnotes-frontend
```

#### Step 3: Configure Bucket for Static Hosting

```bash
aws s3 website s3://collabnotes-frontend \
  --index-document index.html \
  --error-document index.html
```

#### Step 4: Upload Build

```bash
aws s3 sync dist/ s3://collabnotes-frontend \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html separately with no-cache
aws s3 cp dist/index.html s3://collabnotes-frontend/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

#### Step 5: Create CloudFront Distribution

1. Go to CloudFront console
2. Create distribution
3. Set origin to S3 bucket
4. Configure custom error responses:
   - 403 → /index.html (200)
   - 404 → /index.html (200)
5. Add custom domain and SSL certificate
6. Deploy

#### Automated Deployment Script

Create `deploy-aws.sh`:

```bash
#!/bin/bash
set -e

echo "Building application..."
npm run build:prod

echo "Uploading to S3..."
aws s3 sync dist/ s3://collabnotes-frontend \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://collabnotes-frontend/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### Docker

Containerize the application for deployment.

#### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
ARG VITE_ENV=production
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_MICROSOFT_CLIENT_ID

RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t collabnotes-frontend \
  --build-arg VITE_API_BASE_URL=https://api.collabnotes.com \
  --build-arg VITE_SOCKET_URL=wss://socket.collabnotes.com \
  --build-arg VITE_ENV=production \
  .

# Run container
docker run -d -p 80:80 collabnotes-frontend
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
        VITE_SOCKET_URL: ${VITE_SOCKET_URL}
        VITE_ENV: production
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Deploy:

```bash
docker-compose up -d
```

### Traditional Hosting

For shared hosting or VPS.

#### Step 1: Build

```bash
npm run build:prod
```

#### Step 2: Upload

Upload the `dist/` folder contents to your web server:

```bash
# Using SCP
scp -r dist/* user@server:/var/www/html/

# Using FTP
# Use your FTP client to upload dist/ contents
```

#### Step 3: Configure Web Server

**Apache (.htaccess):**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# Don't cache HTML
<FilesMatch "\.html$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

**Nginx:**

```nginx
server {
    listen 80;
    server_name collabnotes.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Configuration

### Production Checklist

Before deploying to production:

- [ ] Set `VITE_ENV=production`
- [ ] Configure production API URLs
- [ ] Add OAuth credentials for production
- [ ] Enable performance monitoring
- [ ] Disable debug mode
- [ ] Test all features in staging first
- [ ] Verify SSL certificates
- [ ] Configure CDN if applicable
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)

### Environment Variables by Platform

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| VITE_ENV | development | staging | production |
| VITE_API_BASE_URL | localhost:3000 | api-staging.com | api.com |
| VITE_SOCKET_URL | localhost:3000 | socket-staging.com | socket.com |
| VITE_DEBUG | true | false | false |

## Post-Deployment

### Verification Steps

1. **Check deployment:**
   ```bash
   curl -I https://collabnotes.com
   ```

2. **Test API connectivity:**
   - Open browser DevTools
   - Navigate to the app
   - Check Network tab for API calls

3. **Test WebSocket:**
   - Open a note
   - Check for WebSocket connection in Network tab
   - Verify real-time updates work

4. **Test OAuth:**
   - Try Google login
   - Try Microsoft login
   - Verify redirects work correctly

5. **Test routing:**
   - Navigate to different pages
   - Refresh on a deep route
   - Verify no 404 errors

### Monitoring

Set up monitoring for:

- **Uptime:** Use UptimeRobot or Pingdom
- **Performance:** Use Lighthouse CI or WebPageTest
- **Errors:** Use Sentry or similar
- **Analytics:** Use Google Analytics or Plausible

### SSL Certificate

Ensure HTTPS is enabled:

- **Vercel/Netlify:** Automatic
- **AWS CloudFront:** Configure ACM certificate
- **Traditional hosting:** Use Let's Encrypt

```bash
# Let's Encrypt with Certbot
sudo certbot --nginx -d collabnotes.com
```

## Troubleshooting

### Build Fails

**Problem:** Build command fails with errors.

**Solutions:**
- Check Node.js version (18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript/ESLint errors
- Verify all environment variables are set

### 404 on Routes

**Problem:** Direct navigation to routes returns 404.

**Solutions:**
- Configure server for SPA routing (see platform-specific configs)
- Ensure `index.html` is served for all routes
- Check `.htaccess` or nginx config

### API Requests Fail

**Problem:** API requests fail in production.

**Solutions:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on backend
- Ensure backend is accessible from frontend domain
- Check SSL certificate validity

### WebSocket Connection Fails

**Problem:** Real-time features don't work.

**Solutions:**
- Verify `VITE_SOCKET_URL` is correct
- Check WebSocket support on hosting platform
- Ensure backend WebSocket server is running
- Try using secure WebSocket (wss://)

### OAuth Redirect Issues

**Problem:** OAuth login fails or redirects incorrectly.

**Solutions:**
- Update OAuth redirect URIs in provider console
- Verify OAuth client IDs are correct for environment
- Check that OAuth routes are accessible
- Ensure HTTPS is enabled (required by OAuth providers)

### Large Bundle Size

**Problem:** Initial load is slow due to large bundle.

**Solutions:**
- Analyze bundle: `npm run analyze`
- Implement code splitting for large components
- Lazy load routes
- Optimize images and assets
- Enable compression (gzip/brotli)

## Rollback Procedure

If deployment fails:

### Vercel/Netlify
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### AWS S3
1. Restore previous version from S3 versioning
2. Invalidate CloudFront cache

### Docker
```bash
# Rollback to previous image
docker pull collabnotes-frontend:previous
docker-compose up -d
```

## CI/CD Pipeline

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
          VITE_ENV: production
        run: npm run build:prod
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Test in staging environment first
- Contact platform support if needed
