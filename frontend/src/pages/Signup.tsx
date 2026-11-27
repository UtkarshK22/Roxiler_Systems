import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { signupSchema, ADDRESS_MAX, NAME_MAX, NAME_MIN } from '../utils/validation';
import { z } from 'zod';
import { Input, PasswordInput } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ShieldIcon, StarIcon, StoreIcon, UsersIcon } from '../components/ui/icons';
import { useToast } from '../components/ui/Toast';

type SignupForm = z.infer<typeof signupSchema>;

export function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', address: '', password: '' },
  });

  const nameValue = watch('name') ?? '';
  const addressValue = watch('address') ?? '';

  const onSubmit = async (data: SignupForm) => {
    setSubmitting(true);
    setError(null);
    try {
      await authAPI.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address || undefined,
      });
      toast.success('Account created. Please sign in to continue.');
      navigate('/login');
    } catch (err: any) {
      const raw = err.response?.data?.message;
      setError(Array.isArray(raw) ? raw.join(' ') : raw || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-10 text-slate-100 lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(60% 60% at 20% 10%, rgba(79,70,229,0.55), transparent 70%), radial-gradient(50% 50% at 85% 80%, rgba(13,148,136,0.45), transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <ShieldIcon className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold">Roxiler</p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              Systems
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-balance text-4xl font-bold leading-tight">
            Join the community and start rating stores.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Create your free account to browse registered stores and share a
            rating in a couple of clicks.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <StoreIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Browse stores</span>
                Search by name or address and sort by rating.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <StarIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Rate in seconds</span>
                Give any store a score from one to five stars.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <UsersIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Update anytime</span>
                Change your rating whenever your experience changes.
              </span>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} Roxiler Systems. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-5 sm:p-6 lg:justify-end">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-strong text-white">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-bold text-fg">Roxiler</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-fg">Create your account</h2>
            <p className="mt-2 text-sm text-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Sign in
              </Link>
            </p>

            <form className="mt-8 space-y-1" onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  {error}
                </div>
              )}

              <Input
                id="name"
                type="text"
                label="Full name"
                placeholder="e.g. Ananya Sharma Bhattacharya"
                autoComplete="name"
                required
                helper={`${NAME_MIN}-${NAME_MAX} characters`}
                counter={{ value: nameValue.length, max: NAME_MAX }}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                id="address"
                type="text"
                label="Address"
                placeholder="Street, city, state, postal code"
                autoComplete="street-address"
                helper={`Up to ${ADDRESS_MAX} characters`}
                counter={{ value: addressValue.length, max: ADDRESS_MAX }}
                error={errors.address?.message}
                {...register('address')}
              />

              <PasswordInput
                id="password"
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                helper="8-16 characters, one uppercase letter and one special character"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" fullWidth loading={submitting} className="mt-3">
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
