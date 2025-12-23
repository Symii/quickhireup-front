export const RoleName = {
  ADMIN: 'Admin',
  COMPANY: 'Company',
  CANDIDATE: 'Candidate',
} as const;

export type RoleName = (typeof RoleName)[keyof typeof RoleName];
