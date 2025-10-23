import api from '../authentication/axiosInstance';
import type { UserShort } from '../types/user';

const API_URL = 'http://localhost:5000/api/account';

export default {
  async getCurrentUser(): Promise<UserShort> {
    const result = await api.get(`${API_URL}/me`);
    return result.data;
  },
};
