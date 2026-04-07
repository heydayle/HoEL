"use client";

import type { IFeatureHighlight } from "@/modules/home/core/models";

/**
 * Props for the FeatureHighlights component.
 */
interface IFeatureHighlightsProps {
  /** Array of feature highlight data to render */
  highlights: IFeatureHighlight[];
  /** Translation function to resolve title/description keys */
  t: (key: string) => string;
}

/**
 * FeatureHighlights component displaying app capabilities as compact pills.
 * Positioned below the mode selector cards on the onboarding screen.
 * @param props - FeatureHighlights props
 * @returns The rendered FeatureHighlights element
 */
export function FeatureHighlights({
  highlights,
  t,
}: IFeatureHighlightsProps): React.JSX.Element {
  return (
    <section id="feature-highlights-section" aria-label="App features" className="w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {highlights.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-surface border border-surface-border text-sm font-medium text-foreground-secondary transition-all duration-200 hover:border-accent-primary/40 hover:bg-surface-hover"
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{t(item.titleKey)}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
