import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/routes';
import { Button } from '../components/ui/Button';
import { ArrowLeftIcon, SearchIcon } from '../components/ui/icons';

export function NotFound() {
  const { user } = useAuth();

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 text-center shadow-card">
        <p className="text-6xl font-extrabold tracking-tight text-primary">404</p>
        <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-raised text-muted">
          <SearchIcon className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-fg">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6">
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
