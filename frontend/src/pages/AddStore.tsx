import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { addStoreSchema, ADDRESS_MAX, NAME_MAX, NAME_MIN } from '../utils/validation';
import { usersAPI } from '../api/users';
import { storesAPI } from '../api/stores';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';

type AddStoreForm = z.infer<typeof addStoreSchema>;
type Owner = { id: string; name: string; email: string };

export function AddStore() {
  const navigate = useNavigate();
  const toast = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [ownersError, setOwnersError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<AddStoreForm>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: { name: '', email: '', address: '', owner_id: '' },
    mode: 'onTouched',
  });

  const nameValue = watch('name') ?? '';
  const addressValue = watch('address') ?? '';

  useEffect(() => {
    let active = true;
    (async () => {
      setOwnersLoading(true);
      setOwnersError(null);
      try {
        const response = await usersAPI.getAll({ role: 'STORE_OWNER', limit: 100 });
        if (!active) return;
        setOwners(response.data.users ?? []);
      } catch (err: any) {
        if (!active) return;
        setOwnersError(err.response?.data?.message || 'Failed to load store owners');
      } finally {
        if (active) setOwnersLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (data: AddStoreForm) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await storesAPI.create(data);
      toast.success(`Store "${data.name}" was created successfully.`);
      navigate('/admin/stores');
    } catch (err: any) {
      const status = err.response?.status;
      const raw = err.response?.data?.message;
      const message = Array.isArray(raw) ? raw.join(' ') : raw;
      if (status === 409 && /owner/i.test(message ?? '')) {
        setError('owner_id', {
          type: 'server',
          message: message || 'Owner already has a store',
        });
      } else if (status === 409) {
        setError('email', {
          type: 'server',
          message: message || 'Store email already exists',
        });
      } else if (status === 404) {
        setError('owner_id', {
          type: 'server',
          message: message || 'Owner not found or is not a store owner',
        });
      } else {
        setServerError(message || 'Failed to create store.');
        toast.error(message || 'Failed to create store.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Add New Store"
        subtitle="Register a store and assign it to a store owner."
        backTo="/admin/stores"
        backLabel="Back to stores"
      />

      <Card className="max-w-3xl">
        {!ownersLoading && !ownersError && owners.length === 0 && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-medium">No store owners available yet.</p>
            <p className="mt-1">
              Create a user with the Store Owner role first, then come back to add
              their store.
            </p>
            <Link
              to="/admin/users/new"
              className="mt-2 inline-block font-semibold text-amber-900 underline underline-offset-2 dark:text-amber-100"
            >
              Add a store owner
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Input
              id="name"
              label="Store name"
              required
              placeholder="e.g. Ramanathan Electronics Emporium"
              helper={`${NAME_MIN}-${NAME_MAX} characters`}
              counter={{ value: nameValue.length, max: NAME_MAX }}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="email"
              label="Store email"
              required
              type="email"
              placeholder="store@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="md:col-span-2">
              <Input
                id="address"
                label="Address"
                required
                placeholder="Street, city, state, postal code"
                helper={`Up to ${ADDRESS_MAX} characters`}
                counter={{ value: addressValue.length, max: ADDRESS_MAX }}
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
            <div className="md:col-span-2">
              {ownersLoading ? (
                <div className="flex h-10 items-center gap-2 text-sm text-muted">
                  <Spinner className="h-4 w-4" />
                  Loading store owners…
                </div>
              ) : (
                <Select
                  id="owner_id"
                  label="Owner"
                  required
                  disabled={owners.length === 0}
                  error={errors.owner_id?.message}
                  helper={
                    ownersError
                      ? ownersError
                      : 'Only users with the Store Owner role are listed.'
                  }
                  {...register('owner_id')}
                >
                  <option value="">Select an owner…</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => navigate('/admin/stores')}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={owners.length === 0}>
              {submitting ? 'Creating store…' : 'Create store'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
