export type UserRole = 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string | null;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  owner_id: string | null;
  average_rating: number | null;
  my_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  user_id: string;
  store_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface RaterInfo {
  id: string;
  name: string;
  email: string;
  rating: number;
  created_at: string;
}

export interface OwnerDashboardData {
  store: Store | null;
  averageRating: number | null;
  raters: RaterInfo[];
}

export interface AdminDashboardData {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  path: string;
}