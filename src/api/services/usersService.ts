import axios from 'axios';
import type { UpdateUserDto } from '../types/updateUserDto';

const API_URL = 'http://localhost:5000/api/users';

export default {
  async getAll() {
    const result = await axios.get(API_URL);
    return result.data;
  },

  async getById(id: string) {
    const result = await axios.get(`${API_URL}/${id}`);
    return result.data;
  },

  async create(user: UpdateUserDto) {
    const result = await axios.post(API_URL, user);
    return result.data;
  },

  async update(id: string, user: UpdateUserDto) {
    console.log(user);
    const result = await axios.put(`${API_URL}/update/${id}`, user);
    return result.data;
  },

  async delete(id: string) {
    const result = await axios.delete(`${API_URL}/${id}`);
    return result.data;
  },
};
