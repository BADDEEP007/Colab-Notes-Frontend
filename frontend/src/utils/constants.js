/**
 * Application-wide constants
 */

// User roles
export const ROLES = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

// API endpoints base paths
export const API_PATHS = {
  AUTH: '/api/auth',
  NOTES: '/api/notes',
  USERS: '/api/users',
  AI: '/api/ai',
  GOOGLE: '/api/google',
  MICROSOFT: '/api/microsoft',
  EMAIL: '/api/sendmail',
};

// Socket event names
export const SOCKET_EVENTS = {
  NOTE_UPDATE: 'note:update',
  DRAW_UPDATE: 'draw:update',
  FRIEND_ADDED: 'friend:added',
  USER_STATUS: 'user:status',
  NOTE_SHARE: 'note:share',
  INSTANCE_MEMBER_ADDED: 'instance:member-added',
  INSTANCE_UPDATED: 'instance:updated',
  USER_JOINED_NOTE: 'user:joined-note',
  USER_LEFT_NOTE: 'user:left-note',
  ACTIVE_USERS_LIST: 'active:users-list',
  REQUEST_ACTIVE_USERS: 'request:active-users',
  FRIEND_REQUEST: 'friend:request',
  INSTANCE_INVITATION: 'instance:invitation',
};

// Auto-save debounce delay (ms)
export const AUTO_SAVE_DELAY = 500;

// Search debounce delay (ms)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Drawing update debounce delay (ms)
export const DRAW_UPDATE_DELAY = 100;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (px)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};
