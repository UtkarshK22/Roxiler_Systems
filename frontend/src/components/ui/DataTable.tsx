import React, { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { Skeleton } from './Skeleton';
import { SortIcon } from './icons';

export type SortDirection = 'ASC' | 'DESC';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSortChange?: (sortBy: string, order: SortDirection) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  rowKey?: (item: T, index: number) => React.Key;
  initialSortBy?: string;
  initialOrder?: SortDirection;
  loadingRows?: number;
  caption?: string;
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
  emptyDescription,
  onRowClick,
  rowKey,
  initialSortBy = '',
  initialOrder = 'ASC',
  loadingRows = 5,
  caption,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState<SortDirection>(initialOrder);

  const handleSort = useCallback(
    (key: string) => {
      const nextOrder: SortDirection =
        sortBy === key ? (order === 'ASC' ? 'DESC' : 'ASC') : 'ASC';
      setSortBy(key);
      setOrder(nextOrder);
      onSortChange?.(key, nextOrder);
    },
    [sortBy, order, onSortChange],
  );

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, item: T) => {
    if (!onRowClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(item);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] border-collapse text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="sticky top-0 z-10 bg-raised">
            <tr>
              {columns.map((column) => {
                const isSorted = sortBy === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? isSorted
                          ? order === 'ASC'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    className={cn(
                      'whitespace-nowrap border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted',
                      column.headerClassName,
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="inline-flex items-center gap-1.5 rounded text-left transition-colors hover:text-fg"
                      >
                        {column.label}
                        <SortIcon
                          className="h-3.5 w-3.5"
                          direction={isSorted ? order : null}
                        />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading
              ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((item, index) => (
                  <tr
                    key={rowKey ? rowKey(item, index) : (item.id ?? index)}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    onKeyDown={
                      onRowClick ? (event) => handleRowKeyDown(event, item) : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    role={onRowClick ? 'button' : undefined}
                    className={cn(
                      'transition-colors duration-150 hover:bg-raised',
                      onRowClick && 'cursor-pointer',
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn('px-4 py-3 text-sm text-fg', column.className)}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState message={emptyMessage} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && data.length > 0 && (
        <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} />
      )}
    </div>
  );
}
