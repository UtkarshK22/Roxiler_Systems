import React, { useState, useEffect, useCallback } from 'react';
import { useStores } from '../hooks/useStores';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { Store } from '../types';

export function AdminStores() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    stores,
    total,
    loading,
    error,
    fetchStores,
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
      admin: true,
    });
  }, [filters, page, sortBy, order, fetchStores]);

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'average_rating',
      label: 'Avg Rating',
      sortable: true,
      render: (_key: string, item: Store) =>
        item.average_rating !== null ? item.average_rating.toFixed(2) : 'No ratings yet',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-gray-600">
            Manage all registered stores
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
        >
          + Add Store
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
          {error}
        </div>
      )}

      <FilterBar
        fields={[
          { key: 'name', label: 'Name', placeholder: 'Filter by name' },
          { key: 'email', label: 'Email', placeholder: 'Filter by email' },
          { key: 'address', label: 'Address', placeholder: 'Filter by address' },
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

      {showAddForm && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Store</h3>
          <AddStoreForm onCancel={() => setShowAddForm(false)} />
        </div>
      )}
    </div>
  );

function AddStoreForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: '',
  });
  const [owners, setOwners] = useState<Array<{ id: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      onCancel();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Store Name (20-60 chars)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Store Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Address (max 400 chars)</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Owner (select STORE_OWNER)</label>
        <select
          value={formData.owner_id}
          onChange={(e) => handleChange('owner_id', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Select an owner...</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50 transition"
        >
          {submitting ? 'Creating...' : 'Create Store'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 border border-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
}