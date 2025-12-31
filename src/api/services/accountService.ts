import { ref, computed } from 'vue';
import type { UserShort } from '../types/user';
import api from './api';
import { RoleName } from '@/constants/RoleNames';
const apiUrl = import.meta.env.VITE_API_URL;

const API_URL = `${apiUrl}/api/account`;

const currentUser = ref<UserShort | null>(null);
const isLoaded = ref(false);

export default {
  async fetchCurrentUser(): Promise<UserShort | null> {
    try {
      const result = await api.get(`${API_URL}/me`);
      currentUser.value = result.data;
      return currentUser.value;
    } catch (error) {
      currentUser.value = null;
      return null;
    } finally {
      isLoaded.value = true;
    }
  },

  getCurrentUser(): UserShort | null {
    return currentUser.value;
  },

  isAuthenticated(): boolean {
    return !!currentUser.value;
  },

  getRole(): string | null {
    return currentUser.value?.role ?? null;
  },

  isAdmin(): boolean {
    return currentUser.value?.role === RoleName.ADMIN;
  },

  isCompany(): boolean {
    return currentUser.value?.role === RoleName.COMPANY;
  },

  isCandidate(): boolean {
    return !currentUser.value || currentUser.value.role === RoleName.CANDIDATE;
  },

  isUserLoaded(): boolean {
    return isLoaded.value;
  },

  clearUser(): void {
    currentUser.value = null;
    isLoaded.value = false;
  },

  updateSettings(settings: {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    showProfile: boolean;
  }) {
    return api.put(`${API_URL}/settings`, settings);
  },
};
