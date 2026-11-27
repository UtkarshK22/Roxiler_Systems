import React from 'react';
import { UserRole } from '../../types';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'indigo' | 'teal' | 'slate' | 'emerald' | 'rose' | 'amber';

const variantClasses: Record<BadgeVariant, string> = {
  indigo:
    'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300',
  teal: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-300',
  slate:
    'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300',
  amber:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: 'System Admin',
  STORE_OWNER: 'Store Owner',
  NORMAL_USER: 'Normal User',
};

export const ROLE_VARIANTS: Record<UserRole, BadgeVariant> = {
  SYSTEM_ADMIN: 'indigo',
  STORE_OWNER: 'teal',
  NORMAL_USER: 'slate',
};

interface BadgeProps {
  variant?: BadgeVariant;
  role?: UserRole;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant, role, className, children }: BadgeProps) {
  const resolvedVariant = variant ?? (role ? ROLE_VARIANTS[role] : 'slate');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[resolvedVariant],
        className,
      )}
    >
      {children ?? (role ? ROLE_LABELS[role] : null)}
    </span>
  );
}
