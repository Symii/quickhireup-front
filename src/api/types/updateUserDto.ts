export interface UpdateUserDto {
  firstName: string;
  secondName: string;
  email: string;
  bio?: string | null;

  companyName?: string | null;
  nip?: string | null;
  location?: string | null;
}
