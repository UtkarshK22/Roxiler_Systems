import axiosInstance from './axiosInstance';
import { AdminDashboardData, OwnerDashboardData } from '../types';

export const dashboardAPI = {
  getAdminDashboard: () =>
    axiosInstance.get<AdminDashboardData>('/admin/dashboard'),

  getOwnerDashboard: () =>
    axiosInstance.get<OwnerDashboardData>('/owner/dashboard'),
};