import axios from 'axios';

// Use environment variable for API URL (set in Vercel) or fallback to localhost
// Automatically append /api if not present
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure baseURL ends with /api
if (!baseURL.endsWith('/api')) {
  // Remove trailing slash if present, then add /api
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL,
});

// Request Interceptor: Add token and tenantId to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');

    // Skip tenant header for tenant registration endpoint (public endpoint)
    const isTenantRegistration = config.url?.includes('/tenants/register');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId && !isTenantRegistration) {
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

