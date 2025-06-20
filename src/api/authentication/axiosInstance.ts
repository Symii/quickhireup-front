import axios from 'axios';
import {
  getToken,
  refreshTokenRequest,
  clearTokens,
} from '@/api/authentication/services/tokenService';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7184/api',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      console.log('Adding token to request:', token.substring(0, 10) + '...');
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];
let retryCount = 0;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            if (retryCount < 3) {
              retryCount++;
              return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
                axiosInstance(originalRequest),
              );
            }
            processQueue(err, null);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      retryCount = 0;

      try {
        const newToken = await refreshTokenRequest();
        originalRequest.headers.Authorization = 'Bearer ' + newToken;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token!);
  });
  failedQueue = [];
}

export default axiosInstance;
