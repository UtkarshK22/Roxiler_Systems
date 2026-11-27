import { useState, useCallback } from 'react';
import { storesAPI } from '../api/stores';
import { Store } from '../types';

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(
    async (params?: {
      name?: string;
      email?: string;
      address?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: 'ASC' | 'DESC';
      admin?: boolean;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = params?.admin
          ? await storesAPI.getAllAdmin(params)
          : await storesAPI.getAll(params);
        setStores(response.data.stores);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const upsertRating = useCallback(
    async (storeId: string, rating: number) => {
      try {
        await storesAPI.upsertRating(storeId, rating);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit rating');
        throw err;
      }
    },
    [],
  );

  return { stores, total, loading, error, fetchStores, upsertRating };
}