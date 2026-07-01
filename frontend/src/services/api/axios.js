import axios from 'axios';

// Get API base URL from Vite environment variables or fallback to local backend port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a reusable Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure request interceptor to automatically attach JWT token to outgoing private requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure response interceptor to handle errors globally (401 Unauthorized, Expired Tokens, Network Errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Network Errors (no response from server)
    if (!error.response) {
      console.error('[API Network Error]: Please check your connection or server status.');
      const networkError = new Error('Network connection error. Please make sure the backend server is running.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    const { status } = error.response;

    // 2. 401 Unauthorized / Expired Tokens
    if (status === 401) {
      console.warn('[API Unauthorized]: Session has expired or is invalid. Clearing local session...');
      // Clear token from localStorage to prevent repeated invalid requests
      localStorage.removeItem('token');

      // Dispatch a custom event to notify listeners (like context providers) of session invalidation
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
