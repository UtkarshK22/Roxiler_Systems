import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { PageHeader } from '../components/ui/PageHeader';
import { StarRating } from '../components/ui/StarRating';
import { Store } from '../types';
import { PlusIcon } from '../components/ui/icons';

function truncated(value: unknown, maxWidth = '240px') {
  const text = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <span className="block truncate" style={{ maxWidth }} title={text}>
      {text}
    </span>
  );
}

export function AdminStores() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>(
    searchParams.get('order') === 'DESC' ? 'DESC' : 'ASC',
  );

  const { stores, total, loading, error, fetchStores } = useStores();

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string, newOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy);
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
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (value: unknown) => truncated(value),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: unknown) => truncated(value, '230px'),
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (value: unknown) => truncated(value, '260px'),
    },
    {
      key: 'average_rating',
      label: 'Rating',
      sortable: true,
      render: (_value: unknown, item: Store) =>
        item.average_rating !== null && item.average_rating !== undefined ? (
          <span className="inline-flex items-center gap-2">
            <StarRating value={Math.round(item.average_rating)} readOnly size="sm" />
            <span className="text-sm font-semibold text-fg">
              {item.average_rating.toFixed(2)}
            </span>
          </span>
        ) : (
          <span className="text-sm text-muted">No ratings yet</span>
        ),
    },
  ];

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Stores"
        subtitle="Every registered store with its average customer rating."
        backTo="/admin"
        backLabel="Back to dashboard"
        actions={
          <Link to="/admin/stores/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Store
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
          { key: 'name', label: 'Name', placeholder: 'Filter by store name' },
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
        initialSortBy={sortBy}
        initialOrder={order}
        emptyMessage="No stores match your filters"
        emptyDescription="Try clearing the search fields."
      />
    </div>
  );
}
