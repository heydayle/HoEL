"use client";

import { useCallback, useEffect, useState } from "react";

import type { ThemeMode } from "@/shared/types";

/** Key used to persist the selected theme in localStorage */
const THEME_STORAGE_KEY = "elh-theme";

/**
 * Resolves the effective theme (light/dark) from the given mode.
 * If mode is "system", it checks the user's OS preference.
 * @param mode - The theme mode to resolve
 * @returns The resolved theme: "light" or "dark"
 */
const resolveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "system") {
    if (typeof window === "undefined") {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
};

/**
 * Custom hook that manages the application's theme (light/dark/system).
 * Persists the user's choice in localStorage and applies it to the document.
 * @returns An object containing the current theme mode, resolved theme, and a setter function.
 */
export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  /** Applies the resolved theme to the document's data-theme attribute */
  const applyTheme = useCallback((theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    setResolvedTheme(theme);
  }, []);

  /** Initializes the theme from localStorage or system preference */
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const initialMode: ThemeMode = stored ?? "system";
    setMode(initialMode);
    applyTheme(resolveTheme(initialMode));
  }, [applyTheme]);

  /** Listens for OS-level color scheme changes when mode is "system" */
  useEffect(() => {
    if (mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * Handler for media query change events.
     * @param e - The media query list event
     */
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mode, applyTheme]);

  /**
   * Sets the theme mode and persists it to localStorage.
   * @param newMode - The new theme mode to apply
   */
  const setThemeMode = useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      applyTheme(resolveTheme(newMode));
    },
    [applyTheme]
  );

  return {
    /** The current theme mode setting (light/dark/system) */
    mode,
    /** The actual resolved theme being applied (light or dark) */
    resolvedTheme,
    /** Function to update the theme mode */
    setThemeMode,
  };
};
