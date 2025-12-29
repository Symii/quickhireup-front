export interface JobOfferFilters {
  keyword: string;
  location: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
  distance: string;
  experience: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  sort?: 'newest' | 'oldest' | 'salaryAsc' | 'salaryDesc' | '';
  onlyMyOffers?: string;
}
