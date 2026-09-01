import axios from 'axios';

const CSRF_TOKEN_STORAGE_KEY = 'csrfToken';

let csrfToken = '';

if (typeof window !== 'undefined') {
  csrfToken = window.sessionStorage.getItem(CSRF_TOKEN_STORAGE_KEY) || '';
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Matches with Vite env variable
  withCredentials: true, // Send cookies with requests
});

export const setCsrfToken = (token) => {
  csrfToken = token || '';

  if (typeof window === 'undefined') {
    return;
  }

  if (csrfToken) {
    window.sessionStorage.setItem(CSRF_TOKEN_STORAGE_KEY, csrfToken);
    return;
  }

  window.sessionStorage.removeItem(CSRF_TOKEN_STORAGE_KEY);
};

export const clearCsrfToken = () => {
  setCsrfToken('');
};

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

  if (requiresCsrf && csrfToken) {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

export default api;
