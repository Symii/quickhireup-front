import { RoleName } from '@/constants/RoleNames';

export default {
  userRoleToString(role: string): string {
    switch (role) {
      case RoleName.ADMIN:
        return 'Adminstrator';
      case RoleName.COMPANY:
        return 'Firma';
      case RoleName.CANDIDATE:
        return 'Kandydat';
      default:
        return 'Kandydat';
    }
  },
};
