import axios from 'axios';

/**
 * API configuration
 * -----------------
 *
 * Creates an Axios instance with a base URL pulled from the Vite
 * environment variable `VITE_API_URL`. If no variable is provided
 * the client falls back to `http://localhost:3000`. All requests
 * include a JWT token from localStorage (if present) via an
 * interceptor. Any modifications to header logic can be made here.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach authorization header with bearer token when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;