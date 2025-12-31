import type { UpdateUserDto } from '../types/updateUserDto';
import type { User } from '../types/user';
import api from './api';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/api/users`;

export default {
  async getAll(): Promise<User[]> {
    const result = await api.get(API_URL);
    return result.data;
  },

  async getById(id: string): Promise<User> {
    const result = await api.get(`${API_URL}/${id}`);
    return result.data;
  },

  async create(user: UpdateUserDto) {
    const result = await api.post(API_URL, user);
    return result.data;
  },

  async update(id: string, user: UpdateUserDto) {
    const result = await api.put(`${API_URL}/update/${id}`, user);
    return result.data;
  },

  async delete(id: string) {
    const result = await api.delete(`${API_URL}/${id}`);
    return result.data;
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const response = await api.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    return response.data;
  },

  async uploadProfilePhoto(userId: string, formData: FormData) {
    const response = await api.post(`${API_URL}/${userId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
