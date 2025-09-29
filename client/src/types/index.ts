// Global Type Definitions
// Centralized type definitions for the entire application

// User related types
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'manager' | 'leader' | 'member';
  avatar?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

// Task related types
export interface Task {
  _id: string;
  taskNumber: string;
  title: string;
  description: string;
  clientId: string | Client;
  assigneeIds: string[] | User[];
  createdBy: string | User;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimateHours: number;
  actualHours: number;
  revenue: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Project related types
export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number; // 0-100
  startDate?: string;
  endDate?: string;
  team: User[];
  tasks: Task[];
  client?: Client;
  createdAt: string;
  updatedAt: string;
}

// Client related types
export interface Client {
  _id: string;
  name: string;
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  tier: 'basic' | 'premium' | 'enterprise';
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

// Feedback related types
export interface FeedbackItem {
  _id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  score: number; // 1-5 rating
  taskId: string | Task;
  clientId: string | Client;
  submittedBy: string | User;
  assignedTo?: string | User;
  createdAt: string;
  updatedAt: string;
}

// Dashboard related types
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  totalUsers: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTasks: Task[];
  activeProjects: Project[];
  teamMembers: User[];
  upcomingDeadlines: Task[];
  recentActivity: ActivityItem[];
}

// Activity and notifications
export interface ActivityItem {
  _id: string;
  type: 'task_created' | 'task_completed' | 'project_updated' | 'user_joined' | 'feedback_submitted';
  title: string;
  description: string;
  user: User;
  relatedItem?: Task | Project | FeedbackItem;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  user: User;
  relatedItem?: Task | Project | FeedbackItem;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  project?: string;
}

export interface ProjectForm {
  name: string;
  description?: string;
  status: Project['status'];
  startDate?: string;
  endDate?: string;
  team: string[];
  client?: string;
}

export interface ClientForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface FeedbackForm {
  title: string;
  description: string;
  type: FeedbackItem['type'];
  priority: FeedbackItem['priority'];
  assignedTo?: string;
  task?: string;
  client?: string;
  score?: number;
}

// UI Component types
export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  children?: MenuItem[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Theme types
export interface Theme {
  name: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

// Filter and search types
export interface FilterOptions {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  project?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retry?: () => void;
}
