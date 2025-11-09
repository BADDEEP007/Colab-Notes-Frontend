# Collab Notes Frontend - Project Structure

## Overview

This is a React-based single-page application built with Vite, featuring real-time collaboration capabilities.

## Technology Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Whiteboard**: Fabric.js
- **Code Quality**: ESLint + Prettier

## Folder Structure

```
src/
├── api/                    # API layer and HTTP client configuration
│   ├── axiosInstance.js   # Configured Axios instance with interceptors
│   └── index.js           # Central export for API modules
│
├── components/            # Reusable React components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── Chatbot.jsx
│
├── pages/                 # Page-level components
│   └── index.js          # Central export for pages
│
├── store/                 # Zustand state management stores
│   └── index.js          # Central export for stores
│
├── utils/                 # Utility functions and constants
│   ├── constants.js      # Application-wide constants
│   ├── helpers.js        # Helper functions
│   └── index.js          # Central export for utilities
│
├── lib/                   # Third-party library utilities
│   └── utils.js          # Tailwind CSS class merger (cn function)
│
├── assets/               # Static assets (images, icons, etc.)
│
├── App.jsx               # Root application component
├── main.jsx              # Application entry point
└── index.css             # Global styles with Tailwind directives

```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_ENV=development
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Code Style

- **ESLint**: Configured with React best practices
- **Prettier**: Enforces consistent code formatting
- **Tailwind CSS**: Utility-first CSS framework

## Path Aliases

The project uses `@` as an alias for the `src` directory:

```javascript
import { cn } from '@/lib/utils';
import { API_PATHS } from '@/utils/constants';
```

## API Layer

All API calls go through the configured Axios instance which:
- Adds authentication tokens automatically
- Handles token refresh on 401 errors
- Provides consistent error handling

## State Management

Zustand stores will be created for:
- Authentication state
- Instance management
- Note management
- Friend management
- Socket connection state

## Next Steps

1. Implement authentication pages (Login, Signup)
2. Create API modules (authApi, notesApi, etc.)
3. Build Zustand stores
4. Implement WebSocket integration
5. Create page components and routing
