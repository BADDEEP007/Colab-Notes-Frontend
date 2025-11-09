# Routing and Navigation Implementation

## Overview
This document describes the routing and navigation implementation for the Collab Notes frontend application.

## Components Created

### 1. ProtectedRoute Component
**Location:** `src/components/ProtectedRoute.jsx`

A route guard component that:
- Redirects unauthenticated users to the login page
- Saves the intended destination for redirect after login
- Shows a loading spinner while checking authentication
- Supports optional permission checking via `checkPermission` prop
- Can redirect to custom paths if permission checks fail

**Usage:**
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### 2. PublicRoute Component
**Location:** `src/components/PublicRoute.jsx`

A route guard component that:
- Redirects authenticated users away from auth pages (login, signup)
- Redirects to dashboard or the user's intended destination
- Shows a loading spinner while checking authentication
- Prevents authenticated users from accessing public-only pages

**Usage:**
```jsx
<Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>
```

### 3. Permission Utilities
**Location:** `src/utils/permissions.js`

A comprehensive set of permission checking utilities:

**Constants:**
- `ROLES`: Object containing role constants (Owner, Editor, Viewer)

**Functions:**
- `hasPermission(userRole, requiredRole)`: Check if user has required permission level
- `canEdit(userRole)`: Check if user can edit (Editor or Owner)
- `isOwner(userRole)`: Check if user is owner
- `canView(userRole)`: Check if user can view (all roles)
- `canDelete(userRole)`: Check if user can delete (Owner only)
- `canInvite(userRole)`: Check if user can invite (Editor or Owner)
- `canShare(userRole)`: Check if user can share (Editor or Owner)
- `getUserRole(resource, userId)`: Get user's role for a resource
- `hasAccess(resource, userId, requiredRole)`: Check if user has access to resource

## Routes Configured

### Public Routes (with PublicRoute guard)
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password recovery page
- `/reset-password` - Password reset page

### Public Routes (no guard)
- `/verify-email` - Email verification (accessible to all)
- `/share/instance/:resourceId` - Shareable instance link
- `/share/note/:resourceId` - Shareable note link

### Protected Routes (with ProtectedRoute guard)
- `/` - Dashboard (root)
- `/dashboard` - Dashboard
- `/instance/:instanceId` - Instance page
- `/instance/:instanceId/container/:containerId/note/:noteId` - Container/Note page
- `/friends` - Friends management page

### Catch-all Route
- `*` - Redirects to dashboard if authenticated, login if not

## App Initialization

The App component now:
1. Checks authentication status on mount using `checkAuth()`
2. Shows a loading spinner while checking authentication
3. Properly handles authentication state before rendering routes
4. Wraps all routes with ErrorBoundary and ToastProvider

## Key Features

### 1. Authentication State Management
- Automatic authentication check on app load
- Loading states during authentication checks
- Proper token management via auth store

### 2. Navigation Guards
- **ProtectedRoute**: Prevents unauthenticated access to protected pages
- **PublicRoute**: Prevents authenticated users from accessing auth pages
- Both guards save intended destinations for post-login redirects

### 3. Permission Checking
- Role-based access control utilities
- Hierarchical role system (Owner > Editor > Viewer)
- Resource-level permission checking
- Reusable permission functions throughout the app

### 4. User Experience
- Loading spinners during authentication checks
- Seamless redirects after login
- Preserved navigation state
- Proper error boundaries

## Requirements Satisfied

### Requirement 2.1 (Login)
✅ Protected routes redirect to login if not authenticated
✅ Login page redirects to dashboard when already authenticated

### Requirement 4.1 (Dashboard)
✅ Dashboard is protected and requires authentication
✅ Proper routing structure for all pages

### Requirement 7.4 (Instance Navigation)
✅ Instance and container routes properly configured
✅ Nested routing for containers and notes

### Requirement 13.4 (Shareable Links)
✅ Public routes for shareable links
✅ Separate routes for instance and note sharing

## Usage Examples

### Using ProtectedRoute with Permission Check
```jsx
<Route
  path="/instance/:instanceId"
  element={
    <ProtectedRoute
      checkPermission={() => {
        const instance = useInstanceStore.getState().currentInstance;
        const user = useAuthStore.getState().user;
        return hasAccess(instance, user.id, ROLES.VIEWER);
      }}
      redirectTo="/dashboard"
    >
      <InstancePage />
    </ProtectedRoute>
  }
/>
```

### Using Permission Utilities in Components
```jsx
import { canEdit, getUserRole } from '../utils/permissions';

function NoteEditor({ note }) {
  const { user } = useAuthStore();
  const userRole = getUserRole(note, user.id);
  const isEditable = canEdit(userRole);

  return (
    <div>
      <textarea disabled={!isEditable} />
    </div>
  );
}
```

## Testing Recommendations

1. **Authentication Flow**
   - Test redirect to login when accessing protected routes
   - Test redirect to dashboard when accessing auth pages while logged in
   - Test preservation of intended destination after login

2. **Permission Checking**
   - Test role-based access for different user roles
   - Test permission utilities with various role combinations
   - Test resource-level permission checks

3. **Navigation**
   - Test all route paths
   - Test catch-all route behavior
   - Test shareable link routes

4. **Loading States**
   - Test loading spinner display during auth checks
   - Test proper rendering after authentication is confirmed

## Future Enhancements

1. **Route Transitions**: Add animated transitions between routes
2. **Breadcrumbs**: Implement breadcrumb navigation for nested routes
3. **Route Guards**: Add more sophisticated permission checks at route level
4. **Analytics**: Track route changes for analytics
5. **Lazy Loading**: Implement code splitting for route components
