import styled, { keyframes } from "styled-components";

/* ============================================================
 * Shared styled-components for Home module UI components.
 * Per the "styled.tsx Rule", all styled components in this
 * /ui/components/ directory are declared in this single file.
 * ============================================================ */

/** Fade in from bottom animation */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Fade in animation */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/** Scale in animation */
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

/* --- HeroSection --- */

/**
 * Outer wrapper for the Hero section with relative positioning.
 */
export const HeroWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  overflow: hidden;
  padding: 6rem 1.5rem;
  text-align: center;
`;

/**
 * Decorative glow overlay behind the hero content.
 */
export const HeroGlow = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background: var(--gradient-glow);
`;

/**
 * Animated hero content container with fade-in effect.
 */
export const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 48rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

/* --- StatsBar --- */

/**
 * Container for the stats bar section.
 */
export const StatsContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  animation: ${fadeInUp} 0.8s ease-out 0.5s both;
`;

/**
 * Individual stat card with hover lift effect.
 */
export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--surface-border);
  background-color: var(--surface);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(108, 92, 231, 0.3);
    box-shadow: var(--surface-shadow-hover);
    transform: translateY(-4px);
  }
`;

/* --- FeatureGrid --- */

/**
 * Container for the features section including heading.
 */
export const FeaturesSection = styled.section`
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 5rem 1.5rem;
`;

/**
 * Heading container for features section title and subtitle.
 */
export const FeaturesHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3.5rem;
  animation: ${fadeInUp} 0.7s ease-out;
`;

/**
 * Individual feature card with animated hover effects.
 */
export const FeatureCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--surface-border);
  background-color: var(--surface);
  box-shadow: var(--surface-shadow);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    border-color: transparent;
    box-shadow: var(--surface-shadow-hover);
    transform: translateY(-8px);
  }
`;

/* --- HomeHeader --- */

/**
 * Fixed header bar with frosted glass effect.
 */
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
  background-color: rgba(var(--background), 0.8);
  backdrop-filter: blur(24px);
  animation: ${fadeIn} 0.5s ease-out;
`;

/* --- HomeFooter --- */

/**
 * Footer container with top border and secondary background.
 */
export const FooterWrapper = styled.footer`
  margin-top: auto;
  width: 100%;
  border-top: 1px solid var(--surface-border);
  background-color: var(--background-secondary);
  padding: 2.5rem 1.5rem;
`;

/**
 * Centered content area within the footer.
 */
export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  text-align: center;
`;
