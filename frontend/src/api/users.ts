import axiosInstance from './axiosInstance';
import { OwnerStoreRating, User, UserListResponse } from '../types';

export const usersAPI = {
  getAll: (params?: {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) =>
    axiosInstance.get<UserListResponse>('/admin/users', { params }),

  getById: (id: string) => axiosInstance.get<User>(`/admin/users/${id}`),

  getOwnerStoreRating: (id: string) =>
    axiosInstance.get<OwnerStoreRating>(`/admin/users/${id}/store-rating`),

  create: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => axiosInstance.post<User>('/admin/users', data),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => axiosInstance.post<{ message: string }>('/admin/users/password', data),
};