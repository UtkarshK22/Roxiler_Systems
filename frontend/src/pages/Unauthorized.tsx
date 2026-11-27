import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/routes';
import { Button } from '../components/ui/Button';
import { ArrowLeftIcon, ShieldIcon } from '../components/ui/icons';

export function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
          <ShieldIcon className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-fg">Access denied</h1>
        <p className="mt-2 text-sm text-muted">
          You don&apos;t have permission to view this page. If you believe this is a
          mistake, contact your system administrator.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to={user ? homeForRole(user.role) : '/login'}>
            <Button fullWidth leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
