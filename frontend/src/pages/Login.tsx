import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { loginSchema } from '../utils/validation';
import { unwrapEnvelope } from '../utils/unwrap';
import { AuthResponse } from '../types';
import { z } from 'zod';
import { Input, PasswordInput } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ShieldIcon, StarIcon, StoreIcon, UsersIcon } from '../components/ui/icons';
import { homeForRole } from '../utils/routes';

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await authAPI.login(data.email, data.password);

      // The backend wraps every response as { data: {...}, message }; the axios
      // interceptor unwraps it. unwrapEnvelope keeps the old fallback behaviour.
      const payload = unwrapEnvelope<AuthResponse>(response.data);
      const token = payload?.access_token;
      const user = payload?.user;

      if (!token || !user) {
        setError('Unexpected response from the server. Please try again.');
        return;
      }

      login(token, user);
      navigate(homeForRole(user.role));
    } catch (err: any) {
      const raw = err.response?.data?.message;
      setError(
        Array.isArray(raw) ? raw.join(' ') : raw || 'Invalid email or password',
      );
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
            Store ratings, made simple and transparent.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            One place for administrators to manage people and stores, owners to
            track their reputation, and customers to share honest feedback.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <UsersIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Role-based access</span>
                Tailored dashboards for admins, store owners and normal users.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <StoreIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Every store in view</span>
                Search, sort and rate registered stores in seconds.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <StarIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-white">Live averages</span>
                Ratings update instantly so owners always see the truth.
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
            <h2 className="text-3xl font-bold tracking-tight text-fg">Welcome back</h2>
            <p className="mt-2 text-sm text-muted">
              Sign in to your account to continue.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  {error}
                </div>
              )}

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

              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" fullWidth loading={submitting} className="mt-2">
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Sign up
              </Link>
            </p>

            <div className="mt-8 rounded-lg border border-line bg-raised p-4 text-xs text-muted">
              <p className="font-semibold text-fg">Demo accounts</p>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between gap-4">
                  <dt>System admin</dt>
                  <dd className="font-mono text-fg">admin@roxiler.com</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Store owner</dt>
                  <dd className="font-mono text-fg">priya.ramanathan@roxiler.com</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Normal user</dt>
                  <dd className="font-mono text-fg">ananya.bhattacharya@roxiler.com</dd>
                </div>
              </dl>
              <p className="mt-2">
                Passwords: <span className="font-mono text-fg">AdminPass123!</span>,{' '}
                <span className="font-mono text-fg">OwnerPass123!</span>,{' '}
                <span className="font-mono text-fg">UserPass123!</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
