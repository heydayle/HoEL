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
