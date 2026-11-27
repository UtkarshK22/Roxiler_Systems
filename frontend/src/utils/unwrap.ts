import { ApiEnvelope } from '../types';

/**
 * The axios response interceptor already unwraps `{ data, message }`, so at
 * runtime `payload` is normally the bare body. This helper keeps the old
 * fallback behaviour (`response.data?.data ?? response.data`) while staying
 * type-safe, and also works if the interceptor is ever bypassed.
 */
export function unwrapEnvelope<T>(payload: T | ApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as Record<string, unknown>) &&
    'message' in (payload as Record<string, unknown>)
  ) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}
