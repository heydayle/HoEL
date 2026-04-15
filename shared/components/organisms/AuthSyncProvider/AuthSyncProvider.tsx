'use client';

import { useEffect } from 'react';

import { AUTH_TOKEN_KEY } from '@/shared/utils/constants';
import { createClient } from '@/shared/utils/supabase/client';

import { useSessionGuard } from '@/shared/hooks/useSessionGuard';

/**
 * Client-side provider that syncs the authenticated Supabase user
 * to `localStorage` on every page load. This is necessary because
 * the server-side proxy cannot access `localStorage` directly.
 *
 * When a user is authenticated (via email/password or OAuth),
 * the proxy sets a `sb-user-data` cookie. This provider reads the
 * Supabase session on the client and stores user data in localStorage
 * so that other client components can access it synchronously.
 *
 * @returns `null` — this component renders nothing
 */
export function AuthSyncProvider(): null {
  useSessionGuard();

  useEffect(() => {
    const syncUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          display_name:
            user.user_metadata?.display_name || user.user_metadata?.full_name || '',
          created_at: user.created_at,
        };
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    };

    syncUser();

    /** Listen for auth state changes (sign in, sign out, token refresh) */
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          display_name:
            session.user.user_metadata?.display_name ||
            session.user.user_metadata?.full_name ||
            '',
          created_at: session.user.created_at,
        };
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
