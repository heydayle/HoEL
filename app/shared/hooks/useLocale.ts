"use client";

import { useCallback, useEffect, useState } from "react";

import type { Locale, TranslationMessages } from "@/app/shared/types";

/** Key used to persist the selected locale in localStorage */
const LOCALE_STORAGE_KEY = "elh-locale";

/** Default locale when none is stored */
const DEFAULT_LOCALE: Locale = "en";

/**
 * Custom hook that provides i18n translation functionality.
 * Loads locale messages dynamically and persists locale in localStorage.
 * @param messages - An object mapping locale codes to their translation messages
 * @returns An object containing the current locale, a translation function, and a locale setter.
 */
export const useLocale = (
  messages: Record<Locale, TranslationMessages>
) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  /** Initializes locale from localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && (stored === "en" || stored === "vi")) {
      setLocaleState(stored);
    }
  }, []);

  /**
   * Sets the active locale and persists it to localStorage.
   * @param newLocale - The locale to switch to
   */
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  /**
   * Returns the translated string for a given key in the current locale.
   * Falls back to the key itself if no translation is found.
   * @param key - The translation key to look up
   * @returns The translated string or the key if not found
   */
  const t = useCallback(
    (key: string): string => {
      const currentMessages = messages[locale];
      return currentMessages?.[key] ?? key;
    },
    [locale, messages]
  );

  return {
    /** The current active locale */
    locale,
    /** Function to change the active locale */
    setLocale,
    /** Translation function */
    t,
  };
};
