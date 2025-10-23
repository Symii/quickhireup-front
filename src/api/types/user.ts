export interface User {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  photoUrl: string;
  bio: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;

  role: string;
  cvs: CV[];
  firstName: string;
  secondName: string;
  refreshToken?: string | null;
  refreshTokenExpiryTime: string;
}

export interface CV {
  id: string;
}

export interface UserShort {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  role: string;
  bio: string;
  photoUrl: string;
}
