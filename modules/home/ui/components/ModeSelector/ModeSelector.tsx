'use client';

import type { IFeatureHighlight, IModeCard } from '@/modules/home/core/models';
import type { UserMode } from '@/shared/types';

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
 * Renders a headline, subtitle, and mode cards (Student / Teacher).
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
    <section id="mode-selector-section" className="flex flex-col items-center gap-6 text-center max-w-[42rem]">
      {/* App badge */}
      <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-semibold uppercase tracking-widest bg-accent-primary-light text-accent-primary border border-accent-primary/20">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" aria-hidden="true" />
        {appTagline}
      </span>

      {/* Headline */}
      <h1 className="m-0 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight bg-[var(--gradient-hero)] bg-clip-text text-transparent">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="m-0 text-lg text-foreground-secondary max-w-[32rem] leading-relaxed">
        {subtitle}
      </p>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2 mt-4">
        {modeCards.map((card, index) => (
          <button
            key={card.id}
            id={`mode-card-${card.id}`}
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
              ['--card-accent' as string]: card.accentColor,
            }}
            aria-label={t(card.labelKey)}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-surface-border bg-surface text-center transition-all duration-300 animate-[fadeInUp_0.5s_ease-out_both] hover:enabled:border-[var(--card-accent)] hover:enabled:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:enabled:-translate-y-1 active:enabled:scale-[0.98]"
          >
            <span className="text-4xl" aria-hidden="true">{card.icon}</span>
            <span className="text-xl font-bold text-foreground">{t(card.labelKey)}</span>
            <span className="text-sm text-foreground-secondary leading-relaxed">{t(card.descriptionKey)}</span>
            <span className="mt-2 inline-flex items-center gap-1.5 py-2 px-5 rounded-full text-sm font-semibold bg-accent-primary text-white">
              {t(card.ctaKey)}
              <span aria-hidden="true">→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
