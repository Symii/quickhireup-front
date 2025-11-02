import type { JobOfferFilters } from '../types/filters/jobOfferFilters';
import type { JobOffer } from '../types/jobOffer';
import api from './api';

const API_URL = 'http://localhost:5000/api/joboffer';

export default {
  async getPaged(page: number, pageSize: number, filters: JobOfferFilters) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      keyword: filters.keyword ?? '',
      location: filters.location ?? '',
      type: filters.type ?? '',
      experience: filters.experience ?? '',
      sort: filters.sort ?? '',
      minSalary: filters.minSalary?.toString() ?? '',
      maxSalary: filters.maxSalary?.toString() ?? '',
      distance: filters.distance?.toString() ?? '',
      latitude: filters.latitude?.toString() ?? '',
      longitude: filters.longitude?.toString() ?? '',
    });

    const result = await api.get(`${API_URL}/paged?${params.toString()}`);
    return result.data;
  },

  async geocode(location: string) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  },

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
