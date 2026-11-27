import React from 'react';
import { cn } from '../../utils/cn';
import { FormField } from './FormField';
import { ChevronDownIcon } from './icons';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helper?: React.ReactNode;
  showMessage?: boolean;
  containerClassName?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    helper,
    showMessage = true,
    containerClassName,
    required,
    className,
    id,
    children,
    ...props
  },
  ref,
) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      helper={helper}
      required={required}
      showMessage={showMessage}
      className={containerClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            'input-field cursor-pointer appearance-none pr-10',
            error && 'border-rose-500 dark:border-rose-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </FormField>
  );
});
