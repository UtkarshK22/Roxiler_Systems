import React, { useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { StarIcon } from './icons';

type StarSize = 'sm' | 'md' | 'lg';

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  size?: StarSize;
  showValue?: boolean;
  className?: string;
}

const sizeClasses: Record<StarSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

export function StarRating({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactive = !readOnly && !disabled;
  const displayValue = hovered ?? value;
  const starClass = sizeClasses[size];

  if (!interactive) {
    return (
      <span
        className={cn('inline-flex items-center gap-1', className)}
        role="img"
        aria-label={`Rating: ${value} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn(
              starClass,
              star <= value
                ? 'fill-amber-500 text-amber-500'
                : 'fill-none text-slate-300 dark:text-slate-600',
            )}
          />
        ))}
        {showValue && (
          <span className="ml-1 text-sm font-medium text-fg">{value.toFixed(1)}</span>
        )}
      </span>
    );
  }

  const commit = (next: number) => {
    onChange?.(next);
    const target = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-star="${next}"]`,
    );
    target?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = value || 1;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(5, current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(1, current - 1);
        break;
      case 'Home':
        next = 1;
        break;
      case 'End':
        next = 5;
        break;
      case 'Enter':
      case ' ':
        next = hovered ?? current;
        break;
      default:
        return;
    }
    event.preventDefault();
    commit(next);
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Rating"
      className={cn('inline-flex items-center gap-1', className)}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            data-star={star}
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            tabIndex={star === (value || 1) ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            className={cn(
              'rounded transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60',
              filled
                ? 'text-amber-500'
                : 'text-slate-300 dark:text-slate-600',
            )}
          >
            <StarIcon className={starClass} fill={filled ? 'currentColor' : 'none'} />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-fg">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
