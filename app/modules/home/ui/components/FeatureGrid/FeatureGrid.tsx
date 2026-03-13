"use client";

import type { IFeatureCard } from "@/app/modules/home/core/models";

/**
 * Props for the FeatureGrid component.
 */
interface IFeatureGridProps {
  /** Array of feature card objects to display */
  features: IFeatureCard[];
  /** Translation function to resolve feature title/description keys */
  t: (key: string) => string;
  /** Translated section title */
  sectionTitle: string;
  /** Translated section subtitle */
  sectionSubtitle: string;
}

/** Maps feature accent color keys to Tailwind bg-color utility classes */
const ACCENT_BG_MAP: Record<string, string> = {
  "accent-primary": "bg-accent-primary-light",
  "accent-secondary": "bg-accent-secondary-light",
  "accent-warm": "bg-accent-warm-light",
  "accent-gold": "bg-accent-gold-light",
};

/** Maps feature accent color keys to Tailwind text-color utility classes */
const ACCENT_TEXT_MAP: Record<string, string> = {
  "accent-primary": "text-accent-primary",
  "accent-secondary": "text-accent-secondary",
  "accent-warm": "text-accent-warm",
  "accent-gold": "text-accent-gold",
};

/**
 * FeatureGrid component displaying feature cards in a responsive grid.
 * Each card has a colored icon badge, title, description, and hover effects.
 * @param props - FeatureGrid props including features data and translations
 * @returns The rendered FeatureGrid element
 */
export default function FeatureGrid({
  features,
  t,
  sectionTitle,
  sectionSubtitle,
}: IFeatureGridProps): React.JSX.Element {
  return (
    <section
      id="features-section"
      className="mx-auto w-full max-w-6xl px-6 py-20"
    >
      {/* Section heading */}
      <div
        className="mb-14 flex flex-col items-center text-center"
        style={{ animation: "fadeInUp 0.7s ease-out" }}
      >
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          {sectionTitle}
        </h2>
        <p className="mt-4 max-w-lg text-base text-foreground-secondary">
          {sectionSubtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <article
            key={feature.id}
            className="
              group relative flex flex-col gap-5
              rounded-[var(--radius-lg)] border border-surface-border
              bg-surface p-7
              shadow-[var(--surface-shadow)]
              transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:border-transparent
              hover:shadow-[var(--surface-shadow-hover)]
              hover:-translate-y-2
              cursor-pointer
            "
            style={{
              animation: `fadeInUp 0.6s ease-out ${0.1 + index * 0.12}s both`,
            }}
          >
            {/* Card gradient overlay on hover */}
            <div
              className="
                pointer-events-none absolute inset-0
                rounded-[var(--radius-lg)] opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
              style={{ background: "var(--gradient-card)" }}
              aria-hidden="true"
            />

            {/* Icon badge */}
            <div
              className={`
                relative z-10 flex h-14 w-14 items-center justify-center
                rounded-[var(--radius-md)]
                text-2xl
                transition-transform duration-[var(--transition-spring)]
                group-hover:scale-110
                ${ACCENT_BG_MAP[feature.accentColor] ?? "bg-accent-primary-light"}
              `}
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h3
              className={`
                relative z-10 text-lg font-semibold
                ${ACCENT_TEXT_MAP[feature.accentColor] ?? "text-accent-primary"}
                transition-colors duration-200
              `}
            >
              {t(feature.titleKey)}
            </h3>

            {/* Description */}
            <p className="relative z-10 text-sm leading-relaxed text-foreground-secondary">
              {t(feature.descriptionKey)}
            </p>

            {/* Bottom accent bar */}
            <div
              className={`
                relative z-10 mt-auto h-1 w-0
                rounded-full
                transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                group-hover:w-full
                ${feature.accentColor === "accent-primary" ? "bg-accent-primary" : ""}
                ${feature.accentColor === "accent-secondary" ? "bg-accent-secondary" : ""}
                ${feature.accentColor === "accent-warm" ? "bg-accent-warm" : ""}
                ${feature.accentColor === "accent-gold" ? "bg-accent-gold" : ""}
              `}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
