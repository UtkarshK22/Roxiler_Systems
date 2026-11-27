import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { FormField } from './FormField';
import { EyeIcon, EyeOffIcon } from './icons';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helper?: React.ReactNode;
  counter?: { value: number; max: number };
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  showMessage?: boolean;
  containerClassName?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helper,
    counter,
    leftIcon,
    rightSlot,
    showMessage = true,
    containerClassName,
    required,
    className,
    id,
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
      counter={counter}
      required={required}
      showMessage={showMessage}
      className={containerClassName}
    >
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={cn(
            'input-field',
            leftIcon && 'pl-10',
            rightSlot && 'pr-12',
            error && 'border-rose-500 dark:border-rose-500',
            className,
          )}
          {...props}
        />
        {rightSlot && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </FormField>
  );
});

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightSlot'> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        {...props}
        type={visible ? 'text' : 'password'}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            title={visible ? 'Hide password' : 'Show password'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
          >
            {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        }
      />
    );
  },
);
