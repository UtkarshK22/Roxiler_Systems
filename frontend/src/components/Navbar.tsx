import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ui/ThemeToggle';
import { Badge } from './ui/Badge';
import { CloseIcon, LogoutIcon, MenuIcon, ShieldIcon } from './ui/icons';
import { cn } from '../utils/cn';
import { homeForRole } from '../utils/routes';

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const links =
    user.role === 'SYSTEM_ADMIN'
      ? [
          { to: '/admin', label: 'Dashboard', end: true },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/stores', label: 'Stores' },
        ]
      : user.role === 'STORE_OWNER'
        ? [{ to: '/owner', label: 'Dashboard', end: true }]
        : [{ to: '/stores', label: 'Stores', end: true }];

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-primary-soft text-primary'
        : 'text-muted hover:bg-raised hover:text-fg',
    );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to={homeForRole(user.role)}
              className="flex items-center gap-2 rounded-lg"
              aria-label="Roxiler Systems home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-strong text-white">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-base font-bold text-fg">Roxiler</span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Systems
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/update-password" className={linkClass}>
                Password
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary"
                aria-hidden="true"
              >
                {initials || 'U'}
              </span>
              <div className="hidden max-w-[180px] flex-col leading-tight lg:flex">
                <span className="truncate text-sm font-medium text-fg" title={user.name}>
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted" title={user.email}>
                  {user.email}
                </span>
              </div>
              <Badge role={user.role} className="hidden xl:inline-flex" />
            </div>

            <button
              type="button"
              onClick={logout}
              className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 md:inline-flex"
            >
              <LogoutIcon className="h-4 w-4" />
              Logout
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-raised hover:text-fg md:hidden"
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-fade-in border-t border-line py-3 md:hidden">
            <div className="mb-3 flex items-center gap-3 px-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {initials || 'U'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/update-password"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Update password
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogoutIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
