import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { OwnerStoreRating, User } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge, ROLE_LABELS } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState<OwnerStoreRating | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersAPI.getById(id);
        if (!active) return;
        const fetched = response.data;
        setUser(fetched);

        if (fetched.role === 'STORE_OWNER') {
          setRatingLoading(true);
          try {
            const ratingResponse = await usersAPI.getOwnerStoreRating(id);
            if (active) setRating(ratingResponse.data);
          } catch {
            if (active) {
              setRating({ store: null, averageRating: null });
            }
          } finally {
            if (active) setRatingLoading(false);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load this user.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container py-8">
      <PageHeader
        title="User Details"
        subtitle="Account information and store rating."
        backTo="/admin/users"
        backLabel="Back to users"
        actions={
          <Link to="/admin/users" className="btn-secondary">
            All users
          </Link>
        }
      />

      {loading ? (
        <Card className="max-w-3xl space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      ) : error || !user ? (
        <Card className="max-w-3xl">
          <EmptyState
            message="User not found"
            description={error ?? 'This account may have been removed.'}
            action={
              <Link to="/admin/users" className="btn-primary">
                Back to users
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl font-bold text-primary">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-fg" title={user.name}>
                  {user.name}
                </h2>
                <p className="truncate text-sm text-muted" title={user.email}>
                  {user.email}
                </p>
                <div className="mt-2">
                  <Badge role={user.role}>{ROLE_LABELS[user.role]}</Badge>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Address
                </dt>
                <dd className="mt-1 break-words text-sm text-fg">
                  {user.address || 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Role
                </dt>
                <dd className="mt-1 text-sm text-fg">{ROLE_LABELS[user.role]}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  User ID
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-muted">{user.id}</dd>
              </div>
            </dl>
          </Card>

          {user.role === 'STORE_OWNER' && (
            <Card>
              <h3 className="text-base font-semibold text-fg">Store rating</h3>
              {ratingLoading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ) : rating?.store ? (
                <div className="mt-4">
                  <p className="text-sm text-muted">Store</p>
                  <p className="truncate font-medium text-fg" title={rating.store.name}>
                    {rating.store.name}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {rating.averageRating !== null ? (
                      <>
                        <StarRating value={Math.round(rating.averageRating)} readOnly />
                        <span className="text-sm font-semibold text-fg">
                          {rating.averageRating.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted">No ratings yet</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">No store assigned yet.</p>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
