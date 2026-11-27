import type { NavigateFunction } from 'react-router-dom';

/**
 * Go back when there is real history, otherwise navigate to a safe fallback.
 * React Router v6 tracks the history index in window.history.state.idx.
 */
export function goBack(navigate: NavigateFunction, fallback: string) {
  const state = window.history.state as { idx?: number } | null;
  if (state && typeof state.idx === 'number' && state.idx > 0) {
    navigate(-1);
    return;
  }
  navigate(fallback, { replace: true });
}
