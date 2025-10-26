import api from '../authentication/axiosInstance';
import type { JobOffer } from '../types/jobOffer';

const API_URL = 'http://localhost:5000/api/joboffer';

export default {
  async getAll(): Promise<JobOffer[]> {
    const result = await api.get(API_URL);
    return result.data;
  },

  async getTotalCount(): Promise<number> {
    const result = await api.get(`${API_URL}/totalCount`);
    return result.data;
  },

  async getRandom(limit: number): Promise<JobOffer[]> {
    const result = await api.get(`${API_URL}/random/${limit}`);
    return result.data;
  },

  async getById(id: string): Promise<JobOffer> {
    const result = await api.get(`${API_URL}/${id}`);
    return result.data;
  },

  async create(jobOffer: JobOffer) {
    const result = await api.post(API_URL, jobOffer);
    return result.data;
  },

  async update(id: string, jobOffer: JobOffer) {
    const result = await api.put(`${API_URL}/update/${id}`, jobOffer);
    return result.data;
  },

  async delete(id: string) {
    const result = await api.delete(`${API_URL}/${id}`);
    return result.data;
  },
};
