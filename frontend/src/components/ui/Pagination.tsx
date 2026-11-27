import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function buildPageItems(current: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) items.push('ellipsis');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push('ellipsis');
  items.push(totalPages);
  return items;
}

export function Pagination({ page, total, limit, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-xs text-muted sm:text-sm">
        Showing <span className="font-medium text-fg">{from.toLocaleString()}</span> to{' '}
        <span className="font-medium text-fg">{to.toLocaleString()}</span> of{' '}
        <span className="font-medium text-fg">{total.toLocaleString()}</span> results
      </p>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        {buildPageItems(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors',
                item === page
                  ? 'border-primary-strong bg-primary-strong text-white'
                  : 'border-line bg-surface text-fg hover:bg-raised',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
