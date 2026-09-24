
import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const readCookie = (name) => {
  const row = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return row
    ? decodeURIComponent(row.split('=').slice(1).join('='))
    : null;
};

const clearSessionHint = () => {
  document.cookie = 'sessionHint=; Max-Age=0; Path=/';
};

/*
|--------------------------------------------------------------------------
  CSRF
|--------------------------------------------------------------------------
*/

let csrfPromise = null;

export const getCsrfToken = async () => {
  const response = await api.get('/auth/csrf');

  return response.data?.data?.csrfToken || readCookie('csrfToken');
};

export const ensureCsrfToken = async () => {
  // Already available
  const existingToken = readCookie('csrfToken');

  if (existingToken) {
    return existingToken;
  }

  // Prevent multiple simultaneous CSRF requests
  if (!csrfPromise) {
    csrfPromise = getCsrfToken().finally(() => {
      csrfPromise = null;
    });
  }

  return csrfPromise;
};

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  async (config) => {
    const method = String(config.method || 'get').toUpperCase();

    config.headers = config.headers || {};

    config.headers['X-Client-Request-Id'] ||=
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random()}`;

    /*
    |--------------------------------------------------------------------------
    | Add CSRF token to state-changing requests
    |--------------------------------------------------------------------------
    */

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrfToken = await ensureCsrfToken();

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response / Token Refresh
|--------------------------------------------------------------------------
*/

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';

    const isAuthEndpoint =
      /\/auth\/(login|register|refresh|logout|csrf|session|forgot-password|reset-password)/.test(
        url
      );

    if (
      status !== 401 ||
      !original ||
      original._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    /*
    |--------------------------------------------------------------------------
    | Don't refresh if there is no session
    |--------------------------------------------------------------------------
    */

    if (readCookie('sessionHint') !== '1') {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ||= api
        .post('/auth/refresh', null, {
          _skipAuthRefresh: true,
        })
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
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;

      return api(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;