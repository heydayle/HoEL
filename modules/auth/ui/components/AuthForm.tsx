'use client';

import { CardContent, CardHeader } from '@/shared/components/Styled';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { AuthMode, type IAuthFormData } from '../../core/models';
import { useAuthPage } from '../hooks/useAuthPage';
import {
  AuthContentContainer,
  AuthPageWrapper,
  AuthSubtitle,
  AuthTitle,
  BrandName,
  BrandSection,
  BrandTagline,
  Divider,
  ErrorBanner,
  FormField,
  FormLabel,
  ProviderButton,
  ProviderButtonsContainer,
  StyledAuthCard,
  StyledInput,
  SubmitButton,
  ToggleLink,
  ToggleSection,
} from '../pages/styled';

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
  const { t, isSignIn, isLoading, error, toggleAuthMode, handleSubmit } =
    useAuthPage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  /**
   * Handles form submission event.
   * Prevents default form behavior, builds form data, and calls the usecase.
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
        router.push('/')
        router.refresh()
      }
      
    },
    [email, password, displayName, isSignIn, handleSubmit, router],
  );

  const handleProviderSignIn = useCallback((provider: string) => {
    // For now, just log the provider. The actual sign-in logic is not implemented.
    console.log(`Sign in with provider: ${provider}`);
  }, []);

  return (
    <AuthPageWrapper>
      <AuthContentContainer>
        <BrandSection>
          <BrandName>{t('app_name')}</BrandName>
          <BrandTagline>{t('app_tagline')}</BrandTagline>
        </BrandSection>

        <StyledAuthCard>
          <CardHeader>
            <AuthTitle>{t(isSignIn ? 'page_title' : 'page_title_register')}</AuthTitle>
            <AuthSubtitle>
              {isSignIn ? t('page_subtitle_sign_in') : t('page_subtitle_register')}
            </AuthSubtitle>
          </CardHeader>

          <CardContent>
            {error && (
              <ErrorBanner role="alert">
                <AlertCircle size={16} />
                {error}
              </ErrorBanner>
            )}

            <form onSubmit={onSubmit} id="auth-form">
              <FormField>
                <FormLabel htmlFor="email">{t('label_email')}</FormLabel>
                <StyledInput
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('placeholder_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FormField>

              {!isSignIn && (
                <FormField>
                  <FormLabel htmlFor="displayName">{t('label_display_name')}</FormLabel>
                  <StyledInput
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder={t('placeholder_display_name')}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </FormField>
              )}

              <FormField>
                <FormLabel htmlFor="password">{t('label_password')}</FormLabel>
                <StyledInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('placeholder_password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                />
              </FormField>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? t('btn_loading') : isSignIn ? t('btn_sign_in') : t('btn_register')}
              </SubmitButton>
            </form>

            <Divider>{t('divider_or')}</Divider>

            <ProviderButtonsContainer>
              <ProviderButton
                type="button"
                variant="outline"
                disabled={true}
                onClick={() => handleProviderSignIn('google')}
              >
                <GoogleIcon />
                {t('provider_google')}
              </ProviderButton>

              <ProviderButton
                type="button"
                variant="outline"
                disabled={true}
                onClick={() => handleProviderSignIn('github')}
              >
                <GitHubIcon />
                {t('provider_github')}
              </ProviderButton>
            </ProviderButtonsContainer>

            <ToggleSection>
              {isSignIn ? t('toggle_to_register') : t('toggle_to_sign_in')}
              <ToggleLink onClick={toggleAuthMode} role="button" tabIndex={0}>
                {isSignIn ? t('link_register') : t('link_sign_in')}
              </ToggleLink>
            </ToggleSection>
          </CardContent>
        </StyledAuthCard>
      </AuthContentContainer>
    </AuthPageWrapper>
  );
};
