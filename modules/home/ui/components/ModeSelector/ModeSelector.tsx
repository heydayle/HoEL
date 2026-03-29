'use client';

import type { IFeatureHighlight, IModeCard } from '@/modules/home/core/models';
import type { UserMode } from '@/shared/types';

import {
  AppBadge,
  ModeCard,
  ModeCardsGrid,
  ModeCta,
  ModeDescription,
  ModeIcon,
  ModeLabel,
  OnboardingSubtitle,
  OnboardingTitle,
  OnboardingWrapper,
  PulseDot,
} from '../styled';

/**
 * Props for the ModeSelector component.
 */
interface IModeSelectorProps {
  /** Translated onboarding headline */
  title: string;
  /** Translated onboarding subtitle */
  subtitle: string;
  /** Translated app tagline for the badge */
  appTagline: string;
  /** Array of mode card data to render */
  modeCards: IModeCard[];
  /** Feature highlights array (passed down, not rendered here) */
  featureHighlights: IFeatureHighlight[];
  /** Translation function */
  t: (key: string) => string;
  /** Callback fired when a user selects a mode */
  onSelectMode: (mode: UserMode) => void;
}

/**
 * ModeSelector component — the primary call-to-action section of the onboarding page.
 * Renders a headline, subtitle, and two mode cards (Student / Teacher).
 * Selecting a card triggers onSelectMode which persists and navigates.
 * @param props - ModeSelector component props
 * @returns The rendered ModeSelector element
 */
export function ModeSelector({
  title,
  subtitle,
  appTagline,
  modeCards,
  t,
  onSelectMode,
}: IModeSelectorProps): React.JSX.Element {
  return (
    <OnboardingWrapper id="mode-selector-section">
      {/* App badge */}
      <AppBadge>
        <PulseDot aria-hidden="true" />
        {appTagline}
      </AppBadge>

      {/* Headline */}
      <OnboardingTitle>{title}</OnboardingTitle>

      {/* Subtitle */}
      <OnboardingSubtitle>{subtitle}</OnboardingSubtitle>

      {/* Mode cards */}
      <ModeCardsGrid>
        {modeCards.map((card, index) => (
          <ModeCard
            key={card.id}
            id={`mode-card-${card.id}`}
            $accentColor={card.accentColor}
            disabled={!card.active}
            onClick={() => {
              if (card.active) {
                onSelectMode(card.id);
              }
            }}
            style={{
              animationDelay: `${0.1 + index * 0.12}s`,
              opacity: card.active ? 1 : 0.5,
              cursor: card.active ? 'pointer' : 'not-allowed',
              filter: !card.active ? 'grayscale(100%)' : 'none',
            }}
            aria-label={t(card.labelKey)}
          >
            {/* Icon */}
            <ModeIcon aria-hidden="true">{card.icon}</ModeIcon>

            {/* Label */}
            <ModeLabel>{t(card.labelKey)}</ModeLabel>

            {/* Description */}
            <ModeDescription>{t(card.descriptionKey)}</ModeDescription>

            {/* CTA */}
            <ModeCta>
              {t(card.ctaKey)}
              <span aria-hidden="true">→</span>
            </ModeCta>
          </ModeCard>
        ))}
      </ModeCardsGrid>
    </OnboardingWrapper>
  );
}
