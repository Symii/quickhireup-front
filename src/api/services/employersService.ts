import api from '../authentication/axiosInstance';
const API_URL = 'http://localhost:5000/api/employers';

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
