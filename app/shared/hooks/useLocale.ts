"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { Locale, TranslationMessages } from "@/app/shared/types";

/** Key used to persist the selected locale in localStorage */
const LOCALE_STORAGE_KEY = "elh-locale";
/** Custom event name to trigger state updates within the same tab */
const LOCAL_STORAGE_EVENT = "elh-locale-change";

/** Default locale when none is stored */
const DEFAULT_LOCALE: Locale = "en";

/**
 * Subscribes to locale changes across tabs (storage) and within the same tab (custom event).
 */
const subscribe = (listener: () => void) => {
  if (typeof window === "undefined") return () => { };

  window.addEventListener("storage", listener);
  window.addEventListener(LOCAL_STORAGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(LOCAL_STORAGE_EVENT, listener);
  };
};

/**
 * Reads the current snapshot of the locale from localStorage.
 */
const getSnapshot = (): Locale => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
  if (stored === "en" || stored === "vi") return stored;

  return DEFAULT_LOCALE;
};

/**
 * Returns the default locale for server-side rendering to prevent hydration errors.
 */
const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

/**
 * Custom hook that provides i18n translation functionality.
 * Loads locale messages dynamically and persists locale in localStorage.
 * @param messages - An object mapping locale codes to their translation messages
 * @returns An object containing the current locale, a translation function, and a locale setter.
 */
export const useLocale = (
  messages: Record<Locale, TranslationMessages>
) => {
  // useSyncExternalStore safely syncs external sources (like localStorage) without cascading renders
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Sets the active locale, persists it to localStorage, and triggers a re-render.
   * @param newLocale - The locale to switch to
   */
  const setLocale = useCallback((newLocale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Dispatch a custom event so `useSyncExternalStore` catches the update in the same tab
      window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
    }
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
