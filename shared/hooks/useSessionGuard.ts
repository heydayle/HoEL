'use client';

import { useEffect, useRef } from 'react';

import { navigateTo } from '@/shared/utils/navigation';
import { createClient } from '@/shared/utils/supabase/client';

/**
 * Buffer time (in milliseconds) before the access token expires
 * at which a proactive refresh will be triggered.
 * Set to 60 seconds to avoid last-second failures.
 */
const REFRESH_BUFFER_MS = 60 * 1000;

/**
 * Hook that monitors the Supabase session expiry and triggers a proactive
 * token refresh before the access token expires.
 *
 * **How it works:**
 * 1. On mount, reads the current session's `expires_at` timestamp.
 * 2. Schedules a `setTimeout` to call `supabase.auth.refreshSession()`
 *    60 seconds before the token expires.
 * 3. Listens for `TOKEN_REFRESHED` events from `onAuthStateChange` to
 *    re-schedule the next refresh timer when a new token is issued.
 * 4. On `SIGNED_OUT`, clears the timer and redirects to `/auth`.
 *
 * This hook renders nothing and should be called once in a root-level
 * provider such as `AuthSyncProvider`.
 */
export const useSessionGuard = (): void => {
  /** Ref to hold the current setTimeout ID for cleanup */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    /**
     * Clears any existing refresh timer.
     */
    const clearRefreshTimer = (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    /**
     * Schedules a proactive token refresh based on the session's `expires_at`.
     * If the token is already expired or about to expire, refreshes immediately.
     * @param expiresAt - Unix timestamp (seconds) when the access token expires
     */
    const scheduleRefresh = (expiresAt: number): void => {
      clearRefreshTimer();

      const nowMs = Date.now();
      const expiresAtMs = expiresAt * 1000;
      const delayMs = expiresAtMs - nowMs - REFRESH_BUFFER_MS;

      /** If the token is already within the buffer window, refresh immediately */
      const effectiveDelay = Math.max(delayMs, 0);

      timerRef.current = setTimeout(async () => {
        const { error } = await supabase.auth.refreshSession();

        if (error) {
          /** Refresh failed — the refresh token is likely invalid or expired.
           *  Redirect the user to the login page. */
          navigateTo('/auth');
        }
      }, effectiveDelay);
    };

    /**
     * Initializes the refresh timer by reading the current session's expiry.
     */
    const initTimer = async (): Promise<void> => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.expires_at) {
        scheduleRefresh(session.expires_at);
      }
    };

    initTimer();

    /**
     * Listens for Supabase auth state changes to re-schedule refreshes
     * on new tokens or redirect on sign-out.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        if (session?.expires_at) {
          scheduleRefresh(session.expires_at);
        }
      }

      if (event === 'SIGNED_OUT') {
        clearRefreshTimer();
      }
    });

    return () => {
      clearRefreshTimer();
      subscription.unsubscribe();
    };
  }, []);
};
