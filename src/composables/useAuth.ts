import { ref } from 'vue';
import type { UserLoginDto, UserRegisterDto } from '@/api/authentication/types/auth';
import router from '@/router';
import { login, register } from '@/api/authentication/services/authService';
import {
  saveTokens,
  clearTokens,
  getToken,
  refreshTokenRequest,
  logoutRequest,
} from '@/api/authentication/services/tokenService';
import axiosInstance from '@/api/authentication/axiosInstance';
import * as jwtService from '@/api/authentication/services/jwtService';
import axios from 'axios';

const tokenKey = 'token';
const refreshTokenKey = 'refreshToken';

const token = ref<string | null>(localStorage.getItem(tokenKey));
const refreshToken = ref<string | null>(localStorage.getItem(refreshTokenKey));
const error = ref<string | null>(null);
const loading = ref(false);
const isLoggedIn = ref(!!token.value);
const authIsReady = ref(false);

let refreshInterval: any = null;

async function handleLogin(credentials: UserLoginDto) {
  loading.value = true;
  error.value = null;
  try {
    const response = await login(credentials);
    saveTokens(response.token, response.refreshToken);
    isLoggedIn.value = true;
    router.push('/');
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        error.value = 'Brak połączenia z serwerem. Sprawdź połączenie sieciowe.';
      } else if (e.response?.status === 400) {
        error.value = 'Niepoprawne dane logowania.';
      } else if (e.response?.status === 401) {
        error.value = 'Nieautoryzowany dostęp. Sprawdź swoje dane.';
      } else {
        error.value = e.response?.data?.message || 'Wystąpił błąd podczas logowania.';
      }
    } else if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = 'Nieznany błąd';
    }
    throw e;
  } finally {
    loading.value = false;
  }
}

async function handleRegister(data: UserRegisterDto) {
  loading.value = true;
  error.value = null;
  try {
    await register(data);
    router.push('/login');
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        error.value = 'Brak połączenia z serwerem. Sprawdź połączenie sieciowe.';
      } else if (e.response?.status === 400) {
        if (Array.isArray(e.response?.data?.errors)) {
          error.value = e.response.data.errors.join('; ');
        } else {
          error.value = 'Niepoprawne dane rejestracji.';
        }
      } else if (e.response?.status === 409) {
        error.value = 'Konto o podanym adresie email już istnieje.';
      } else {
        error.value = e.response?.data?.message || 'Wystąpił błąd podczas rejestracji.';
      }
    } else if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = 'Nieznany błąd';
    }
    throw e;
  } finally {
    loading.value = false;
  }
}

async function logout() {
  try {
    await logoutRequest();
    isLoggedIn.value = false;
    router.push('/login');
  } catch (error: any) {
    console.error('Błąd podczas wylogowywania:', error);
    clearTokens();
    router.push('/login');
  }
}

async function initAuth() {
  const storedToken = localStorage.getItem('token');
  console.log('Stored token:', storedToken);

  if (!storedToken || isTokenExpired(storedToken)) {
    console.log('Token missing or expired, clearing tokens');
    clearTokens();
    isLoggedIn.value = false;
    router.push('/login');
    authIsReady.value = true;
    return;
  }

  try {
    console.log('Wysyłam żądanie do /account/me z tokenem:', storedToken);
    const response = await axiosInstance.get('/account/me');
    console.log('Odpowiedź z backendu:', response);
    isLoggedIn.value = true;

    setupTokenRefresh(storedToken);
  } catch (err: any) {
    console.log('Błąd w axios get /account/me:', err);
    clearTokens();
    isLoggedIn.value = false;
    router.push('/login');
  } finally {
    authIsReady.value = true;
  }
}

function setupTokenRefresh(token: string | null) {
  if (!token) return;

  const expirationTime = jwtService.getTokenExpirationTime(token);
  if (!expirationTime) return;

  const refreshTime = expirationTime - 5 * 60 * 1000;
  const timeUntilRefresh = refreshTime - Date.now();

  if (timeUntilRefresh > 0) {
    if (refreshInterval) {
      clearTimeout(refreshInterval);
    }

    refreshInterval = setTimeout(async () => {
      try {
        await refreshTokenRequest();
        setupTokenRefresh(getToken());
      } catch (error: any) {
        console.error('Nie udało się odświeżyć tokenu:', error);
        setTimeout(() => setupTokenRefresh(getToken()), 10000);
      }
    }, timeUntilRefresh);
  }
}

function isTokenExpired(token: string | null): boolean {
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

export function useAuth() {
  return {
    token,
    refreshToken,
    error,
    loading,
    isLoggedIn,
    authIsReady,
    initAuth,
    logout,
    handleLogin,
    handleRegister,
  };
}
