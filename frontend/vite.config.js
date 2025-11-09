import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    strictPort: false, // Try next port if 5173 is busy
    proxy: {
      // API endpoints proxy
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (process.env.VITE_DEBUG === 'true') {
              console.log('Proxying:', req.method, req.url, '→', options.target + req.url);
            }
          });
        },
      },
      // WebSocket proxy for Socket.io
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL || 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('WebSocket proxy error:', err);
          });
          proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
            if (process.env.VITE_DEBUG === 'true') {
              console.log('WebSocket proxying:', req.url);
            }
          });
        },
      },
      // Google OAuth callback proxy
      '/auth/google': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Microsoft OAuth callback proxy
      '/auth/microsoft': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_ENV === 'production' ? false : true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_ENV === 'production',
        drop_debugger: true,
      },
    },
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for core libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            if (id.includes('socket.io-client')) {
              return 'vendor-socket';
            }
            if (id.includes('fabric')) {
              return 'vendor-whiteboard';
            }
            if (id.includes('axios')) {
              return 'vendor-http';
            }
            // Other node_modules go into vendor-misc
            return 'vendor-misc';
          }
          
          // Split pages into separate chunks
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0];
            return `page-${pageName.toLowerCase()}`;
          }
          
          // Split components by feature
          if (id.includes('/src/components/Dashboard/')) {
            return 'components-dashboard';
          }
          if (id.includes('/src/components/Instance/')) {
            return 'components-instance';
          }
          if (id.includes('/src/components/Notes/')) {
            return 'components-notes';
          }
          if (id.includes('/src/components/Friends/')) {
            return 'components-friends';
          }
          if (id.includes('/src/components/Auth/')) {
            return 'components-auth';
          }
          
          // Store modules
          if (id.includes('/src/store/')) {
            return 'store';
          }
          
          // API modules
          if (id.includes('/src/api/')) {
            return 'api';
          }
        },
        // Optimize chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable tree-shaking
    target: 'esnext',
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'axios', 'socket.io-client'],
    exclude: ['fabric'],
  },
});
