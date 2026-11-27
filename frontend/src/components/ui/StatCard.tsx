import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Skeleton } from './Skeleton';
import { ArrowRightIcon } from './icons';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  hint?: string;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  href,
  hint,
  loading = false,
  className,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-9 w-20" />
          ) : (
            <p className="mt-1 text-3xl font-bold tracking-tight text-fg">{value}</p>
          )}
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-primary-soft text-primary">
            {icon}
          </span>
        )}
      </div>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary-hover">
          View all
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      )}
    </>
  );

  const baseClasses = cn(
    'group block rounded-xl border border-line bg-surface p-6 shadow-card transition-colors duration-150',
    href && 'hover:border-primary hover:bg-raised',
    className,
  );

  if (href) {
    return (
      <Link to={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
