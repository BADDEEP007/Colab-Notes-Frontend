// Dummy Users
export const dummyUsers = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4F46E5&color=fff',
    emailVerified: true,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'user-2',
    email: 'john@example.com',
    password: 'john123',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff',
    emailVerified: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'user-3',
    email: 'jane@example.com',
    password: 'jane123',
    name: 'Jane Smith',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=F59E0B&color=fff',
    emailVerified: true,
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'user-4',
    email: 'alice@example.com',
    password: 'alice123',
    name: 'Alice Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=EF4444&color=fff',
    emailVerified: true,
    createdAt: new Date('2024-02-15').toISOString(),
  },
];

// Dummy Instances
export const dummyInstances = [
  {
    id: 'instance-1',
    name: 'Personal Projects',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', role: 'Owner', joinedAt: new Date('2024-01-01').toISOString() },
      { userId: 'user-2', role: 'Editor', joinedAt: new Date('2024-01-10').toISOString() },
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'instance-2',
    name: 'Team Collaboration',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', role: 'Owner', joinedAt: new Date('2024-01-05').toISOString() },
      { userId: 'user-2', role: 'Editor', joinedAt: new Date('2024-01-06').toISOString() },
      { userId: 'user-3', role: 'Editor', joinedAt: new Date('2024-01-07').toISOString() },
      { userId: 'user-4', role: 'Viewer', joinedAt: new Date('2024-01-08').toISOString() },
    ],
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'instance-3',
    name: 'Study Notes',
    ownerId: 'user-1',
    members: [{ userId: 'user-1', role: 'Owner', joinedAt: new Date('2024-02-01').toISOString() }],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'instance-4',
    name: 'Meeting Notes',
    ownerId: 'user-2',
    members: [
      { userId: 'user-2', role: 'Owner', joinedAt: new Date('2024-02-10').toISOString() },
      { userId: 'user-1', role: 'Editor', joinedAt: new Date('2024-02-11').toISOString() },
    ],
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Dummy Containers
export const dummyContainers = [
  {
    id: 'container-1',
    instanceId: 'instance-1',
    name: 'Frontend Development',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'container-2',
    instanceId: 'instance-1',
    name: 'Backend Development',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'container-3',
    instanceId: 'instance-2',
    name: 'Sprint Planning',
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'container-4',
    instanceId: 'instance-2',
    name: 'Design Documents',
    createdAt: new Date('2024-01-07').toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'container-5',
    instanceId: 'instance-3',
    name: 'Mathematics',
    createdAt: new Date('2024-02-02').toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'container-6',
    instanceId: 'instance-3',
    name: 'Computer Science',
    createdAt: new Date('2024-02-03').toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Dummy Notes
export const dummyNotes = [
  {
    id: 'note-1',
    containerId: 'container-1',
    title: 'React Best Practices',
    content: `# React Best Practices

## Component Structure
- Keep components small and focused
- Use functional components with hooks
- Implement proper prop validation

## State Management
- Use local state when possible
- Lift state up when needed
- Consider Zustand for global state

## Performance
- Use React.memo for expensive components
- Implement code splitting
- Optimize re-renders with useMemo and useCallback`,
    whiteboardData: null,
    authorId: 'user-1',
    sharedWith: [],
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    containerId: 'container-1',
    title: 'CSS Architecture',
    content: `# CSS Architecture

## CSS Modules
- Component-scoped styling
- Locally scoped class names
- CSS variables for design tokens

## Best Practices
- Use consistent naming conventions
- Organize styles logically
- Avoid deep nesting`,
    whiteboardData: null,
    authorId: 'user-1',
    sharedWith: [
      { userId: 'user-2', role: 'Editor', sharedAt: new Date('2024-01-10').toISOString() },
    ],
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'note-3',
    containerId: 'container-2',
    title: 'API Design',
    content: `# API Design Guidelines

## RESTful Principles
- Use proper HTTP methods
- Implement consistent URL structure
- Return appropriate status codes

## Authentication
- JWT tokens for stateless auth
- Refresh token mechanism
- Secure password storage

## Error Handling
- Consistent error response format
- Meaningful error messages
- Proper logging`,
    whiteboardData: null,
    authorId: 'user-1',
    sharedWith: [],
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'note-4',
    containerId: 'container-3',
    title: 'Sprint 1 Goals',
    content: `# Sprint 1 Goals

## Objectives
- Complete user authentication
- Implement dashboard layout
- Set up real-time sync

## Tasks
1. Design login/signup pages
2. Integrate OAuth providers
3. Create instance management
4. WebSocket setup

## Timeline
- Week 1: Authentication
- Week 2: Dashboard
- Week 3: Real-time features`,
    whiteboardData: null,
    authorId: 'user-2',
    sharedWith: [
      { userId: 'user-1', role: 'Editor', sharedAt: new Date('2024-01-06').toISOString() },
      { userId: 'user-3', role: 'Editor', sharedAt: new Date('2024-01-06').toISOString() },
    ],
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'note-5',
    containerId: 'container-5',
    title: 'Calculus Notes',
    content: `# Calculus - Derivatives

## Basic Rules
- Power Rule: d/dx(x^n) = nx^(n-1)
- Product Rule: d/dx(uv) = u'v + uv'
- Chain Rule: d/dx(f(g(x))) = f'(g(x))g'(x)

## Applications
- Finding maxima and minima
- Optimization problems
- Related rates`,
    whiteboardData: {
      version: '1.0',
      objects: [],
      background: '#ffffff',
    },
    authorId: 'user-1',
    sharedWith: [],
    createdAt: new Date('2024-02-02').toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Dummy Friends
export const dummyFriends = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    status: 'accepted',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'friend-2',
    userId: 'user-1',
    friendId: 'user-3',
    status: 'accepted',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'friend-3',
    userId: 'user-1',
    friendId: 'user-4',
    status: 'pending',
    createdAt: new Date('2024-02-01').toISOString(),
  },
];

// Dummy Online Status
export const dummyOnlineStatus = [
  {
    userId: 'user-1',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
  {
    userId: 'user-2',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
  {
    userId: 'user-3',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    userId: 'user-4',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Dummy Notifications
export const dummyNotifications = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'friend_request',
    title: 'New Friend Request',
    message: 'Alice Johnson sent you a friend request',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    data: { friendId: 'user-4' },
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'note_shared',
    title: 'Note Shared',
    message: 'John Doe shared "Sprint 1 Goals" with you',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    data: { noteId: 'note-4', sharedBy: 'user-2' },
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'instance_invite',
    title: 'Instance Invitation',
    message: 'You were invited to "Meeting Notes"',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    data: { instanceId: 'instance-4' },
  },
];

// Helper function to get user by email
export const getUserByEmail = (email) => {
  return dummyUsers.find((user) => user.email === email);
};

// Helper function to get user by id
export const getUserById = (id) => {
  return dummyUsers.find((user) => user.id === id);
};

// Helper function to get instances for user
export const getInstancesForUser = (userId) => {
  return dummyInstances.filter((instance) =>
    instance.members.some((member) => member.userId === userId)
  );
};

// Helper function to get containers for instance
export const getContainersForInstance = (instanceId) => {
  return dummyContainers.filter((container) => container.instanceId === instanceId);
};

// Helper function to get notes for container
export const getNotesForContainer = (containerId) => {
  return dummyNotes.filter((note) => note.containerId === containerId);
};

// Helper function to get friends for user
export const getFriendsForUser = (userId) => {
  return dummyFriends
    .filter((friend) => friend.userId === userId && friend.status === 'accepted')
    .map((friend) => getUserById(friend.friendId));
};

// Helper function to get friend requests for user
export const getFriendRequestsForUser = (userId) => {
  return dummyFriends
    .filter((friend) => friend.friendId === userId && friend.status === 'pending')
    .map((friend) => ({
      ...friend,
      user: getUserById(friend.userId),
    }));
};

// Helper function to get notifications for user
export const getNotificationsForUser = (userId) => {
  return dummyNotifications.filter((notif) => notif.userId === userId);
};
