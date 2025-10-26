export interface JobOffer {
  id?: string;
  jobTitle: string;
  company: string;
  location: string;
  employmentType: string;
  experience: string;
  contractType: string;
  salary: string;
  description: string;
  qualifications: string;
  benefits?: string;
  agreeRegulation: boolean;
}
