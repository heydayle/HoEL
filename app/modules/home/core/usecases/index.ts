import type { IFeatureCard, ILearningStat } from "../models";

/**
 * Predefined feature cards showcasing the app's learning modules.
 * Acts as a static data source until a backend is connected.
 */
export const HOME_FEATURES: IFeatureCard[] = [
  {
    id: "vocabulary",
    titleKey: "feature_vocabulary_title",
    descriptionKey: "feature_vocabulary_desc",
    icon: "📚",
    accentColor: "accent-primary",
  },
  {
    id: "grammar",
    titleKey: "feature_grammar_title",
    descriptionKey: "feature_grammar_desc",
    icon: "✏️",
    accentColor: "accent-secondary",
  },
  {
    id: "history",
    titleKey: "feature_history_title",
    descriptionKey: "feature_history_desc",
    icon: "🏛️",
    accentColor: "accent-warm",
  },
  {
    id: "quiz",
    titleKey: "feature_quiz_title",
    descriptionKey: "feature_quiz_desc",
    icon: "🧠",
    accentColor: "accent-gold",
  },
];

/**
 * Predefined learning statistics for the home page hero section.
 * Acts as a static data source until a backend is connected.
 */
export const HOME_STATS: ILearningStat[] = [
  {
    id: "words-learned",
    labelKey: "stat_words",
    value: "2,450",
    icon: "📖",
  },
  {
    id: "lessons-completed",
    labelKey: "stat_lessons",
    value: "128",
    icon: "✅",
  },
  {
    id: "day-streak",
    labelKey: "stat_streak",
    value: "32",
    icon: "🔥",
  },
  {
    id: "accuracy",
    labelKey: "stat_accuracy",
    value: "94%",
    icon: "🎯",
  },
];

/**
 * Use case function to retrieve the feature cards for the Home page.
 * Currently returns static data. Will be replaced by repository call in the future.
 * @returns An array of feature card objects
 */
export const getHomeFeatures = (): IFeatureCard[] => {
  return HOME_FEATURES;
};

/**
 * Use case function to retrieve the learning statistics for the Home page.
 * Currently returns static data. Will be replaced by repository call in the future.
 * @returns An array of learning stat objects
 */
export const getHomeStats = (): ILearningStat[] => {
  return HOME_STATS;
};
