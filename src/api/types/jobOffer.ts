export interface JobOffer {
  id?: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string;
  employmentType: string;
  experience: string;
  contractType: string;
  salaryTo: number;
  salaryFrom: number;
  description: string;
  qualifications: string;
  benefits?: string;
  agreeRegulation: boolean;
  latitude?: number;
  longitude?: number;
}
