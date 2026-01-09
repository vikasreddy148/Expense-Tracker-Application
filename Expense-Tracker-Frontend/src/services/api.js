import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
      }
      
      // Extract error message
      const errorMessage = error.response.data?.message || error.message || 'An error occurred';
      const errorData = {
        message: errorMessage,
        status: error.response.status,
        path: error.response.data?.path,
        errors: error.response.data?.errors,
      };
      
      return Promise.reject(errorData);
    }
    
    // Network error
    return Promise.reject({
      message: 'Network error. Please check your connection.',
      status: 0,
    });
  }
);

export default api;

