import { Spinner } from './ui/Spinner';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-sm text-muted">Loading...</p>
    </div>
  );
}
