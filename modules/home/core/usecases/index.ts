import type { IFeatureHighlight, IModeCard, UserMode } from "../models";

/** localStorage key for persisting the selected user mode */
const USER_MODE_STORAGE_KEY = "lingonote_user_mode";

/**
 * Static data: mode cards for the onboarding screen.
 * Each card describes a user mode (student / teacher).
 */
export const HOME_MODE_CARDS: IModeCard[] = [
  {
    id: "student",
    labelKey: "mode_student_label",
    descriptionKey: "mode_student_description",
    ctaKey: "cta_student",
    icon: "🎓",
    accentColor: "accent-primary",
    active: true
  },
  {
    id: "teacher",
    labelKey: "mode_teacher_label",
    descriptionKey: "mode_teacher_description",
    ctaKey: "cta_teacher",
    icon: "📝",
    accentColor: "accent-secondary",
    active: false
  },
];

/**
 * Static data: feature highlights for the onboarding screen.
 * These surface the app's core capabilities.
 */
export const HOME_FEATURE_HIGHLIGHTS: IFeatureHighlight[] = [
  {
    id: "offline",
    titleKey: "feature_offline_title",
    descriptionKey: "feature_offline_desc",
    icon: "🔒",
  },
  {
    id: "vocab",
    titleKey: "feature_vocab_title",
    descriptionKey: "feature_vocab_desc",
    icon: "📚",
  },
  {
    id: "notes",
    titleKey: "feature_notes_title",
    descriptionKey: "feature_notes_desc",
    icon: "🗒️",
  },
  {
    id: "export",
    titleKey: "feature_export_title",
    descriptionKey: "feature_export_desc",
    icon: "📤",
  },
];

/**
 * Use case: retrieve the user mode cards displayed on the onboarding screen.
 * @returns An array of IModeCard objects
 */
export const getModeCards = (): IModeCard[] => HOME_MODE_CARDS;

/**
 * Use case: retrieve the feature highlight cards displayed on the onboarding screen.
 * @returns An array of IFeatureHighlight objects
 */
export const getFeatureHighlights = (): IFeatureHighlight[] =>
  HOME_FEATURE_HIGHLIGHTS;

/**
 * Use case: persist the selected user mode to localStorage.
 * @param mode - The user mode to save ("student" | "teacher")
 */
export const saveUserMode = (mode: UserMode): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_MODE_STORAGE_KEY, mode);
  }
};

/**
 * Use case: read the persisted user mode from localStorage.
 * @returns The stored UserMode or null if not yet set
 */
export const getUserMode = (): UserMode | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_MODE_STORAGE_KEY);
  if (stored === "student" || stored === "teacher") return stored;
  return null;
};
