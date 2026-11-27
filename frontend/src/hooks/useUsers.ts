import { useState, useCallback } from 'react';
import { usersAPI } from '../api/users';
import { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (params?: {
      name?: string;
      email?: string;
      address?: string;
      role?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: 'ASC' | 'DESC';
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersAPI.getAll(params);
        setUsers(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createUser = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      address: string;
      role: string;
    }) => {
      try {
        const response = await usersAPI.create(data);
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create user');
        throw err;
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (data: {
      current_password: string;
      new_password: string;
    }) => {
      try {
        await usersAPI.changePassword(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to change password');
        throw err;
      }
    },
    [],
  );

  return {
    users,
    total,
    loading,
    error,
    fetchUsers,
    createUser,
    changePassword,
  };
}