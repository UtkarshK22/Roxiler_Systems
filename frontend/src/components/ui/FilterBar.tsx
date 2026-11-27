import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { SearchIcon } from './icons';

export interface FilterField {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'select';
  options?: Array<{ value: string; label: string }>;
}

interface FilterBarProps {
  fields: FilterField[];
  onFiltersChange: (filters: Record<string, string>) => void;
  onSubmit?: (filters: Record<string, string>) => void;
  className?: string;
}

/**
 * Live filtering is preserved (each keystroke calls onFiltersChange). The
 * Search button / Enter applies immediately, Clear resets everything.
 */
export function FilterBar({ fields, onFiltersChange, onSubmit, className }: FilterBarProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const apply = (next: Record<string, string>) => {
    setFilters(next);
    onFiltersChange(next);
  };

  const handleChange = (key: string, value: string) => {
    apply({ ...filters, [key]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    apply(filters);
    onSubmit?.(filters);
  };

  const handleClear = () => {
    apply({});
    onSubmit?.({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'mb-6 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5',
        className,
      )}
      role="search"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) => (
          <div key={field.key} className="min-w-0">
            {field.type === 'select' ? (
              <Select
                id={`filter-${field.key}`}
                label={field.label}
                value={filters[field.key] ?? ''}
                onChange={(event) => handleChange(field.key, event.target.value)}
                showMessage={false}
              >
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={`filter-${field.key}`}
                label={field.label}
                type="text"
                placeholder={field.placeholder ?? `Search by ${field.label}`}
                value={filters[field.key] ?? ''}
                onChange={(event) => handleChange(field.key, event.target.value)}
                leftIcon={<SearchIcon className="h-4 w-4" />}
                showMessage={false}
              />
            )}
          </div>
        ))}
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1 lg:justify-end">
          <Button
            type="submit"
            leftIcon={<SearchIcon className="h-4 w-4" />}
            className="flex-1 lg:flex-none"
          >
            Search
          </Button>
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
}
