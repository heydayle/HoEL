"use client";

import type { IFeatureHighlight } from "@/modules/home/core/models";

import { FeaturePill, FeaturesRow, FeaturesSection } from "../styled";

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
    <FeaturesSection id="feature-highlights-section" aria-label="App features">
      <FeaturesRow>
        {highlights.map((item) => (
          <FeaturePill key={item.id}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{t(item.titleKey)}</span>
          </FeaturePill>
        ))}
      </FeaturesRow>
    </FeaturesSection>
  );
}
