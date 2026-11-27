import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { User } from '../types';
import { PlusIcon } from '../components/ui/icons';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin' },
  { value: 'NORMAL_USER', label: 'Normal User' },
  { value: 'STORE_OWNER', label: 'Store Owner' },
];

function truncated(value: unknown, maxWidth = '220px') {
  const text = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <span className="block truncate" style={{ maxWidth }} title={text}>
      {text}
    </span>
  );
}

export function AdminUsers() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  const { users, total, loading, error, fetchUsers } = useUsers();

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string, newOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy);
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

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: unknown) => truncated(value),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: unknown) => truncated(value, '240px'),
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (value: unknown) => truncated(value, '260px'),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (_value: unknown, item: User) => <Badge role={item.role} />,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      headerClassName: 'w-16',
      render: (_value: unknown, item: User) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/admin/users/${item.id}`);
          }}
          className="rounded text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Users"
        subtitle="Manage system administrators, store owners and normal users."
        backTo="/admin"
        backLabel="Back to dashboard"
        actions={
          <Link to="/admin/users/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add User
          </Link>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      <FilterBar
        fields={[
          { key: 'name', label: 'Name', placeholder: 'Filter by name' },
          { key: 'email', label: 'Email', placeholder: 'Filter by email' },
          { key: 'address', label: 'Address', placeholder: 'Filter by address' },
          {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: ROLE_OPTIONS,
          },
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
        initialSortBy={sortBy}
        initialOrder={order}
        onRowClick={(item) => navigate(`/admin/users/${item.id}`)}
        emptyMessage="No users match your filters"
        emptyDescription="Try clearing the search fields or choosing a different role."
      />
    </div>
  );
}
