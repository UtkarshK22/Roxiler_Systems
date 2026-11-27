import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { addUserSchema, ADDRESS_MAX, NAME_MAX, NAME_MIN } from '../utils/validation';
import { useUsers } from '../hooks/useUsers';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Input, PasswordInput } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

type AddUserForm = z.infer<typeof addUserSchema>;

export function AddUser() {
  const navigate = useNavigate();
  const { createUser } = useUsers();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      password: '',
      role: 'NORMAL_USER',
    },
    mode: 'onTouched',
  });

  const nameValue = watch('name') ?? '';
  const addressValue = watch('address') ?? '';

  const onSubmit = async (data: AddUserForm) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await createUser(data);
      toast.success(`User "${data.name}" was created successfully.`);
      navigate('/admin/users');
    } catch (err: any) {
      const status = err.response?.status;
      const raw = err.response?.data?.message;
      const message = Array.isArray(raw) ? raw.join(' ') : raw;
      if (status === 409) {
        setError('email', {
          type: 'server',
          message: message || 'Email already exists',
        });
      } else {
        setServerError(message || 'Failed to create user.');
        toast.error(message || 'Failed to create user.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Add New User"
        subtitle="Create a system admin, store owner or normal user account."
        backTo="/admin/users"
        backLabel="Back to users"
      />

      <Card className="max-w-3xl">
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
              label="Full name"
              required
              autoComplete="name"
              placeholder="e.g. Ananya Sharma Bhattacharya"
              helper={`${NAME_MIN}-${NAME_MAX} characters`}
              counter={{ value: nameValue.length, max: NAME_MAX }}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="email"
              label="Email address"
              required
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="md:col-span-2">
              <Input
                id="address"
                label="Address"
                autoComplete="street-address"
                placeholder="Street, city, state, postal code"
                helper={`Up to ${ADDRESS_MAX} characters`}
                counter={{ value: addressValue.length, max: ADDRESS_MAX }}
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              required
              autoComplete="new-password"
              placeholder="Create a password"
              helper="8-16 characters, one uppercase letter and one special character"
              error={errors.password?.message}
              {...register('password')}
            />
            <Select
              id="role"
              label="Role"
              required
              error={errors.role?.message}
              {...register('role')}
            >
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="SYSTEM_ADMIN">System Administrator</option>
            </Select>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {submitting ? 'Creating user…' : 'Create user'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
