import React from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, disabled = false, size = 'md' }: StarRatingProps) {
  const sizeClasses = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[5, 4, 3, 2, 1].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
          aria-checked={value === star}
          className={`
            cursor-pointer transition-colors duration-200
            ${disabled ? 'text-gray-300' : value >= star ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}
            ${sizeClasses[size]}
          `}
        >
          ★
        </button>
      ))}
    </div>
  );
}