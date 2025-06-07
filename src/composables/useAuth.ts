import { ref } from 'vue';
import type { UserLoginDto, UserRegisterDto, TokenResponse } from '@/api/authentication/types/auth';
import router from '@/router';
import * as authService from '@/api/authentication/services/authService';
import axios from 'axios';
import axiosInstance from '@/api/authentication/axiosInstance';

const tokenKey = 'token';
const refreshTokenKey = 'refreshToken';

const token = ref<string | null>(localStorage.getItem(tokenKey));
const refreshToken = ref<string | null>(localStorage.getItem(refreshTokenKey));
const error = ref<string | null>(null);
const loading = ref(false);
const isLoggedIn = ref(!!token.value);
const authIsReady = ref(false);

function saveTokens(newToken: string, newRefreshToken: string) {
  token.value = newToken;
  refreshToken.value = newRefreshToken;
  localStorage.setItem(tokenKey, newToken);
  localStorage.setItem(refreshTokenKey, newRefreshToken);
  isLoggedIn.value = true;
}

function clearTokens() {
  token.value = null;
  refreshToken.value = null;
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
  isLoggedIn.value = false;
}

async function login(credentials: UserLoginDto) {
  loading.value = true;
  error.value = null;
  try {
    const response = await authService.login(credentials);
    saveTokens(response.token, response.refreshToken);
    router.push('/');
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        error.value = 'Brak połączenia z serwerem. Sprawdź połączenie sieciowe.';
      } else if (e.response.status === 400) {
        error.value = 'Niepoprawne dane logowania.';
      } else if (e.response.status === 401) {
        error.value = 'Nieautoryzowany dostęp. Sprawdź swoje dane.';
      } else {
        error.value = e.response.data?.message || 'Wystąpił błąd podczas logowania.';
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

async function register(data: UserRegisterDto) {
  loading.value = true;
  error.value = null;
  try {
    await authService.register(data);
    router.push('/login');
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        error.value = 'Brak połączenia z serwerem. Sprawdź połączenie sieciowe.';
      } else if (e.response.status === 400) {
        if (Array.isArray(e.response.data.errors)) {
          error.value = e.response.data.errors.join('; ');
        } else {
          error.value = 'Niepoprawne dane rejestracji.';
        }
      } else if (e.response.status === 409) {
        error.value = 'Konto o podanym adresie email już istnieje.';
      } else {
        error.value = e.response.data?.message || 'Wystąpił błąd podczas rejestracji.';
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
  clearTokens();
  router.push('/login');
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
    const response = await axiosInstance.get('/account/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    console.log('Odpowiedź z backendu:', response);
    isLoggedIn.value = true;
  } catch (err) {
    console.log('Błąd w axios get /account/me:', err);
    clearTokens();
    isLoggedIn.value = false;
    router.push('/login');
  } finally {
    authIsReady.value = true;
  }
}

function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const exp = payload.exp;

  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return exp < now;
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
    login,
    register,
    logout,
  };
}
