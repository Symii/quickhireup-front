import * as authService from '@/api/authentication/services/authService';

const tokenKey = 'token';
const refreshTokenKey = 'refreshToken';

export function getToken(): string | null {
  return localStorage.getItem(tokenKey);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(refreshTokenKey);
}

export function saveTokens(token: string, refreshToken: string) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(refreshTokenKey, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
}

export async function refreshTokenRequest(): Promise<string> {
  const token = getToken();
  const refreshToken = getRefreshToken();
  if (!token || !refreshToken) {
    throw new Error('No token to refresh');
  }

  const response = await authService.refreshToken({ token, refreshToken });
  saveTokens(response.token, response.refreshToken);
  return response.token;
}
