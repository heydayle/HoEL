"use client";

import { useMemo } from "react";

import { getHomeFeatures, getHomeStats } from "@/app/modules/home/core/usecases";
import enMessages from "@/app/modules/home/messages/en.json";
import viMessages from "@/app/modules/home/messages/vi.json";
import { useLocale, useTheme } from "@/app/shared/hooks";
import type { Locale, TranslationMessages } from "@/app/shared/types";

/**
 * Messages map keyed by locale for the Home module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages,
  vi: viMessages,
};

/**
 * Custom hook encapsulating all state and logic for the Home page.
 * Combines theme, locale, and data (features/stats) into a single facade.
 * @returns An object with all data and handlers needed to render the Home page.
 */
export const useHomePage = () => {
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);

  /** Memoized feature cards from the use case layer */
  const features = useMemo(() => {
    return getHomeFeatures();
  }, []);

  /** Memoized stat items from the use case layer */
  const stats = useMemo(() => {
    return getHomeStats();
  }, []);

  /**
   * Toggles between light and dark theme modes.
   * If the current mode is "system", it resolves the opposite of the current resolved theme.
   */
  const toggleTheme = () => {
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
    /** Feature card data */
    features,
    /** Learning stats data */
    stats,
  };
};
