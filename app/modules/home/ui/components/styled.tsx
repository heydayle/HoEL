import styled, { css, keyframes } from "styled-components";

/* ============================================================
 * Shared styled-components for Home module UI components.
 * Per the "styled.tsx Rule", all styled components in this
 * /ui/components/ directory are declared in this single file.
 * ============================================================ */

/** Fade in from bottom animation */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Fade in animation */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/** Scale in & up animation */
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;

/* ------------------------------------------------------------------ */
/* HomeHeader                                                           */
/* ------------------------------------------------------------------ */

/** Fixed frosted-glass header bar */
export const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--surface-border);
  background-color: rgba(var(--background-rgb, 10, 10, 20), 0.8);
  backdrop-filter: blur(24px);
  animation: ${fadeIn} 0.5s ease-out;
`;

/* ------------------------------------------------------------------ */
/* AppBrand                                                             */
/* ------------------------------------------------------------------ */

/** Brand logo container */
export const BrandWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/** Colored icon pill for the brand logo */
export const BrandIconPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-md);
  background-color: var(--accent-primary);
  font-size: 1.125rem;
  color: #fff;
`;

/** Brand name text */
export const BrandName = styled.span`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--foreground);
`;

/* ------------------------------------------------------------------ */
/* ModeSelector — Onboarding hero area                                 */
/* ------------------------------------------------------------------ */

/**
 * Central hero wrapper for the mode selection screen.
 * Fills remaining viewport height below the fixed header.
 */
export const OnboardingWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5rem 1.5rem 3rem;
  min-height: calc(100vh - 4rem);
  text-align: center;
  animation: ${fadeInUp} 0.7s ease-out;

  @media (min-width: 768px) {
    padding: 6rem 2rem 4rem;
    justify-content: center;
    min-height: calc(100vh - 4rem);
  }
`;

/** Decorative glow circle behind the headline */
export const HeroGlow = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background: var(--gradient-glow);
`;

/** App name badge shown above the headline */
export const AppBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--accent-primary-light);
  padding: 0.375rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
`;

/** Pulsing dot inside AppBadge */
export const PulseDot = styled.span`
  display: flex;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--accent-primary);
`;

/** Main onboarding headline */
export const OnboardingTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--foreground);
  margin-bottom: 0.75rem;
  max-width: 32rem;

  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

/** Onboarding subtitle below the headline */
export const OnboardingSubtitle = styled.p`
  font-size: 1rem;
  color: var(--foreground-secondary);
  max-width: 26rem;
  line-height: 1.6;
  margin-bottom: 3rem;

  @media (min-width: 640px) {
    font-size: 1.0625rem;
  }
`;

/** Two-column grid that holds the mode cards */
export const ModeCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 44rem;
  margin-bottom: 4rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
`;

/**
 * A clickable mode card.
 * Accent color is applied via CSS custom property --card-accent.
 */
export const ModeCard = styled.button<{ $accentColor: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.75rem;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--surface-border);
  background-color: var(--surface);
  box-shadow: var(--surface-shadow);
  cursor: pointer;
  text-align: left;
  transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${scaleIn} 0.5s ease-out both;

  ${({ $accentColor }) => css`
    --card-accent: var(--${$accentColor});
    --card-accent-light: var(--${$accentColor}-light);
  `}

  &:hover {
    border-color: var(--card-accent);
    box-shadow: 0 0 0 3px var(--card-accent-light), var(--surface-shadow-hover);
    transform: translateY(-6px);
  }

  &:active {
    transform: translateY(-2px) scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid var(--card-accent);
    outline-offset: 3px;
  }
`;

/** Emoji icon pill inside ModeCard */
export const ModeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--radius-md);
  background-color: var(--card-accent-light);
  font-size: 1.625rem;
  transition: transform var(--transition-spring);

  ${ModeCard}:hover & {
    transform: scale(1.12);
  }
`;

/** Mode label inside ModeCard */
export const ModeLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--card-accent);
`;

/** Mode description inside ModeCard */
export const ModeDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--foreground-secondary);
`;

/** CTA link text at the bottom of a ModeCard */
export const ModeCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--card-accent);
`;

/* ------------------------------------------------------------------ */
/* FeatureHighlights                                                    */
/* ------------------------------------------------------------------ */

/** Section wrapping the feature highlight pills */
export const FeaturesSection = styled.section`
  width: 100%;
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 1.5rem 5rem;
  animation: ${fadeInUp} 0.7s ease-out 0.4s both;
`;

/** Row of feature pills */
export const FeaturesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

/** Individual feature pill */
export const FeaturePill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--surface-border);
  background-color: var(--surface);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground-secondary);
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--accent-primary);
    color: var(--foreground);
    background-color: var(--accent-primary-light);
  }
`;

/* ------------------------------------------------------------------ */
/* HomeFooter                                                           */
/* ------------------------------------------------------------------ */

/** Footer container with top border */
export const FooterWrapper = styled.footer`
  margin-top: auto;
  width: 100%;
  border-top: 1px solid var(--surface-border);
  background-color: var(--background-secondary);
  padding: 2rem 1.5rem;
`;

/** Centered footer content */
export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 72rem;
  margin: 0 auto;
  text-align: center;
`;
