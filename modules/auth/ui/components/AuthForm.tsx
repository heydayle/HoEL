'use client';

import { CardContent, CardHeader } from '@/shared/components/Styled';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { type IAuthFormData } from '../../core/models';
import { useAuthPage } from '../hooks/useAuthPage';

/**
 * Inline SVG icon for Google.
 * @returns The Google "G" logo SVG element
 */
const GoogleIcon = (): React.JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * Inline SVG icon for GitHub.
 * @returns The GitHub octocat logo SVG element
 */
const GitHubIcon = (): React.JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/**
 * AuthForm component rendering the sign in / register form
 * with OAuth provider buttons (Google, GitHub).
 * Manages local form field state and delegates auth logic to useAuthPage hook.
 * @returns The rendered auth form with i18n text
 */
export const AuthForm = (): React.JSX.Element => {
  const router = useRouter();
  const { t, isSignIn, isLoading, error, toggleAuthMode, handleSubmit, handleProviderSignIn } =
    useAuthPage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  /**
   * Handles form submission event.
   * @param e - The form submit event
   */
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData: IAuthFormData = {
        email,
        password,
        ...(!isSignIn && { displayName }),
      };

      const result = await handleSubmit(formData);
      if (result.success && isSignIn) {
        router.push('/');
        router.refresh();
      }
    },
    [email, password, displayName, isSignIn, handleSubmit, router],
  );



  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-background before:content-[''] before:absolute before:-top-1/2 before:-left-1/2 before:w-[200%] before:h-[200%] before:bg-[var(--gradient-glow)] before:pointer-events-none before:z-0">
      <div className="relative z-[1] flex flex-col items-center w-full max-w-[440px] p-6 animate-[fadeInUp_0.6s_ease-out]">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-[var(--gradient-hero)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
            {t('app_name')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-[0.01em]">{t('app_tagline')}</p>
        </div>

        {/* Auth Card */}
        <div className="py-4 w-full border border-[var(--surface-border)] bg-[var(--surface)] shadow-[var(--surface-shadow)] rounded-[calc(var(--radius)*1.6)] backdrop-blur-[12px] transition-shadow duration-300 hover:shadow-[var(--surface-shadow-hover)]">
          <CardHeader>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {t(isSignIn ? 'page_title' : 'page_title_register')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              {isSignIn ? t('page_subtitle_sign_in') : t('page_subtitle_register')}
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 py-3 px-4 mb-5 rounded-[calc(var(--radius)*1.2)] bg-accent-warm-light border border-[var(--accent-warm)] text-[var(--accent-warm)] text-[0.8125rem] font-medium animate-[fadeInUp_0.3s_ease-out]"
              >
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} id="auth-form">
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="text-[0.8125rem] font-medium text-foreground-secondary mb-1.5 block"
                >
                  {t('label_email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('placeholder_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-11 bg-background border border-border rounded-[calc(var(--radius)*1.2)] text-sm px-3 transition-all duration-200 focus:border-accent-primary focus:shadow-[0_0_0_3px_var(--accent-primary-light)] placeholder:text-foreground-muted"
                />
              </div>

              {/* {!isSignIn && (
                <div className="mb-5">
                  <label
                    htmlFor="displayName"
                    className="text-[0.8125rem] font-medium text-foreground-secondary mb-1.5 block"
                  >
                    {t('label_display_name')}
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder={t('placeholder_display_name')}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full h-11 bg-background border border-border rounded-[calc(var(--radius)*1.2)] text-sm px-3 transition-all duration-200 focus:border-accent-primary focus:shadow-[0_0_0_3px_var(--accent-primary-light)] placeholder:text-foreground-muted"
                  />
                </div>
              )} */}

              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="text-[0.8125rem] font-medium text-foreground-secondary mb-1.5 block"
                >
                  {t('label_password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('placeholder_password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  className="w-full h-11 bg-background border border-border rounded-[calc(var(--radius)*1.2)] text-sm px-3 transition-all duration-200 focus:border-accent-primary focus:shadow-[0_0_0_3px_var(--accent-primary-light)] placeholder:text-foreground-muted"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 font-semibold text-[0.9375rem] rounded-[calc(var(--radius)*1.2)] bg-primary text-primary-foreground cursor-pointer transition-all duration-200 hover:not-disabled:-translate-y-px hover:not-disabled:shadow-[0_4px_12px_var(--accent-primary-light)] active:not-disabled:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? t('btn_loading') : isSignIn ? t('btn_sign_in') : t('btn_register')}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6 text-foreground-muted text-xs uppercase tracking-[0.08em] before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
              {t('divider_or')}
            </div>

            {/* Provider buttons */}
            <div className="flex flex-col gap-3">
              <button
                id="google-sign-in-btn"
                type="button"
                disabled={isLoading}
                onClick={() => handleProviderSignIn('google')}
                className="w-full h-11 flex items-center justify-center gap-3 font-medium text-sm rounded-[calc(var(--radius)*1.2)] bg-transparent border border-border text-foreground transition-all duration-200 hover:bg-surface-hover hover:border-foreground-muted hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&_svg]:shrink-0"
              >
                <GoogleIcon />
                {isLoading ? t('btn_loading') : t('provider_google')}
              </button>

              <button
                type="button"
                disabled={true}
                onClick={() => handleProviderSignIn('github')}
                className="w-full h-11 flex items-center justify-center gap-3 font-medium text-sm rounded-[calc(var(--radius)*1.2)] bg-transparent border border-border text-foreground transition-all duration-200 hover:bg-surface-hover hover:border-foreground-muted hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&_svg]:shrink-0"
              >
                <GitHubIcon />
                {t('provider_github')}
              </button>
            </div>

            {/* Toggle section */}
            <p className="text-center text-[0.8125rem] mt-7 text-muted-foreground">
              {isSignIn ? t('toggle_to_register') : t('toggle_to_sign_in')}
              <span
                onClick={toggleAuthMode}
                role="button"
                tabIndex={0}
                className="text-accent-primary cursor-pointer font-semibold ml-1 transition-colors duration-200 hover:text-accent-primary-hover hover:underline"
              >
                {isSignIn ? t('link_register') : t('link_sign_in')}
              </span>
            </p>
          </CardContent>
        </div>
      </div>
    </div>
  );
};
