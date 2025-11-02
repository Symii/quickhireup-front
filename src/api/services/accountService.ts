import type { UserShort } from '../types/user';
import api from './api';

const API_URL = 'http://localhost:5000/api/account';

export default {
  async getCurrentUser(): Promise<UserShort> {
    const result = await api.get(`${API_URL}/me`);
    return result.data;
  },
};
