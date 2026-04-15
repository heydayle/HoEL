/**
 * Shape returned by getUserLocal with basic user info.
 */
interface UserLocal {
  /** The raw user object from localStorage, or null */
  user: Record<string, unknown> | null;
  /** The user's UUID, or null if not authenticated */
  userId: string | null;
}

import { AUTH_TOKEN_KEY } from '@/shared/utils/constants';

/**
 * Retrieves the currently authenticated user from localStorage.
 * Data is kept in sync by the AuthSyncProvider component which
 * listens for Supabase auth state changes and updates localStorage.
 *
 * This is a **synchronous** read — no API call is made.
 * Returns nulls when called on the server (SSR) since localStorage
 * is not available outside the browser.
 *
 * @returns The authenticated user info, or nulls if not logged in
 */
export const getUserLocal = (): UserLocal => {
  if (typeof window === 'undefined') {
    return { user: null, userId: null };
  }

  const stored = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = stored ? JSON.parse(stored) : null;

  return {
    user,
    userId: user?.id ?? null,
  };
};