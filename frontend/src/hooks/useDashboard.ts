import { useState, useCallback } from 'react';
import { dashboardAPI } from '../api/dashboard';
import { AdminDashboardData, OwnerDashboardData } from '../types';

export function useDashboard() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardAPI.getAdminDashboard();
      setAdminData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOwnerDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardAPI.getOwnerDashboard();
      setOwnerData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch owner dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adminData,
    ownerData,
    loading,
    error,
    fetchAdminDashboard,
    fetchOwnerDashboard,
  };
}