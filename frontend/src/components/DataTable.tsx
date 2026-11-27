import React, { useState, useCallback } from 'react';

type SortDirection = 'ASC' | 'DESC';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSortChange?: (sortBy: string, order: SortDirection) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  total,
  page,
  limit,
  loading,
  onPageChange,
  onSortChange,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<string>('');
  const [order, setOrder] = useState<SortDirection>('ASC');

  const handleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
      } else {
        setSortBy(key);
        setOrder('ASC');
      }
      onSortChange?.(key, order === 'ASC' ? 'DESC' : 'ASC');
    },
    [sortBy, order, onSortChange],
  );

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="py-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-sm font-medium text-gray-600 border-b border-gray-200 ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <span className="ml-1">{order === 'ASC' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100"
                >
                  {col.render ? col.render(col.key, item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * limit + 1).toLocaleString()} to{' '}
            {Math.min(page * limit, total).toLocaleString()} of{' '}
            {total.toLocaleString()} results
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}