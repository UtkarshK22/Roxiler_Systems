import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors duration-150 hover:bg-raised hover:text-fg',
        className,
      )}
    >
      <span className="relative block h-5 w-5">
        <SunIcon
          className={cn(
            'absolute inset-0 h-5 w-5 transition-all duration-200',
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <MoonIcon
          className={cn(
            'absolute inset-0 h-5 w-5 transition-all duration-200',
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
          )}
        />
      </span>
    </button>
  );
}
