import React, { useState, useEffect, useCallback } from 'react';
import { useStores } from '../hooks/useStores';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StarRating } from '../components/StarRating';
import { Store } from '../types';
import { useAuth } from '../context/AuthContext';

export function UserStores() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [editingRating, setEditingRating] = useState<{ storeId: string; rating: number } | null>(null);

  const { user } = useAuth();
  const {
    stores,
    total,
    loading,
    error,
    fetchStores,
    upsertRating,
  } = useStores();

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string, newOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy as any);
    setOrder(newOrder);
  }, []);

  useEffect(() => {
    fetchStores({
      ...filters,
      page,
      limit: 10,
      sortBy,
      order,
    });
  }, [filters, page, sortBy, order, fetchStores]);

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    setEditingRating({ storeId, rating });
    try {
      await upsertRating(storeId, rating);
    } catch (err: any) {
      // Error handled in hook
    } finally {
      setEditingRating(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'average_rating',
      label: 'Overall Rating',
      sortable: true,
      render: (_key: string, item: Store) =>
        item.average_rating !== null ? item.average_rating.toFixed(2) : 'No ratings yet',
    },
    {
      key: 'my_rating',
      label: 'Your Rating',
      sortable: false,
      render: (_key: string, item: Store) => (
        <div className="flex items-center gap-4">
          {item.my_rating !== null ? (
            <span className="text-sm font-medium text-gray-700">You rated: {item.my_rating}</span>
          ) : (
            <span className="text-sm text-gray-400">Not rated</span>
          )}
          <StarRating
            value={item.my_rating || 0}
            onChange={(val) => handleRatingSubmit(item.id, val)}
            disabled={editingRating?.storeId === item.id}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Stores</h1>
          <p className="text-gray-600">
            Browse stores and submit your ratings (1-5 stars)
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
          {error}
        </div>
      )}

      <FilterBar
        fields={[
          { key: 'name', label: 'Name', placeholder: 'Search by store name' },
          { key: 'address', label: 'Address', placeholder: 'Search by address' },
        ]}
        onFiltersChange={handleFiltersChange}
      />

      <DataTable
        data={stores}
        columns={columns}
        total={total}
        page={page}
        limit={10}
        loading={loading}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        emptyMessage="No stores found"
      />
    </div>
  );
}