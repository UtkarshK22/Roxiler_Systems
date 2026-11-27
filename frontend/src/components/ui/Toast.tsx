import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn';
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from './icons';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextType {
  push: (kind: ToastKind, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const kindStyles: Record<ToastKind, string> = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  error:
    'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200',
};

const kindIcons: Record<ToastKind, ReactNode> = {
  success: <CheckIcon className="h-5 w-5" />,
  error: <AlertIcon className="h-5 w-5" />,
  info: <InfoIcon className="h-5 w-5" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current, { id, kind, message }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const success = useCallback((message: string) => push('success', message), [push]);
  const error = useCallback((message: string) => push('error', message), [push]);
  const info = useCallback((message: string) => push('info', message), [push]);

  return (
    <ToastContext.Provider value={{ push, success, error, info, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex animate-fade-in items-start gap-3 rounded-lg border p-3 shadow-raised',
              kindStyles[toast.kind],
            )}
          >
            <span className="mt-0.5 shrink-0">{kindIcons[toast.kind]}</span>
            <p className="flex-1 text-sm font-medium leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
