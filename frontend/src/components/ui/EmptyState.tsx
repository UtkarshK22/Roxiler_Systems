import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  message?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message = 'No data available',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-raised text-muted">
        {icon ?? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
            <path d="M4 8.5 12 13l8-4.5M12 13v7" />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-fg">{message}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
