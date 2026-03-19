/**
 * Enum representing the two user modes available in the application.
 * Selected by the user on first load and persisted in localStorage.
 */
export type UserMode = "student" | "teacher";

/**
 * Interface representing a selectable user mode card on the onboarding screen.
 */
export interface IModeCard {
  /** Unique identifier matching the UserMode value */
  id: UserMode;
  /** Translation key for the mode label */
  labelKey: string;
  /** Translation key for the mode description */
  descriptionKey: string;
  /** Translation key for the CTA button text */
  ctaKey: string;
  /** Emoji or icon string for the mode */
  icon: string;
  /** Accent color key for theming */
  accentColor: "accent-primary" | "accent-secondary";
}

/**
 * Interface representing a feature highlight card on the onboarding screen.
 */
export interface IFeatureHighlight {
  /** Unique identifier for the feature */
  id: string;
  /** Translation key for the feature title */
  titleKey: string;
  /** Translation key for the feature description */
  descriptionKey: string;
  /** Emoji or icon string for the feature */
  icon: string;
}

/**
 * Interface representing a feature card in the feature grid.
 */
export interface IFeatureCard {
  /** Unique identifier for the feature */
  id: string;
  /** Translation key for the feature title */
  titleKey: string;
  /** Translation key for the feature description */
  descriptionKey: string;
  /** Emoji or icon string for the feature */
  icon: string;
  /** Accent color key for styling the card */
  accentColor: "accent-primary" | "accent-secondary" | "accent-warm" | "accent-gold";
}

/**
 * Interface representing a learning statistic card.
 */
export interface ILearningStat {
  /** Unique identifier for the stat */
  id: string;
  /** Numeric value to display */
  value: number | string;
  /** Translation key for the stat label */
  labelKey: string;
  /** Emoji or icon string for the stat */
  icon: string;
}
