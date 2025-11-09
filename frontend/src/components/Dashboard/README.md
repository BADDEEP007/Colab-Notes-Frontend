# Dashboard Components

This directory contains all components related to the main dashboard view of the Collab Notes application.

## Components

### Navbar.jsx

Dashboard navigation bar with:

- Logo and branding
- Search bar with 300ms debounced filtering
- Notifications dropdown with unread indicator
- Profile dropdown with user menu
- Responsive design

**Requirements**: 4.4, 19.1, 19.3, 20.4

### OnlineUsersSidebar.jsx

Sidebar displaying online users with:

- List of online friends with avatars
- Real-time online status indicators
- Collapsible behavior for mobile devices
- Smooth expand/collapse animations
- Mobile toggle button

**Requirements**: 4.5, 15.3, 15.4, 16.3

### InstanceCard.jsx

Card component for displaying instance information:

- Instance name, member count, and role badge
- Context menu with rename, delete, and share options
- Hover effects and animations
- Conditional delete option (Owner role only)
- Last modified timestamp

**Requirements**: 4.3, 5.4, 5.5

### CreateInstanceModal.jsx

Modal for creating new instances:

- Modal overlay with backdrop
- Instance name input with validation
- Create and cancel buttons
- Loading state during creation
- Integration with useInstanceStore
- Keyboard shortcuts (Escape to close)

**Requirements**: 5.1, 5.2, 5.3

### InstancesGrid.jsx

Grid layout for displaying instances:

- Responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- Integration with useInstanceStore
- Create instance button
- Search filtering support
- Empty state and loading states
- No results state for search

**Requirements**: 4.2, 4.3, 19.1, 19.2, 19.4

### ProductivityToolbar.jsx

Bottom toolbar with quick actions:

- AI assistant quick access button
- Shared notes quick access
- Quick note creation button
- Friends navigation button
- Mobile-responsive design

**Requirements**: 4.6

## Usage

```jsx
import { DashboardPage } from './pages';

// The DashboardPage component combines all dashboard components
function App() {
  return <DashboardPage />;
}
```

Or import individual components:

```jsx
import {
  DashboardNavbar,
  OnlineUsersSidebar,
  InstanceCard,
  CreateInstanceModal,
  InstancesGrid,
  ProductivityToolbar,
} from './components/Dashboard';
```

## Features

- **Responsive Design**: All components adapt to mobile, tablet, and desktop screens
- **Real-time Updates**: Online status and notifications update in real-time
- **Accessibility**: ARIA labels, keyboard navigation, and focus management
- **Dark Mode**: Full dark mode support with CSS Modules
- **Debounced Search**: 300ms debounce on search input for better performance
- **Loading States**: Proper loading indicators for async operations
- **Error Handling**: User-friendly error messages and validation

## State Management

Components integrate with Zustand stores:

- `useAuthStore`: User authentication and profile data
- `useInstanceStore`: Instance CRUD operations
- `useFriendStore`: Friend management and online status

## Styling

All components use CSS Modules for styling with:

- Consistent color scheme
- Smooth transitions and animations
- Responsive breakpoints
- Dark mode support
