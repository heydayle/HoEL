'use client';

import { useCallback, useState } from 'react';

import { useLocale } from '@/shared/hooks/useLocale';
import type { Locale } from '@/shared/types';
import { createClient } from '@/shared/utils/supabase/client';

import type { AuthProvider, IAuthFormData, IAuthResult } from '../../core/models';
import { AuthMode } from '../../core/models';
import { signInUseCase, signUpUseCase, signInWithProviderUseCase } from '../../core/usecases';
import { UsersTableAuthRepository } from '../../infras/authRepository';
import en from '../../messages/en.json';
import vi from '../../messages/vi.json';
import { toast } from 'sonner';


/** Locale messages map for auth module */
const authMessages: Record<Locale, Record<string, string>> = { en, vi };

/**
 * Custom hook encapsulating all auth page UI logic.
 * Manages form state, auth mode toggling, and user authentication
 * against the `users` table (not Supabase Auth).
 * @returns Object containing auth state and action handlers
 */
export const useAuthPage = () => {
  const { locale, t } = useLocale(authMessages);

  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Whether the current mode is sign in */
  const isSignIn = authMode === AuthMode.SIGN_IN;

  /**
   * Toggles between sign in and register modes, clearing any existing error.
   */
  const toggleAuthMode = useCallback(() => {
    setAuthMode((prev) =>
      prev === AuthMode.SIGN_IN ? AuthMode.REGISTER : AuthMode.SIGN_IN
    );
    setError(null);
  }, []);

  /**
   * Handles form submission for sign in or register.
   * Queries the `users` table via the repository and stores
   * the returned user session in localStorage on success.
   * @param formData - The user-submitted auth form data
   */
  const handleSubmit = useCallback(
    async (formData: IAuthFormData): Promise<IAuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const repository = new UsersTableAuthRepository(supabase);

        const result = isSignIn
          ? await signInUseCase(repository, formData)
          : await signUpUseCase(repository, formData);

        if (isSignIn) {
          toast.success(t('sign_in_success'));
        } else {
          toast.success(t('register_success'));
          setAuthMode(AuthMode.SIGN_IN);
        }

        if (!result.success && result.error) {
          toast.error(result.error);
        }
        return result;
      } catch {
        // Fallback error message for unexpected issues
        return { success: false, error: t('error_unexpected') };
      } finally {
        setIsLoading(false);
      }
    },
    [isSignIn, t],
  );

  /**
   * Handles OAuth provider sign-in.
   * Redirects the browser to the provider's OAuth consent screen.
   * @param provider - The OAuth provider to sign in with
   */
  const handleProviderSignIn = useCallback(
    async (provider: AuthProvider) => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const repository = new UsersTableAuthRepository(supabase);
        const redirectTo = `${window.location.origin}/auth/callback`;

        const result = await signInWithProviderUseCase(repository, provider, redirectTo);

        if (!result.success && result.error) {
          setError(result.error);
        }
      } catch {
        setError(t('error_unexpected'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  return {
    /** Current locale from i18n */
    locale,
    /** Translation function scoped to auth messages */
    t,
    /** Current authentication mode (sign in or register) */
    authMode,
    /** Whether the form is currently in sign in mode */
    isSignIn,
    setAuthMode,
    /** Whether an auth request is in progress */
    isLoading,
    /** Current error message, if any */
    error,
    /** Toggles between sign in and register */
    toggleAuthMode,
    /** Handles form submission */
    handleSubmit,
    /** Handles OAuth provider sign-in */
    handleProviderSignIn,
  };
};
