import React, { useState } from 'react';

interface FilterBarProps {
  onFiltersChange: (filters: Record<string, string>) => void;
  fields: { key: string; label: string; placeholder?: string }[];
}

export function FilterBar({ onFiltersChange, fields }: FilterBarProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase">
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder || `Search by ${field.label}`}
              value={filters[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        ))}
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilters({});
              onFiltersChange({});
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}