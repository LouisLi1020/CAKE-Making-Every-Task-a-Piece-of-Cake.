import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cake_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cake_token');
      localStorage.removeItem('cake_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/healthz');
    return response.data;
  },
};

// Clients API
export const clientsAPI = {
  // Get all clients
  getAll: async (params = {}) => {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  // Get single client
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Create new client
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Update client
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Delete client
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
