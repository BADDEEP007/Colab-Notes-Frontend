import {
  dummyUsers,
  dummyInstances,
  dummyContainers,
  dummyNotes,
  dummyFriends,
  dummyOnlineStatus,
  dummyNotifications,
  getUserByEmail,
  getUserById,
  getInstancesForUser,
  getContainersForInstance,
  getNotesForContainer,
  getFriendsForUser,
  getFriendRequestsForUser,
  getNotificationsForUser,
} from './dummyData';

// In-memory storage for runtime data
let users = [...dummyUsers];
let instances = [...dummyInstances];
let containers = [...dummyContainers];
let notes = [...dummyNotes];
let friends = [...dummyFriends];
let onlineStatus = [...dummyOnlineStatus];
let notifications = [...dummyNotifications];

// Current logged-in user
let currentUser = null;
let authToken = null;

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock Backend API
export const mockBackend = {
  // Authentication APIs
  auth: {
    register: async (email, password, name) => {
      await delay();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: generateId('user'),
        email,
        password,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff`,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      
      return {
        success: true,
        message: 'Registration successful. Please verify your email.',
        user: { ...newUser, password: undefined },
      };
    },
    
    login: async (email, password) => {
      await delay();
      
      console.log('[Mock Backend] Login attempt:', { email, password });
      console.log('[Mock Backend] Available users:', users.length);
      console.log('[Mock Backend] Users:', users.map(u => ({ email: u.email, password: u.password })));
      
      const user = users.find(u => u.email === email);
      console.log('[Mock Backend] Found user:', user);
      
      if (!user || user.password !== password) {
        console.error('[Mock Backend] Login failed - user not found or password mismatch');
        throw new Error('Invalid email or password');
      }
      
      currentUser = user;
      authToken = `mock-token-${user.id}-${Date.now()}`;
      console.log('[Mock Backend] Login successful:', { userId: user.id, token: authToken });
      
      // Update online status
      const statusIndex = onlineStatus.findIndex(s => s.userId === user.id);
      if (statusIndex >= 0) {
        onlineStatus[statusIndex].status = 'online';
        onlineStatus[statusIndex].lastSeen = new Date().toISOString();
      } else {
        onlineStatus.push({
          userId: user.id,
          status: 'online',
          lastSeen: new Date().toISOString(),
        });
      }
      
      return {
        success: true,
        token: authToken,
        user: { ...user, password: undefined },
      };
    },
    
    logout: async () => {
      await delay(100);
      
      if (currentUser) {
        const statusIndex = onlineStatus.findIndex(s => s.userId === currentUser.id);
        if (statusIndex >= 0) {
          onlineStatus[statusIndex].status = 'offline';
          onlineStatus[statusIndex].lastSeen = new Date().toISOString();
        }
      }
      
      currentUser = null;
      authToken = null;
      
      return { success: true, message: 'Logged out successfully' };
    },
    
    getCurrentUser: async () => {
      await delay(100);
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      return { ...currentUser, password: undefined };
    },
    
    forgotPassword: async (email) => {
      await delay();
      
      const user = getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    },
    
    resetPassword: async (token, newPassword) => {
      await delay();
      
      // In a real app, validate token
      return {
        success: true,
        message: 'Password reset successfully',
      };
    },
    
    changePassword: async (oldPassword, newPassword) => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      if (currentUser.password !== oldPassword) {
        throw new Error('Incorrect old password');
      }
      
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      users[userIndex].password = newPassword;
      currentUser.password = newPassword;
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    },
    
    verifyEmail: async (token) => {
      await delay();
      
      return {
        success: true,
        message: 'Email verified successfully',
      };
    },
  },
  
  // Instance APIs
  instances: {
    getAll: async () => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      const userInstances = getInstancesForUser(currentUser.id);
      
      return userInstances.map(instance => ({
        ...instance,
        memberCount: instance.members.length,
        role: instance.members.find(m => m.userId === currentUser.id)?.role || 'Viewer',
      }));
    },
    
    getById: async (id) => {
      await delay();
      
      const instance = instances.find(i => i.id === id);
      if (!instance) {
        throw new Error('Instance not found');
      }
      
      return {
        ...instance,
        memberCount: instance.members.length,
        role: instance.members.find(m => m.userId === currentUser.id)?.role || 'Viewer',
      };
    },
    
    create: async (name) => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      const newInstance = {
        id: generateId('instance'),
        name,
        ownerId: currentUser.id,
        members: [
          {
            userId: currentUser.id,
            role: 'Owner',
            joinedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      instances.push(newInstance);
      
      return newInstance;
    },
    
    update: async (id, updates) => {
      await delay();
      
      const index = instances.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Instance not found');
      }
      
      instances[index] = {
        ...instances[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      return instances[index];
    },
    
    delete: async (id) => {
      await delay();
      
      const index = instances.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Instance not found');
      }
      
      // Check if user is owner
      const instance = instances[index];
      if (instance.ownerId !== currentUser.id) {
        throw new Error('Only owner can delete instance');
      }
      
      instances.splice(index, 1);
      
      return { success: true, message: 'Instance deleted' };
    },
  },
  
  // Container APIs
  containers: {
    getByInstance: async (instanceId) => {
      await delay();
      
      return getContainersForInstance(instanceId);
    },
    
    create: async (instanceId, name) => {
      await delay();
      
      const newContainer = {
        id: generateId('container'),
        instanceId,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      containers.push(newContainer);
      
      return newContainer;
    },
    
    update: async (id, updates) => {
      await delay();
      
      const index = containers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Container not found');
      }
      
      containers[index] = {
        ...containers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      return containers[index];
    },
    
    delete: async (id) => {
      await delay();
      
      const index = containers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Container not found');
      }
      
      containers.splice(index, 1);
      
      return { success: true, message: 'Container deleted' };
    },
  },
  
  // Note APIs
  notes: {
    getByContainer: async (containerId) => {
      await delay();
      
      return getNotesForContainer(containerId);
    },
    
    getById: async (id) => {
      await delay();
      
      const note = notes.find(n => n.id === id);
      if (!note) {
        throw new Error('Note not found');
      }
      
      return note;
    },
    
    getByTitle: async (title) => {
      await delay();
      
      const note = notes.find(n => n.title === title);
      if (!note) {
        throw new Error('Note not found');
      }
      
      return note;
    },
    
    create: async (containerId, title, content = '') => {
      await delay();
      
      const newNote = {
        id: generateId('note'),
        containerId,
        title,
        content,
        whiteboardData: null,
        authorId: currentUser.id,
        sharedWith: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      notes.push(newNote);
      
      return newNote;
    },
    
    update: async (id, updates) => {
      await delay(100); // Shorter delay for auto-save
      
      const index = notes.findIndex(n => n.id === id);
      if (index === -1) {
        throw new Error('Note not found');
      }
      
      notes[index] = {
        ...notes[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      return notes[index];
    },
    
    delete: async (id) => {
      await delay();
      
      const index = notes.findIndex(n => n.id === id);
      if (index === -1) {
        throw new Error('Note not found');
      }
      
      notes.splice(index, 1);
      
      return { success: true, message: 'Note deleted' };
    },
  },
  
  // Friend APIs
  friends: {
    getAll: async () => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      return getFriendsForUser(currentUser.id);
    },
    
    getRequests: async () => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      return getFriendRequestsForUser(currentUser.id);
    },
    
    sendRequest: async (email) => {
      await delay();
      
      const friend = getUserByEmail(email);
      if (!friend) {
        throw new Error('User not found');
      }
      
      if (friend.id === currentUser.id) {
        throw new Error('Cannot send friend request to yourself');
      }
      
      const existingFriend = friends.find(
        f => (f.userId === currentUser.id && f.friendId === friend.id) ||
             (f.userId === friend.id && f.friendId === currentUser.id)
      );
      
      if (existingFriend) {
        throw new Error('Friend request already exists');
      }
      
      const newFriend = {
        id: generateId('friend'),
        userId: currentUser.id,
        friendId: friend.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      friends.push(newFriend);
      
      return newFriend;
    },
    
    acceptRequest: async (requestId) => {
      await delay();
      
      const index = friends.findIndex(f => f.id === requestId);
      if (index === -1) {
        throw new Error('Friend request not found');
      }
      
      friends[index].status = 'accepted';
      
      return friends[index];
    },
    
    rejectRequest: async (requestId) => {
      await delay();
      
      const index = friends.findIndex(f => f.id === requestId);
      if (index === -1) {
        throw new Error('Friend request not found');
      }
      
      friends.splice(index, 1);
      
      return { success: true, message: 'Friend request rejected' };
    },
    
    remove: async (friendId) => {
      await delay();
      
      const index = friends.findIndex(
        f => (f.userId === currentUser.id && f.friendId === friendId) ||
             (f.userId === friendId && f.friendId === currentUser.id)
      );
      
      if (index === -1) {
        throw new Error('Friend not found');
      }
      
      friends.splice(index, 1);
      
      return { success: true, message: 'Friend removed' };
    },
  },
  
  // Online Status APIs
  status: {
    getAll: async () => {
      await delay(100);
      
      return onlineStatus;
    },
    
    update: async (status) => {
      await delay(50);
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      const index = onlineStatus.findIndex(s => s.userId === currentUser.id);
      if (index >= 0) {
        onlineStatus[index].status = status;
        onlineStatus[index].lastSeen = new Date().toISOString();
      }
      
      return onlineStatus[index];
    },
  },
  
  // Notification APIs
  notifications: {
    getAll: async () => {
      await delay();
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      return getNotificationsForUser(currentUser.id);
    },
    
    markAsRead: async (id) => {
      await delay(100);
      
      const index = notifications.findIndex(n => n.id === id);
      if (index >= 0) {
        notifications[index].read = true;
      }
      
      return notifications[index];
    },
    
    markAllAsRead: async () => {
      await delay(100);
      
      notifications.forEach(n => {
        if (n.userId === currentUser.id) {
          n.read = true;
        }
      });
      
      return { success: true, message: 'All notifications marked as read' };
    },
  },
  
  // AI APIs
  ai: {
    summarize: async (content) => {
      await delay(1000);
      
      // Simple mock summarization
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 3).join('. ') + '.';
      
      return {
        success: true,
        summary: summary || 'No content to summarize.',
      };
    },
    
    assist: async (prompt, context) => {
      await delay(1500);
      
      // Mock AI assistance
      return {
        success: true,
        content: `Based on your prompt "${prompt}", here are some suggestions:\n\n1. Consider breaking down the problem into smaller parts\n2. Review the existing documentation\n3. Test your implementation thoroughly\n\nThis is a mock AI response for demonstration purposes.`,
      };
    },
  },
  
  // Utility functions
  getCurrentUser: () => currentUser,
  getAuthToken: () => authToken,
  isAuthenticated: () => !!currentUser && !!authToken,
  
  // Reset function for testing
  reset: () => {
    users = [...dummyUsers];
    instances = [...dummyInstances];
    containers = [...dummyContainers];
    notes = [...dummyNotes];
    friends = [...dummyFriends];
    onlineStatus = [...dummyOnlineStatus];
    notifications = [...dummyNotifications];
    currentUser = null;
    authToken = null;
  },
};

export default mockBackend;
