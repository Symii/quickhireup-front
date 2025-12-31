import api from './api';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/api/employers`;

export default {
  async getAll() {
    const result = await api.get(API_URL);
    return result.data;
  },

  async getById(id: string) {
    const result = await api.get(`${API_URL}/${id}`);
    return result.data;
  },
};
