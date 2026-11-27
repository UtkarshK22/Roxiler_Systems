import React, { useCallback, useEffect, useState } from 'react';
import { useStores } from '../hooks/useStores';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { useToast } from '../components/ui/Toast';
import { SearchIcon } from '../components/ui/icons';
import { Store } from '../types';

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'address', label: 'Address' },
  { value: 'average_rating', label: 'Rating' },
];

export function UserStores() {
  const [draft, setDraft] = useState({ name: '', address: '' });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const toast = useToast();
  const { stores, total, loading, error, fetchStores, upsertRating, setStores } =
    useStores();

  const applyFilters = useCallback((next: Record<string, string>) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleDraftChange = (key: 'name' | 'address', value: string) => {
    const nextDraft = { ...draft, [key]: value };
    setDraft(nextDraft);
    applyFilters(nextDraft);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    applyFilters(draft);
  };

  const handleClear = () => {
    setDraft({ name: '', address: '' });
    applyFilters({});
  };

  useEffect(() => {
    fetchStores({
      ...filters,
      page,
      limit: PAGE_SIZE,
      sortBy,
      order,
    });
  }, [filters, page, sortBy, order, fetchStores]);

  const handleRating = async (store: Store, rating: number) => {
    const previous = store.my_rating;
    setSubmittingId(store.id);
    setStores((current) =>
      current.map((item) =>
        item.id === store.id ? { ...item, my_rating: rating } : item,
      ),
    );

    try {
      await upsertRating(store.id, rating);
      toast.success(`Your rating for "${store.name}" was saved.`);
      await fetchStores({
        ...filters,
        page,
        limit: PAGE_SIZE,
        sortBy,
        order,
      });
    } catch {
      setStores((current) =>
        current.map((item) =>
          item.id === store.id ? { ...item, my_rating: previous } : item,
        ),
      );
      toast.error('Could not save your rating. Please try again.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Find a store"
        subtitle="Search registered stores and rate them from 1 to 5 stars."
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSearch}
        role="search"
        className="mb-6 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            id="store-name"
            label="Store name"
            placeholder="Search by store name"
            value={draft.name}
            onChange={(event) => handleDraftChange('name', event.target.value)}
            leftIcon={<SearchIcon className="h-4 w-4" />}
            showMessage={false}
          />
          <Input
            id="store-address"
            label="Address"
            placeholder="Search by address"
            value={draft.address}
            onChange={(event) => handleDraftChange('address', event.target.value)}
            leftIcon={<SearchIcon className="h-4 w-4" />}
            showMessage={false}
          />
          <Select
            id="store-sort"
            label="Sort by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            showMessage={false}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            id="store-order"
            label="Direction"
            value={order}
            onChange={(event) => setOrder(event.target.value as 'ASC' | 'DESC')}
            showMessage={false}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </Select>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="submit" leftIcon={<SearchIcon className="h-4 w-4" />}>
            Search
          </Button>
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-40" />
            </Card>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <EmptyState
            message="No stores match your search"
            description="Try a different store name or address."
            action={
              <Button variant="secondary" onClick={handleClear}>
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stores.map((store) => {
              const hasAverage =
                store.average_rating !== null && store.average_rating !== undefined;
              return (
                <Card
                  key={store.id}
                  className="flex flex-col justify-between transition-colors hover:border-primary"
                >
                  <div>
                    <h3
                      className="truncate text-lg font-semibold text-fg"
                      title={store.name}
                    >
                      {store.name}
                    </h3>
                    <p
                      className="mt-1 line-clamp-2 text-sm text-muted"
                      title={store.address}
                    >
                      {store.address}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      {hasAverage ? (
                        <>
                          <StarRating
                            value={Math.round(store.average_rating as number)}
                            readOnly
                            size="sm"
                          />
                          <span className="text-sm font-semibold text-fg">
                            {(store.average_rating as number).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted">No ratings yet</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {store.my_rating !== null
                        ? `Your rating: ${store.my_rating}`
                        : 'Not rated yet'}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-line pt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                      {store.my_rating !== null ? 'Update your rating' : 'Rate this store'}
                    </p>
                    <StarRating
                      value={store.my_rating ?? 0}
                      onChange={(value) => handleRating(store, value)}
                      disabled={submittingId === store.id}
                      size="lg"
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <Pagination
              page={page}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
              className="border-t-0"
            />
          </div>
        </>
      )}
    </div>
  );
}
