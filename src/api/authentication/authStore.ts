import api from '@/api/services/api';
import type { User } from '@/api/types/user';
import { defineStore } from 'pinia';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: null,
  }),

  actions: {
    async login(email: string, password: string) {
      const result = await api.post<{ token: string; refreshToken: string }>('/account/login', {
        email,
        password,
      });

      this.token = result.data.token;
      this.refreshToken = result.data.refreshToken;

      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${this.token}`;

      await this.fetchCurrentUser();
    },

    async fetchCurrentUser() {
      if (!this.token) return;
      try {
        const res = await api.get<User>('/account/me');
        this.user = res.data;
      } catch {
        this.logout();
      }
    },

    async refreshTokens() {
      if (!this.refreshToken) throw new Error('No refresh token');

      const result = await api.post<{ token: string; refreshToken: string }>(
        '/account/refresh-token',
        {
          token: this.token,
          refreshToken: this.refreshToken,
        },
      );

      this.token = result.data.token;
      this.refreshToken = result.data.refreshToken;

      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common.Authorization;
    },

    async register(userName: string, email: string, password: string) {
      await api.post<unknown>('/account/register', {
        userName,
        email,
        password,
      });
    },

    async registerCompany(companyName: string, nip: string, email: string, password: string) {
      await api.post('/account/register-company', {
        companyName,
        nip,
        email,
        password,
      });
    },

    async verifyEmail(userId: string, token: string) {
      try {
        await api.get(`/Account/confirm-email?userId=${userId}&token=${token}`);
      } catch (error) {
        throw error;
      }
    },

    async resendConfirmation(email: string) {
      try {
        await api.post('/Account/resend-confirmation-email', { email });
      } catch (error) {
        throw error;
      }
    },
  },
});
