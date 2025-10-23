import api from '../authentication/axiosInstance';
import type { UpdateUserDto } from '../types/updateUserDto';

const API_URL = 'http://localhost:5000/api/users';

export default {
  async getAll() {
    const result = await api.get(API_URL);
    return result.data;
  },

  async getById(id: string) {
    const result = await api.get(`${API_URL}/${id}`);
    return result.data;
  },

  async create(user: UpdateUserDto) {
    const result = await api.post(API_URL, user);
    return result.data;
  },

  async update(id: string, user: UpdateUserDto) {
    console.log(user);
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
};
