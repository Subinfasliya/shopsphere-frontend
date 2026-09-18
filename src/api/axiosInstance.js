import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

console.log(baseURL);


const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const readCookie = (name) => {
  const row = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.split('=').slice(1).join('=')) : null;
};

const clearSessionHint = () => {
  document.cookie = 'sessionHint=; Max-Age=0; Path=/';
};

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toUpperCase();
  config.headers['X-Client-Request-Id'] ||= (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = readCookie('csrfToken');
    if (csrf) config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';
    const isAuthEndpoint = /\/auth\/(login|register|refresh|logout|csrf|session|forgot-password|reset-password)/.test(url);

    if (status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    // No readable session hint means the visitor is logged out. Do not create
    // an unnecessary /auth/refresh request that will only fail.
    if (readCookie('sessionHint') !== '1') {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ||= api.post('/auth/refresh', null, { _skipAuthRefresh: true })
        .then((response) => {
          if (response.data?.data?.authenticated === false) {
            clearSessionHint();
            throw new Error('Session expired');
          }
          return response;
        })
        .catch((refreshError) => {
          clearSessionHint();
          throw refreshError;
        })
        .finally(() => { refreshPromise = null; });

      await refreshPromise;
      return api(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export const getCsrfToken = () => api.get('/auth/csrf');
export default api;
