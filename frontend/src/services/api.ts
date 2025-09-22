/**
 * API Service for Helio Pharmacy Management System
 * Handles all HTTP requests to the Flask backend
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Health check
  health: () => api.get('/api/health'),

  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post('/api/auth/login', credentials),
    register: (userData: any) => api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
    refresh: () => api.post('/api/auth/refresh'),
  },

  // Pharmacy management
  pharmacy: {
    getAll: () => api.get('/api/pharmacy'),
    getById: (id: string) => api.get(`/api/pharmacy/${id}`),
    create: (data: any) => api.post('/api/pharmacy', data),
    update: (id: string, data: any) => api.put(`/api/pharmacy/${id}`, data),
    delete: (id: string) => api.delete(`/api/pharmacy/${id}`),
  },

  // Medicines
  medicines: {
    getAll: (params?: any) => api.get('/api/medicines', { params }),
    getById: (id: string) => api.get(`/api/medicines/${id}`),
    create: (data: any) => api.post('/api/medicines', data),
    update: (id: string, data: any) => api.put(`/api/medicines/${id}`, data),
    delete: (id: string) => api.delete(`/api/medicines/${id}`),
    getCategories: () => api.get('/api/medicines/categories'),
  },

  // Inventory
  inventory: {
    getAll: (params?: any) => api.get('/api/inventory', { params }),
    getById: (id: string) => api.get(`/api/inventory/${id}`),
    create: (data: any) => api.post('/api/inventory', data),
    update: (id: string, data: any) => api.put(`/api/inventory/${id}`, data),
    delete: (id: string) => api.delete(`/api/inventory/${id}`),
    getLowStock: () => api.get('/api/inventory/low-stock'),
    getExpiring: () => api.get('/api/inventory/expiring'),
  },

  // Patients
  patients: {
    getAll: (params?: any) => api.get('/api/patients', { params }),
    getById: (id: string) => api.get(`/api/patients/${id}`),
    create: (data: any) => api.post('/api/patients', data),
    update: (id: string, data: any) => api.put(`/api/patients/${id}`, data),
    delete: (id: string) => api.delete(`/api/patients/${id}`),
  },

  // Prescriptions
  prescriptions: {
    getAll: (params?: any) => api.get('/api/prescriptions', { params }),
    getById: (id: string) => api.get(`/api/prescriptions/${id}`),
    create: (data: any) => api.post('/api/prescriptions', data),
    update: (id: string, data: any) => api.put(`/api/prescriptions/${id}`, data),
    delete: (id: string) => api.delete(`/api/prescriptions/${id}`),
    fulfill: (id: string) => api.post(`/api/prescriptions/${id}/fulfill`),
  },

  // Notifications
  notifications: {
    getAll: (params?: any) => api.get('/api/notifications', { params }),
    getById: (id: string) => api.get(`/api/notifications/${id}`),
    markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
    markAllAsRead: () => api.put('/api/notifications/read-all'),
    delete: (id: string) => api.delete(`/api/notifications/${id}`),
  },

  // Analytics
  analytics: {
    getDashboard: () => api.get('/api/analytics/dashboard'),
    getSales: (period?: string) => api.get('/api/analytics/sales', { params: { period } }),
    getInventory: () => api.get('/api/analytics/inventory'),
    getPrescriptions: (period?: string) => api.get('/api/analytics/prescriptions', { params: { period } }),
    getPatients: () => api.get('/api/analytics/patients'),
  },

  // Rare medicines
  rareMedicines: {
    getAll: (params?: any) => api.get('/api/rare-medicines', { params }),
    getById: (id: string) => api.get(`/api/rare-medicines/${id}`),
    create: (data: any) => api.post('/api/rare-medicines', data),
    update: (id: string, data: any) => api.put(`/api/rare-medicines/${id}`, data),
    approve: (id: string, data: any) => api.post(`/api/rare-medicines/${id}/approve`, data),
    complete: (id: string) => api.post(`/api/rare-medicines/${id}/complete`),
  },
};

export default api;