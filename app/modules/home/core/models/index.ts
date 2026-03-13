/**
 * Interface representing a feature card displayed on the Home page.
 */
export interface IFeatureCard {
  /** Unique identifier for the feature */
  id: string;
  /** Translation key for the feature title */
  titleKey: string;
  /** Translation key for the feature description */
  descriptionKey: string;
  /** Emoji or icon string representing the feature */
  icon: string;
  /** Gradient CSS class or style for the card background accent */
  accentColor: string;
}

/**
 * Interface representing a learning statistic displayed on the Home page.
 */
export interface ILearningStat {
  /** Unique identifier for the stat */
  id: string;
  /** Translation key for the stat label */
  labelKey: string;
  /** Numeric or string value of the stat */
  value: string;
  /** Emoji or icon string for the stat */
  icon: string;
}
