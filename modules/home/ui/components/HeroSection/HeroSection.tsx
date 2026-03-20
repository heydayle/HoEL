"use client";

/**
 * Props for the HeroSection component.
 */
interface IHeroSectionProps {
  /** Translated hero greeting text */
  greeting: string;
  /** Translated hero subtitle text */
  subtitle: string;
  /** Translated CTA start button label */
  ctaStart: string;
  /** Translated CTA explore button label */
  ctaExplore: string;
}

/**
 * Hero section component for the Home page.
 * Displays a prominent greeting, subtitle, and call-to-action buttons
 * with animated gradient background and glow effects.
 * @param props - HeroSection props containing translated text
 * @returns The rendered HeroSection element
 */
export default function HeroSection({
  greeting,
  subtitle,
  ctaStart,
  ctaExplore,
}: IHeroSectionProps): React.JSX.Element {
  return (
    <section
      id="hero-section"
      className="
        relative flex min-h-[85vh] flex-col items-center justify-center
        overflow-hidden px-6 py-24 text-center
      "
    >
      {/* Background glow effect */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-60
        "
        style={{
          background: "var(--gradient-glow)",
        }}
        aria-hidden="true"
      />

      {/* Floating decorative orbs */}
      <div
        className="
          pointer-events-none absolute -top-20 -left-20
          h-72 w-72 rounded-full
          bg-accent-primary opacity-[0.08]
          blur-3xl
        "
        style={{ animation: "float 6s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div
        className="
          pointer-events-none absolute -right-20 -bottom-20
          h-80 w-80 rounded-full
          bg-accent-secondary opacity-[0.08]
          blur-3xl
        "
        style={{ animation: "float 8s ease-in-out infinite 2s" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative z-10 flex max-w-3xl flex-col items-center gap-8"
        style={{ animation: "fadeInUp 0.8s ease-out" }}
      >
        {/* Badge */}
        <div
          className="
            inline-flex items-center gap-2
            rounded-[var(--radius-full)]
            bg-accent-primary-light px-4 py-2
            text-sm font-medium text-accent-primary
          "
        >
          <span className="flex h-2 w-2 rounded-full bg-accent-primary" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
          Learn English Through History
        </div>

        {/* Title */}
        <h1
          className="
            text-5xl font-bold leading-tight tracking-tight
            text-foreground
            sm:text-6xl lg:text-7xl
          "
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "var(--gradient-hero)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 4s ease infinite",
            }}
          >
            {greeting}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="
            max-w-xl text-lg leading-relaxed
            text-foreground-secondary
            sm:text-xl
          "
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-center gap-4 pt-4 sm:flex-row"
          style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
        >
          <button
            id="cta-start-btn"
            className="
              inline-flex items-center gap-2
              rounded-[var(--radius-full)]
              bg-accent-primary px-8 py-4
              text-base font-semibold text-white
              shadow-lg
              transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:bg-accent-primary-hover hover:shadow-xl
              hover:-translate-y-0.5
              active:scale-[0.97]
              cursor-pointer
            "
          >
            <span>🚀</span>
            {ctaStart}
          </button>
          <button
            id="cta-explore-btn"
            className="
              inline-flex items-center gap-2
              rounded-[var(--radius-full)]
              border border-surface-border
              bg-transparent px-8 py-4
              text-base font-semibold text-foreground
              transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:border-accent-primary hover:bg-accent-primary-light
              hover:-translate-y-0.5
              active:scale-[0.97]
              cursor-pointer
            "
          >
            {ctaExplore}
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
