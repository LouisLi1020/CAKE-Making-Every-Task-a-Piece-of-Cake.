// Shared constants for Piece of Cake application

// User roles (RWX-style permissions)
export const ROLES = {
  MANAGER: 'manager',    // rwx on own tasks, r on others
  LEADER: 'leader',      // rw on assignment fields, r on others  
  MEMBER: 'member'       // r on assigned tasks, w on own status
};

// Task statuses
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task priorities
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Client tiers
export const CLIENT_TIER = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  USERS: '/users',
  CLIENTS: '/clients', 
  TASKS: '/tasks',
  FEEDBACK: '/feedback',
  STATS: '/stats'
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Theme modes
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'cake_token',
  THEME: 'cake_theme',
  USER: 'cake_user'
};
