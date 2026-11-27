import React from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  error?: string;
  helper?: React.ReactNode;
  counter?: { value: number; max: number };
  required?: boolean;
  showMessage?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Label + control + a footer line that is always reserved so validation
 * messages never shift the layout. Counter is right-aligned in that footer.
 */
export function FormField({
  label,
  htmlFor,
  error,
  helper,
  counter,
  required,
  showMessage = true,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-fg">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {showMessage && (
        <div className="mt-1.5 flex min-h-[18px] items-start justify-between gap-2">
          <p
            id={error && htmlFor ? `${htmlFor}-error` : undefined}
            className={cn(
              'text-xs leading-4',
              error ? 'text-rose-600 dark:text-rose-400' : 'text-muted',
            )}
          >
            {error || helper || '\u00A0'}
          </p>
          {counter && (
            <span
              className={cn(
                'shrink-0 text-xs leading-4 tabular-nums',
                counter.value > counter.max
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-muted',
              )}
            >
              {counter.value}/{counter.max}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
