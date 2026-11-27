import { UserRole } from '../types';

/** Where each role lands after login / from a "home" button. */
export function homeForRole(role?: string): string {
  if (role === 'SYSTEM_ADMIN') return '/admin';
  if (role === 'STORE_OWNER') return '/owner';
  return '/stores';
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: 'System Admin',
  STORE_OWNER: 'Store Owner',
  NORMAL_USER: 'Normal User',
};
