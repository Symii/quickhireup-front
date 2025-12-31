import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${apiUrl}/api`,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalConfig = error.config;

    if (!originalConfig || originalConfig._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { useAuthStore } = await import('@/api/authentication/authStore');
        const auth = useAuthStore();

        originalConfig._retry = true;
        await auth.refreshTokens();

        const newToken = localStorage.getItem('token');
        if (newToken) {
          originalConfig.headers = originalConfig.headers ?? {};
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalConfig);
      } catch {
        const { useAuthStore } = await import('@/api/authentication/authStore');
        const auth = useAuthStore();
        auth.logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
