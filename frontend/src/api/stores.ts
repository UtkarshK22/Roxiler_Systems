import axiosInstance from './axiosInstance';
import { Store } from '../types';

export const storesAPI = {
  getAll: (params?: {
    name?: string;
    email?: string;
    address?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) =>
    axiosInstance.get<{
      stores: Store[];
      total: number;
      page: number;
      limit: number;
    }>('/stores', { params }),

  getAllAdmin: (params?: {
    name?: string;
    email?: string;
    address?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) =>
    axiosInstance.get<{
      stores: Store[];
      total: number;
      page: number;
      limit: number;
    }>('/stores/admin', { params }),

  create: (data: {
    name: string;
    email: string;
    address: string;
    owner_id: string;
  }) => axiosInstance.post<Store>('/stores', data),

  upsertRating: (storeId: string, rating: number) =>
    axiosInstance.post(`/stores/${storeId}/rating`, { rating }),
};