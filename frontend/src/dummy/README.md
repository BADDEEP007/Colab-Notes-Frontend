# Mock Backend System

This directory contains a complete mock backend implementation that allows the frontend to run fully functional without a real backend server.

## Overview

The mock backend system provides:

- ✅ Complete authentication flow (login, register, logout)
- ✅ Instance management (create, read, update, delete)
- ✅ Container management
- ✅ Note management with auto-save
- ✅ Friend system
- ✅ Online status tracking
- ✅ Notifications
- ✅ AI features (mock responses)
- ✅ Realistic network delays
- ✅ In-memory data persistence during session

## Files

### `dummyData.js`

Contains all the dummy data:

- **Users**: 4 pre-configured users with different roles
- **Instances**: 4 sample instances with various configurations
- **Containers**: 6 containers across different instances
- **Notes**: 5 sample notes with markdown content
- **Friends**: Friend relationships and requests
- **Online Status**: User online/offline states
- **Notifications**: Sample notifications

### `mockBackend.js`

Implements the complete backend API:

- All CRUD operations for each entity
- Authentication logic
- Permission checks
- Data validation
- Realistic delays to simulate network latency

### `mockApiInterceptor.js`

Axios interceptor that:

- Intercepts all API calls
- Routes them to the mock backend
- Returns properly formatted responses
- Handles errors appropriately

## Usage

### Enable Mock Backend

The mock backend is enabled by default. To control it:

```bash
# Enable (default)
VITE_USE_MOCK_BACKEND=true npm run dev

# Disable (use real backend)
VITE_USE_MOCK_BACKEND=false npm run dev
```

### Integration

The mock backend is automatically integrated when you import the axios instance:

```javascript
import axiosInstance from '@/api/axiosInstance';

// This will use mock backend if enabled
const response = await axiosInstance.post('/api/auth/login', {
  email: 'demo@example.com',
  password: 'demo123',
});
```

### Pre-configured Users

You can log in with any of these accounts:

| Email             | Password | Name          | Role                        |
| ----------------- | -------- | ------------- | --------------------------- |
| demo@example.com  | demo123  | Demo User     | Owner of multiple instances |
| john@example.com  | john123  | John Doe      | Collaborator                |
| jane@example.com  | jane123  | Jane Smith    | Collaborator                |
| alice@example.com | alice123 | Alice Johnson | Has pending friend request  |

### Demo Credentials

**Recommended for testing:**

- Email: `demo@example.com`
- Password: `demo123`

This account has:

- 3 instances (owner of 2, editor of 1)
- Multiple containers with notes
- 2 accepted friends
- 1 pending friend request
- Several notifications

## Features

### Authentication

```javascript
// Register new user
await mockBackend.auth.register('new@example.com', 'password123', 'New User');

// Login
await mockBackend.auth.login('demo@example.com', 'demo123');

// Get current user
const user = await mockBackend.auth.getCurrentUser();

// Logout
await mockBackend.auth.logout();
```

### Instances

```javascript
// Get all instances for current user
const instances = await mockBackend.instances.getAll();

// Create new instance
const instance = await mockBackend.instances.create('My New Instance');

// Update instance
await mockBackend.instances.update('instance-1', { name: 'Updated Name' });

// Delete instance (owner only)
await mockBackend.instances.delete('instance-1');
```

### Notes

```javascript
// Get notes for container
const notes = await mockBackend.notes.getByContainer('container-1');

// Create note
const note = await mockBackend.notes.create('container-1', 'My Note', 'Content');

// Update note (auto-save)
await mockBackend.notes.update('note-1', { content: 'Updated content' });

// Delete note
await mockBackend.notes.delete('note-1');
```

### Friends

```javascript
// Get all friends
const friends = await mockBackend.friends.getAll();

// Get friend requests
const requests = await mockBackend.friends.getRequests();

// Send friend request
await mockBackend.friends.sendRequest('friend@example.com');

// Accept request
await mockBackend.friends.acceptRequest('friend-1');

// Remove friend
await mockBackend.friends.remove('user-2');
```

### AI Features

```javascript
// Summarize content
const summary = await mockBackend.ai.summarize('Long content here...');

// Get AI assistance
const assistance = await mockBackend.ai.assist('Help me with...', 'Context');
```

## Data Persistence

### Session-based

Data persists during the browser session:

- Creating new instances, notes, etc. will be available until page refresh
- Changes are stored in memory
- Refresh the page to reset to initial dummy data

### Local Storage

Authentication token is stored in localStorage:

- Survives page refreshes
- Cleared on logout
- Can be manually cleared from browser DevTools

## Network Simulation

The mock backend simulates realistic network delays:

- **Authentication**: 300ms
- **Data fetching**: 300ms
- **Auto-save**: 100ms (faster for better UX)
- **Status updates**: 50ms
- **AI operations**: 1000-1500ms (longer for realism)

## Customization

### Add More Dummy Data

Edit `dummyData.js`:

```javascript
export const dummyUsers = [
  ...dummyUsers,
  {
    id: 'user-5',
    email: 'custom@example.com',
    password: 'custom123',
    name: 'Custom User',
    // ... other fields
  },
];
```

### Modify API Behavior

Edit `mockBackend.js`:

```javascript
// Example: Add custom validation
create: async (name) => {
  if (name.length < 3) {
    throw new Error('Name must be at least 3 characters');
  }
  // ... rest of implementation
};
```

### Change Network Delays

Edit the `delay` function in `mockBackend.js`:

```javascript
// Make it faster
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Make it slower (test loading states)
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Remove delays entirely
const delay = (ms = 0) => Promise.resolve();
```

## Testing

The mock backend is perfect for:

- ✅ Frontend development without backend
- ✅ UI/UX testing
- ✅ Demo presentations
- ✅ E2E tests (already integrated)
- ✅ Offline development
- ✅ Rapid prototyping

## Switching to Real Backend

When the real backend is ready:

1. Set environment variable:

```bash
VITE_USE_MOCK_BACKEND=false
```

2. Configure real API URL in `.env`:

```
VITE_API_BASE_URL=https://api.yourdomain.com
```

3. The application will automatically use the real backend

## Limitations

### What's NOT Mocked

- **WebSocket connections**: Real-time sync requires actual WebSocket server
- **File uploads**: Image/file handling not implemented
- **OAuth flows**: Google/Microsoft login redirects not functional
- **Email sending**: Verification emails not actually sent
- **Database persistence**: Data resets on page refresh

### Workarounds

- **Real-time sync**: Use polling or manual refresh for now
- **File uploads**: Use placeholder images
- **OAuth**: Use email/password login
- **Emails**: Assume emails are sent successfully
- **Persistence**: Use localStorage for critical data if needed

## Troubleshooting

### Mock backend not working

1. Check console for `Mock Backend: ENABLED` message
2. Verify `VITE_USE_MOCK_BACKEND` is not set to `false`
3. Check browser console for API call logs: `[Mock API] GET /api/...`

### Data not persisting

This is expected behavior. Data resets on page refresh. To persist data:

- Use localStorage manually
- Or wait for real backend integration

### Login not working

Make sure you're using one of the pre-configured accounts:

- Email: `demo@example.com`
- Password: `demo123`

Or register a new account (will persist until page refresh).

## Development Tips

### Quick Login

Add this to browser console for instant login:

```javascript
localStorage.setItem('auth-token', 'mock-token-user-1');
location.reload();
```

### Reset Data

Refresh the page or call:

```javascript
mockBackend.reset();
```

### Debug Mode

Enable detailed logging:

```javascript
// In mockBackend.js
const DEBUG = true;

if (DEBUG) {
  console.log('[Mock Backend]', operation, data);
}
```

## Future Enhancements

Planned improvements:

- [ ] IndexedDB for persistent storage
- [ ] Mock WebSocket server
- [ ] File upload simulation
- [ ] More realistic AI responses
- [ ] Import/export data functionality
- [ ] Seed data generator

## Support

For issues with the mock backend:

1. Check this README
2. Review console logs
3. Inspect `mockBackend.js` implementation
4. Test with pre-configured demo account
