import styled, { keyframes } from 'styled-components';

import { Button, Card, Input } from '@/shared/components/Styled';

/* ============================================================
 * Page-level styled components for the Auth pages
 * ============================================================ */

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/**
 * Full-height page wrapper with centered gradient background.
 */
export const AuthPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--background);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: var(--gradient-glow);
    pointer-events: none;
    z-index: 0;
  }
`;

/**
 * Container wrapping the card and brand, with entrance animation.
 */
export const AuthContentContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  animation: ${fadeInUp} 0.6s ease-out;
`;

/**
 * Brand header section above the card.
 */
export const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

/**
 * Application name with gradient text.
 */
export const BrandName = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: var(--gradient-hero);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

/**
 * App tagline text below the brand name.
 */
export const BrandTagline = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  letter-spacing: 0.01em;
`;

/**
 * Styled auth card with glass-morphism effect.
 */
export const StyledAuthCard = styled(Card)`
  width: 100%;
  border: 1px solid var(--surface-border);
  background: var(--surface);
  box-shadow: var(--surface-shadow);
  border-radius: calc(var(--radius) * 1.6);
  backdrop-filter: blur(12px);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: var(--surface-shadow-hover);
  }
`;

/**
 * Styled page title inside the card.
 */
export const AuthTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.02em;
`;

/**
 * Subtitle/description text.
 */
export const AuthSubtitle = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

/**
 * Form field wrapper with label and input spacing.
 */
export const FormField = styled.div`
  margin-bottom: 1.25rem;
`;

/**
 * Styled form label.
 */
export const FormLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground-secondary);
  margin-bottom: 0.375rem;
  display: block;
`;

/**
 * Styled input extending Shadcn Input with consistent sizing.
 */
export const StyledInput = styled(Input)`
  height: 2.75rem;
  background: var(--background);
  border-color: var(--border);
  border-radius: calc(var(--radius) * 1.2);
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-light);
  }

  &::placeholder {
    color: var(--foreground-muted);
  }
`;

/**
 * Styled submit button with gradient and micro-animation.
 */
export const SubmitButton = styled(Button)`
  width: 100%;
  height: 2.75rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: calc(var(--radius) * 1.2);
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--accent-primary-light);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Error message banner.
 */
export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: calc(var(--radius) * 1.2);
  background: var(--accent-warm-light);
  border: 1px solid var(--accent-warm);
  color: var(--accent-warm);
  font-size: 0.8125rem;
  font-weight: 500;
  animation: ${fadeInUp} 0.3s ease-out;
`;

/**
 * Toggle link text at the bottom of the form.
 */
export const ToggleSection = styled.p`
  text-align: center;
  font-size: 0.8125rem;
  margin-top: 1.75rem;
  color: var(--muted-foreground);
`;

/**
 * Toggle link styled as an inline anchor.
 */
export const ToggleLink = styled.span`
  color: var(--accent-primary);
  cursor: pointer;
  font-weight: 600;
  margin-left: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-primary-hover);
    text-decoration: underline;
  }
`;

/**
 * Separator line with optional "or" text.
 */
export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: var(--foreground-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
`;

/**
 * Container for provider sign-in buttons.
 */
export const ProviderButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Styled button for OAuth provider sign-in (Google, GitHub, etc.).
 */
export const ProviderButton = styled(Button)`
  width: 100%;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: calc(var(--radius) * 1.2);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: var(--surface-hover);
    border-color: var(--foreground-muted);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    flex-shrink: 0;
  }
`;

