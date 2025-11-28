import axios from 'axios';

// Use environment variable for API URL (set in Vercel) or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

// Request Interceptor: Add token and tenantId to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

