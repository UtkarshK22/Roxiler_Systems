import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import {
  ArrowRightIcon,
  PlusIcon,
  StarIcon,
  StoreIcon,
  UsersIcon,
} from '../components/ui/icons';

export function AdminDashboard() {
  const { fetchAdminDashboard, adminData, loading, error } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminDashboard();
  }, [fetchAdminDashboard]);

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle={
          <span>
            Welcome back, <span className="font-medium text-fg">{user?.name}</span>
          </span>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Users"
          value={adminData?.totalUsers ?? 0}
          icon={<UsersIcon className="h-5 w-5" />}
          href="/admin/users"
          loading={loading}
        />
        <StatCard
          label="Total Stores"
          value={adminData?.totalStores ?? 0}
          icon={<StoreIcon className="h-5 w-5" />}
          href="/admin/stores"
          loading={loading}
        />
        <StatCard
          label="Total Ratings"
          value={adminData?.totalRatings ?? 0}
          icon={<StarIcon className="h-5 w-5" />}
          href="/admin/stores?sortBy=average_rating&order=DESC"
          loading={loading}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-fg">Quick actions</h2>
            <p className="mt-0.5 text-sm text-muted">
              Create accounts and stores, or jump straight into a list.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/users/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add New User
          </Link>
          <Link to="/admin/stores/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add New Store
          </Link>
          <Link to="/admin/users" className="btn-secondary">
            View all users
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link to="/admin/stores" className="btn-secondary">
            View all stores
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
