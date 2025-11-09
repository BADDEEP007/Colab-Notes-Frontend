# Dummy Backend Guide

## Quick Start

The application now includes a complete mock backend system that allows you to run and test the entire application without a real backend server!

### 1. Start the Application

```bash
cd Colab-Notes-Frontend/frontend
npm install
npm run dev
```

The application will start at `http://localhost:5173` with the mock backend enabled by default.

### 2. Login with Demo Account

Use these credentials to login:

**Email:** `demo@example.com`  
**Password:** `demo123`

This account comes pre-loaded with:
- ✅ 3 instances (Personal Projects, Team Collaboration, Study Notes)
- ✅ 6 containers with various notes
- ✅ 2 friends (John Doe, Jane Smith)
- ✅ 1 pending friend request (Alice Johnson)
- ✅ Multiple notifications
- ✅ Sample notes with markdown content

### 3. Explore the Application

Once logged in, you can:
- View and create instances
- Create containers and notes
- Edit notes with auto-save
- Manage friends
- View notifications
- Test all UI features

## Available Demo Accounts

| Email | Password | Description |
|-------|----------|-------------|
| demo@example.com | demo123 | Main demo account with full data |
| john@example.com | john123 | Collaborator account |
| jane@example.com | jane123 | Collaborator account |
| alice@example.com | alice123 | Account with pending friend request |

## Features Available

### ✅ Fully Functional
- User registration and login
- Instance management (create, edit, delete)
- Container management
- Note creation and editing
- Auto-save functionality
- Friend system (add, accept, remove)
- Notifications
- Online status indicators
- Search functionality
- AI features (mock responses)
- Responsive design
- All UI components

### ⚠️ Limitations
- **No Real-time Sync**: WebSocket features require actual backend
- **No Persistence**: Data resets on page refresh
- **No OAuth**: Google/Microsoft login buttons present but non-functional
- **No Email**: Verification emails not actually sent
- **No File Uploads**: Image/file handling not implemented

## Configuration

### Enable/Disable Mock Backend

Edit `.env` file:

```bash
# Enable mock backend (default)
VITE_USE_MOCK_BACKEND=true

# Disable mock backend (use real backend)
VITE_USE_MOCK_BACKEND=false
```

### Check Mock Backend Status

Open browser console and look for:
```
Mock Backend: ENABLED
```

All API calls will show:
```
[Mock API] POST /api/auth/login {...}
```

## Testing Scenarios

### Scenario 1: New User Registration

1. Click "Sign Up" on login page
2. Enter new email and password
3. Submit form
4. You'll be logged in with a new account
5. Create your first instance

**Note:** New account data persists until page refresh

### Scenario 2: Instance Management

1. Login with demo account
2. Click "Create Instance" button
3. Enter instance name
4. View instance in dashboard
5. Click instance to open
6. Create containers and notes

### Scenario 3: Collaboration

1. Login with demo account
2. Go to Friends page
3. View existing friends (John, Jane)
4. Accept pending request from Alice
5. Share notes with friends

### Scenario 4: Note Editing

1. Navigate to any note
2. Edit content in the editor
3. Watch auto-save indicator
4. Changes are saved automatically
5. Navigate away and back - changes persist (until page refresh)

### Scenario 5: Search

1. Go to dashboard
2. Use search bar to filter instances
3. Type "Team" to find "Team Collaboration"
4. Search works across all instances

## Development Tips

### Quick Login (Browser Console)

```javascript
// Instant login as demo user
localStorage.setItem('auth_token', 'mock-token-user-1');
location.reload();
```

### View Current User

```javascript
// In browser console
import mockBackend from './src/dummy/mockBackend';
console.log(mockBackend.getCurrentUser());
```

### Reset All Data

```javascript
// Refresh page or
import mockBackend from './src/dummy/mockBackend';
mockBackend.reset();
```

### Add Custom Data

Edit `src/dummy/dummyData.js`:

```javascript
export const dummyInstances = [
  ...dummyInstances,
  {
    id: 'instance-custom',
    name: 'My Custom Instance',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', role: 'Owner', joinedAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
```

## API Endpoints Mocked

All these endpoints are fully functional with the mock backend:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify email

### Instances
- `GET /api/instances` - Get all instances
- `GET /api/instances/:id` - Get instance by ID
- `POST /api/instances` - Create instance
- `PUT /api/instances/:id` - Update instance
- `DELETE /api/instances/:id` - Delete instance

### Containers
- `GET /api/instances/:id/containers` - Get containers
- `POST /api/containers` - Create container
- `PUT /api/containers/:id` - Update container
- `DELETE /api/containers/:id` - Delete container

### Notes
- `GET /api/containers/:id/notes` - Get notes
- `GET /api/notes/get/title/:title` - Get note by title
- `POST /api/notes/add` - Create note
- `PUT /api/notes/update/:title` - Update note
- `DELETE /api/notes/delete` - Delete note

### Friends
- `GET /api/friends` - Get all friends
- `GET /api/friends/requests` - Get friend requests
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/accept/:id` - Accept request
- `POST /api/friends/reject/:id` - Reject request
- `DELETE /api/friends/:id` - Remove friend

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

### AI
- `POST /api/ai/summary` - Summarize content
- `POST /api/ai/assist` - Get AI assistance

## Troubleshooting

### Problem: Login not working

**Solution:**
- Use demo credentials: `demo@example.com` / `demo123`
- Check console for errors
- Verify mock backend is enabled in `.env`

### Problem: Data disappears after refresh

**Solution:**
- This is expected behavior
- Mock backend uses in-memory storage
- Data resets on page refresh
- For persistence, wait for real backend integration

### Problem: OAuth buttons don't work

**Solution:**
- OAuth requires real backend
- Use email/password login instead
- OAuth buttons are present for UI completeness

### Problem: Real-time features not working

**Solution:**
- WebSocket requires real backend
- Use manual refresh for now
- Online status is simulated

### Problem: API calls failing

**Solution:**
- Check console for `[Mock API]` logs
- Verify `VITE_USE_MOCK_BACKEND=true` in `.env`
- Check browser console for errors
- Try refreshing the page

## Switching to Real Backend

When your backend is ready:

### Step 1: Update Environment

```bash
# .env file
VITE_USE_MOCK_BACKEND=false
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SOCKET_URL=wss://your-socket-url.com
```

### Step 2: Restart Development Server

```bash
npm run dev
```

### Step 3: Test Integration

- Login with real credentials
- Verify API calls go to real backend
- Check WebSocket connection
- Test all features

## Performance

The mock backend includes realistic delays:

| Operation | Delay | Reason |
|-----------|-------|--------|
| Login/Register | 300ms | Simulate authentication |
| Data Fetching | 300ms | Simulate network latency |
| Auto-save | 100ms | Fast for better UX |
| Status Updates | 50ms | Near real-time |
| AI Operations | 1000-1500ms | Simulate processing |

These delays make the UI feel realistic and help test loading states.

## Best Practices

### For Development

1. **Use demo account** for consistent testing
2. **Test all user flows** with mock data
3. **Verify loading states** work correctly
4. **Test error scenarios** by modifying mock responses
5. **Check responsive design** on different devices

### For Demos

1. **Login with demo account** for full experience
2. **Show instance creation** and management
3. **Demonstrate note editing** with auto-save
4. **Show friend system** and collaboration
5. **Highlight responsive design** on mobile

### For Testing

1. **Use E2E tests** with mock backend enabled
2. **Test edge cases** by modifying dummy data
3. **Verify error handling** with mock errors
4. **Test performance** with large datasets
5. **Check accessibility** features

## Support

For issues or questions:

1. Check this guide
2. Review `src/dummy/README.md`
3. Check browser console for errors
4. Review mock backend implementation
5. Test with demo account first

## Summary

The mock backend system provides:

✅ **Complete functionality** without real backend  
✅ **Realistic user experience** with network delays  
✅ **Pre-loaded demo data** for immediate testing  
✅ **Easy switching** to real backend when ready  
✅ **Perfect for development** and demonstrations  

**Get started now:**
```bash
npm run dev
```

**Login with:**
- Email: `demo@example.com`
- Password: `demo123`

**Enjoy exploring the application!** 🚀
