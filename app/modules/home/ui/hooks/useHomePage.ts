"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  getFeatureHighlights,
  getModeCards,
  saveUserMode,
} from "@/app/modules/home/core/usecases";
import enMessages from "@/app/modules/home/messages/en.json";
import viMessages from "@/app/modules/home/messages/vi.json";
import { useLocale, useTheme } from "@/app/shared/hooks";
import type { Locale, TranslationMessages, UserMode } from "@/app/shared/types";

/**
 * Messages map keyed by locale for the Home module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Custom hook encapsulating all state and logic for the Home onboarding page.
 * Combines theme, locale, mode selection, and onboarding data into a single facade.
 * @returns An object with all data and handlers needed to render the Home page.
 */
export const useHomePage = () => {
  const router = useRouter();
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);

  /** Memoized mode cards from the use case layer */
  const modeCards = useMemo(() => getModeCards(), []);

  /** Memoized feature highlights from the use case layer */
  const featureHighlights = useMemo(() => getFeatureHighlights(), []);

  /**
   * Handles mode selection: saves to localStorage and navigates to /lessons.
   * @param selectedMode - The user mode selected ("student" | "teacher")
   */
  const handleSelectMode = (selectedMode: UserMode): void => {
    saveUserMode(selectedMode);
    router.push("/lessons");
  };

  /**
   * Toggles between light and dark theme modes.
   * If the current mode is "system", resolves the opposite of the current resolved theme.
   */
  const toggleTheme = (): void => {
    if (mode === "system") {
      setThemeMode(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }
    setThemeMode(mode === "dark" ? "light" : "dark");
  };

  return {
    /** Current resolved theme */
    resolvedTheme,
    /** Toggle theme handler */
    toggleTheme,
    /** Current locale */
    locale,
    /** Locale setter */
    setLocale,
    /** Translation function */
    t,
    /** Mode selection cards */
    modeCards,
    /** Feature highlight cards */
    featureHighlights,
    /** Mode selection handler */
    handleSelectMode,
  };
};
