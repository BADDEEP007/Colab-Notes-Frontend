# Proxy Configuration Guide

This document explains the development proxy configuration for the Collab Notes frontend application.

## Overview

During development, the Vite dev server proxies API and WebSocket requests to the backend server. This avoids CORS issues and simulates the production environment where the frontend and backend are served from the same domain.

## Proxy Routes

### API Endpoints (`/api/*`)

All HTTP requests to `/api/*` are proxied to the backend server.

**Configuration:**
```javascript
'/api': {
  target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  changeOrigin: true,
  secure: false,
}
```

**Example:**
- Frontend request: `http://localhost:5173/api/auth/login`
- Proxied to: `http://localhost:3000/api/auth/login`

**Supported endpoints:**
- `/api/auth/*` - Authentication endpoints
- `/api/notes/*` - Notes CRUD operations
- `/api/ai/*` - AI features
- `/api/sendmail/*` - Email services
- All other `/api/*` routes

### WebSocket (`/socket.io/*`)

WebSocket connections for real-time collaboration are proxied with WebSocket upgrade support.

**Configuration:**
```javascript
'/socket.io': {
  target: process.env.VITE_SOCKET_URL || 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  secure: false,
}
```

**Example:**
- Frontend connection: `ws://localhost:5173/socket.io/?EIO=4&transport=websocket`
- Proxied to: `ws://localhost:3000/socket.io/?EIO=4&transport=websocket`

### OAuth Callbacks

OAuth authentication callbacks are proxied to handle redirects properly.

**Google OAuth:**
```javascript
'/auth/google': {
  target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  changeOrigin: true,
  secure: false,
}
```

**Microsoft OAuth:**
```javascript
'/auth/microsoft': {
  target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  changeOrigin: true,
  secure: false,
}
```

## Configuration Options

### `target`
The backend server URL. Defaults to `http://localhost:3000` but can be overridden with environment variables.

### `changeOrigin`
Changes the origin of the host header to the target URL. Required for virtual hosted sites.

### `secure`
Set to `false` to accept self-signed SSL certificates in development.

### `ws`
Enables WebSocket proxying. Required for Socket.io connections.

### `rewrite`
Function to rewrite the request path. Currently passes through unchanged.

### `configure`
Allows custom proxy event handlers for logging and error handling.

## Environment Variables

Control proxy behavior with environment variables:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# WebSocket server URL
VITE_SOCKET_URL=http://localhost:3000

# Enable debug logging
VITE_DEBUG=true
```

## Debug Mode

Enable debug logging to see all proxied requests:

```bash
# In .env
VITE_DEBUG=true
```

This will log:
- HTTP requests: `Proxying: GET /api/auth/me → http://localhost:3000/api/auth/me`
- WebSocket connections: `WebSocket proxying: /socket.io/?EIO=4&transport=websocket`

## Common Issues

### CORS Errors

**Problem:** Getting CORS errors even with proxy configured.

**Solution:**
1. Ensure the backend server is running on the correct port
2. Check that `changeOrigin: true` is set in proxy config
3. Verify the backend has CORS middleware configured
4. Restart the Vite dev server after changing proxy config

### WebSocket Connection Failed

**Problem:** WebSocket connections fail or disconnect immediately.

**Solution:**
1. Verify `ws: true` is set for `/socket.io` proxy
2. Check that the backend WebSocket server is running
3. Ensure no firewall is blocking WebSocket connections
4. Try using polling transport as fallback:
   ```javascript
   const socket = io({ transports: ['polling', 'websocket'] });
   ```

### 404 on API Requests

**Problem:** API requests return 404 errors.

**Solution:**
1. Check that the backend route exists and is registered
2. Verify the request path matches the proxy pattern
3. Ensure the backend server is running
4. Check backend logs for routing errors

### OAuth Redirect Issues

**Problem:** OAuth callbacks fail or redirect to wrong URL.

**Solution:**
1. Verify OAuth callback URLs in provider console match development URL
2. Check that `/auth/google` and `/auth/microsoft` proxies are configured
3. Ensure the backend OAuth routes are properly set up
4. Use `http://localhost:5173` (not `127.0.0.1`) for consistency

## Backend Server Requirements

For the proxy to work correctly, ensure your backend:

1. **Runs on the configured port** (default: 3000)
2. **Has CORS middleware** configured to accept requests from `http://localhost:5173`
3. **Supports WebSocket** connections for Socket.io
4. **Handles OAuth callbacks** at `/auth/google` and `/auth/microsoft`

Example backend CORS configuration:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

## Production Considerations

⚠️ **Important:** The proxy configuration only applies to development.

In production:
- Frontend and backend should be served from the same domain, OR
- Backend must have proper CORS headers configured, OR
- Use a reverse proxy (nginx, Apache) to route requests

Example nginx configuration:
```nginx
server {
  listen 80;
  server_name collabnotes.com;

  # Frontend
  location / {
    root /var/www/frontend/dist;
    try_files $uri $uri/ /index.html;
  }

  # API proxy
  location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # WebSocket proxy
  location /socket.io/ {
    proxy_pass http://backend:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

## Testing the Proxy

### Test API Proxy

```bash
# Start backend server
cd backend && npm start

# Start frontend dev server
cd frontend && npm run dev

# Test API endpoint
curl http://localhost:5173/api/health
```

### Test WebSocket Proxy

```javascript
// In browser console
const socket = io('http://localhost:5173');
socket.on('connect', () => console.log('Connected!'));
```

### Test with Debug Logging

```bash
# Enable debug mode
echo "VITE_DEBUG=true" >> .env

# Restart dev server
npm run dev

# Make requests and check console for proxy logs
```

## Advanced Configuration

### Custom Proxy Middleware

Add custom logic to proxy requests:

```javascript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true,
  configure: (proxy, options) => {
    proxy.on('proxyReq', (proxyReq, req, res) => {
      // Add custom headers
      proxyReq.setHeader('X-Dev-Proxy', 'true');
      
      // Log request details
      console.log('Proxying:', req.method, req.url);
    });
    
    proxy.on('proxyRes', (proxyRes, req, res) => {
      // Log response details
      console.log('Response:', proxyRes.statusCode, req.url);
    });
  },
}
```

### Multiple Backend Services

Proxy to different backend services:

```javascript
proxy: {
  '/api/auth': {
    target: 'http://localhost:3001', // Auth service
  },
  '/api/notes': {
    target: 'http://localhost:3002', // Notes service
  },
  '/api/ai': {
    target: 'http://localhost:3003', // AI service
  },
}
```

## Troubleshooting Checklist

- [ ] Backend server is running
- [ ] Backend is on the correct port (check VITE_API_BASE_URL)
- [ ] Vite dev server is running
- [ ] No firewall blocking connections
- [ ] CORS is configured on backend
- [ ] Proxy paths match backend routes
- [ ] WebSocket support enabled for Socket.io
- [ ] OAuth redirect URIs configured correctly
- [ ] Environment variables are set
- [ ] Dev server restarted after config changes

## Support

For issues with proxy configuration:
1. Check Vite logs for proxy errors
2. Check backend logs for request handling
3. Use browser DevTools Network tab to inspect requests
4. Enable debug mode for detailed logging
5. Refer to [Vite Proxy Documentation](https://vitejs.dev/config/server-options.html#server-proxy)
