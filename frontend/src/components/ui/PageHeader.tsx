import React from 'react';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../utils/navigation';
import { Button } from './Button';
import { ArrowLeftIcon } from './icons';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  actions,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {backTo && (
        <div className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            onClick={() => goBack(navigate, backTo)}
            className="-ml-2"
          >
            {backLabel}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-muted sm:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
