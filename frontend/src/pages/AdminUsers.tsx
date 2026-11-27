import React, { useState, useEffect, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { User } from '../types';

export function AdminUsers() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    total,
    loading,
    error,
    fetchUsers,
    createUser,
  } = useUsers();

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string, newOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy as any);
    setOrder(newOrder);
  }, []);

  useEffect(() => {
    fetchUsers({
      ...filters,
      page,
      limit: 10,
      sortBy,
      order,
    });
  }, [filters, page, sortBy, order, fetchUsers]);

  const handleCreate = async (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => {
    try {
      await createUser(data);
      setShowAddForm(false);
      fetchUsers({
        ...filters,
        page,
        limit: 10,
        sortBy,
        order,
      });
    } catch (err: any) {
      // Error handled in hook
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Manage system users (normal users and admins)
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
        >
          + Add User
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
          { key: 'role', label: 'Role', placeholder: 'Filter by role' },
        ]}
        onFiltersChange={handleFiltersChange}
      />

      <DataTable
        data={users}
        columns={columns}
        total={total}
        page={page}
        limit={10}
        loading={loading}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        emptyMessage="No users found"
      />

      {showAddForm && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
          <AddUserForm onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {selectedUser && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-600">{selectedUser.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-600">{selectedUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Address:</span>
              <span className="text-gray-600">{selectedUser.address || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Role:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedUser.role === 'SYSTEM_ADMIN'
                  ? 'bg-red-100 text-red-700'
                  : selectedUser.role === 'STORE_OWNER'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                {selectedUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function AddUserForm({ onSubmit, onCancel }: { onSubmit: any; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'NORMAL_USER' as const,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', email: '', address: '', password: '', role: 'NORMAL_USER' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name (20-60 chars)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
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
        <label className="text-sm font-medium text-gray-700">Password (8-16 chars, 1 uppercase, 1 special)</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="NORMAL_USER">Normal User</option>
          <option value="SYSTEM_ADMIN">System Administrator</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 transition"
        >
          {submitting ? 'Creating...' : 'Create User'}
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