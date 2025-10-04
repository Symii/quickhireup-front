import axios from 'axios';
import type { TokenResponse } from '@/api/authentication/types/auth';
import * as jwtService from '@/api/authentication/services/jwtService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

const tokenKey = 'token';
const refreshTokenKey = 'refreshToken';

export function getToken(): string | null {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtService.decodeToken(token);
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(refreshTokenKey);
}

export function saveTokens(token: string, refreshToken: string): void {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(refreshTokenKey, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return true;
  }
}

export async function refreshTokenRequest(): Promise<string> {
  const refreshToken = getRefreshToken();
  const accessToken = getToken();

  if (!refreshToken || !accessToken) {
    throw new Error('Brak wymaganych tokenów');
  }

  try {
    const response = await axiosInstance.post<TokenResponse>('/account/refresh-token', {
      token: accessToken,
      refreshToken,
    });

    if (!response.data?.token) {
      throw new Error('Nie otrzymano nowego tokenu');
    }

    saveTokens(response.data.token, response.data.refreshToken);
    return response.data.token;
  } catch (error) {
    console.error('Błąd podczas odświeżania tokenu:', error);
    clearTokens();
    throw error;
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    const token = getToken();
    if (!token) {
      console.error('Brak tokenu przy wylogowywaniu');
      clearTokens();
      return;
    }

    const refreshToken = localStorage.getItem(refreshTokenKey);
    if (refreshToken) {
      try {
        await refreshTokenRequest();
      } catch (refreshError) {
        console.error('Nie udało się odświeżyć tokenu:', refreshError);
      }
    }

    await axiosInstance.post(
      '/account/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error('Błąd podczas wylogowywania z serwera:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Token wygasł lub jest nieprawidłowy');
    }
  } finally {
    clearTokens();
  }
}
