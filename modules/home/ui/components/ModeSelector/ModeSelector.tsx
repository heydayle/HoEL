'use client';

import type { IFeatureHighlight, IModeCard } from '@/modules/home/core/models';
import type { UserMode } from '@/shared/types';
import { motion } from 'framer-motion';

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

/** Spring physics config as specified by the design system */
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 20 };

/**
 * ModeSelector — Neo-Brutalism Bento Box primary CTA section.
 * Features word reveal animation, thick bordered cards with solid shadows,
 * and spring physics hover interactions.
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
  /** Split title into words for stagger reveal */
  const titleWords = title.split(' ');

  return (
    <section id="mode-selector-section" className="flex flex-col items-center gap-8 text-center max-w-[42rem]">
      {/* App badge */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="inline-flex items-center gap-2 py-2 px-5 rounded-full border-2 border-brutal-black text-xs font-bold uppercase tracking-widest bg-lemon text-brutal-black shadow-[var(--shadow-brutal-sm)]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-brutal-black" aria-hidden="true" />
        {appTagline}
      </motion.span>

      {/* Headline — word reveal animation */}
      <h1 className="m-0 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
        {titleWords.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 + i * 0.08 }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
        className="m-0 text-lg text-foreground-secondary max-w-[32rem] leading-relaxed"
      >
        {subtitle}
      </motion.p>

      {/* Mode cards — Bento style */}
      <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-2 mt-4">
        {modeCards.map((card, index) => (
          <motion.button
            key={card.id}
            id={`mode-card-${card.id}`}
            disabled={!card.active}
            onClick={() => {
              if (card.active) {
                onSelectMode(card.id);
              }
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.2 + index * 0.12 }}
            whileHover={card.active ? { y: -4, x: -4, boxShadow: 'var(--shadow-brutal-md)' } : undefined}
            whileTap={card.active ? { y: 1, x: 1, boxShadow: 'none' } : undefined}
            style={{
              opacity: card.active ? 1 : 0.5,
              cursor: card.active ? 'pointer' : 'not-allowed',
              filter: !card.active ? 'grayscale(100%)' : 'none',
            }}
            aria-label={t(card.labelKey)}
            className="flex flex-col items-center gap-4 p-8 rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-card text-center shadow-[var(--shadow-brutal-sm)] transition-colors"
          >
            <span className="text-5xl" aria-hidden="true">{card.icon}</span>
            <span className="text-xl font-extrabold text-foreground">{t(card.labelKey)}</span>
            <span className="text-sm text-foreground-secondary leading-relaxed">{t(card.descriptionKey)}</span>
            <span className="mt-2 inline-flex items-center gap-1.5 py-2.5 px-6 rounded-full border-2 border-brutal-black text-sm font-bold bg-primary text-primary-foreground shadow-[var(--shadow-brutal-sm)]">
              {t(card.ctaKey)}
              <span aria-hidden="true">→</span>
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
