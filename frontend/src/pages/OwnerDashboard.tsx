import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { AlertIcon, StarIcon, StoreIcon, UsersIcon } from '../components/ui/icons';

export function OwnerDashboard() {
  const { fetchOwnerDashboard, ownerData, loading, error } = useDashboard();

  useEffect(() => {
    fetchOwnerDashboard();
  }, [fetchOwnerDashboard]);

  const store = ownerData?.store ?? null;
  const averageRating = ownerData?.averageRating ?? null;
  const raters = ownerData?.raters || [];

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Owner Dashboard"
        subtitle="Manage your store and see what customers think."
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </Card>
            ))}
          </div>
          <Card className="space-y-3">
            <Skeleton className="h-5 w-48" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </Card>
        </div>
      ) : !store ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <AlertIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-amber-900 dark:text-amber-100">
                No store assigned
              </h2>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                You don&apos;t have a store assigned yet. Please contact the system
                administrator.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Store"
              value={<span className="text-xl">{store.name}</span>}
              hint={store.address}
              icon={<StoreIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Average rating"
              value={
                averageRating !== null ? (
                  <span className="inline-flex items-center gap-2">
                    {averageRating.toFixed(2)}
                    <StarIcon className="h-6 w-6 fill-amber-500 text-amber-500" />
                  </span>
                ) : (
                  '—'
                )
              }
              hint={
                averageRating !== null
                  ? 'Out of 5 across all customer ratings'
                  : 'No ratings yet'
              }
              icon={<StarIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Total raters"
              value={raters.length}
              hint="Customers who rated your store"
              icon={<UsersIcon className="h-5 w-5" />}
            />
          </div>

          <Card padded={false} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-fg">
                  Customers who rated your store
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  Newest ratings first.
                </p>
              </div>
              {averageRating !== null && (
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(averageRating)} readOnly size="sm" />
                  <span className="text-sm font-semibold text-fg">
                    {averageRating.toFixed(2)} / 5
                  </span>
                </div>
              )}
            </div>

            {raters.length === 0 ? (
              <EmptyState
                message="No ratings yet"
                description="As soon as a customer rates your store, they will appear here."
              />
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead className="bg-raised">
                    <tr>
                      <th className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        Name
                      </th>
                      <th className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        Email
                      </th>
                      <th className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        Rating
                      </th>
                      <th className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {raters.map((rater) => (
                      <tr key={rater.id} className="transition-colors hover:bg-raised">
                        <td className="px-4 py-3 text-sm font-medium text-fg">
                          {rater.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">{rater.email}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2">
                            <StarRating value={rater.rating} readOnly size="sm" />
                            <span className="text-sm font-semibold text-fg">
                              {rater.rating}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {new Date(rater.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
