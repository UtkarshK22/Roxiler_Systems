import React from 'react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No data available' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-gray-400 text-2xl">📭</span>
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}