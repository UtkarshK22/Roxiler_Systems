import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { changePasswordSchema } from '../utils/validation';
import { z } from 'zod';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { PasswordInput } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { CheckIcon, LockIcon } from '../components/ui/icons';

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function UpdatePassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { changePassword } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      setSuccess('Password updated successfully!');
      toast.success('Your password was updated.');
      reset();
    } catch (err: any) {
      const raw = err.response?.data?.message;
      const message = Array.isArray(raw) ? raw.join(' ') : raw || 'Failed to update password';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container py-8">
      <PageHeader
        title="Update password"
        subtitle="Choose a strong password to keep your account secure."
        backTo="/"
        backLabel="Back to dashboard"
      />

      <Card className="max-w-lg">
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-line bg-raised p-3 text-sm text-muted">
          <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Passwords must be 8-16 characters and include at least one uppercase
            letter and one special character.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            <CheckIcon className="h-4 w-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
          <PasswordInput
            id="current_password"
            label="Current password"
            autoComplete="current-password"
            required
            error={errors.current_password?.message}
            {...register('current_password')}
          />
          <PasswordInput
            id="new_password"
            label="New password"
            autoComplete="new-password"
            required
            error={errors.new_password?.message}
            {...register('new_password')}
          />

          <Button type="submit" fullWidth loading={submitting} className="mt-3">
            {submitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
