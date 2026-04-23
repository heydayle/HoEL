"use client";

import type { Locale } from "@/shared/types";

/**
 * Props for the HomeHeader component.
 */
interface IHomeHeaderProps {
  /** The currently resolved theme ("light" | "dark") */
  resolvedTheme: "light" | "dark";
  /** Callback to toggle the theme */
  onThemeToggle: () => void;
  /** The currently active locale */
  locale: Locale;
  /** Callback to change the locale */
  onLocaleChange: (locale: Locale) => void;
}

/**
 * Neo-Brutalism header bar for the Home onboarding page.
 * Features solid background, thick bottom border, and
 * pill-shaped control buttons with brutalist shadows.
 * @param props - HomeHeader props including theme and locale controls
 * @returns The rendered HomeHeader element
 */
export function HomeHeader({
  resolvedTheme,
  onThemeToggle,
  locale,
  onLocaleChange,
}: IHomeHeaderProps): React.JSX.Element {
  return (
    <header
      id="home-header"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-cream border-b-2 border-brutal-black"
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-lemon text-lg shadow-[var(--shadow-brutal-sm)]" aria-hidden="true">
          📝
        </span>
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          LingoNote
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Locale Switcher */}
        <div className="flex items-center gap-1 rounded-full border-2 border-brutal-black bg-brutal-white p-1 shadow-[var(--shadow-brutal-sm)]">
          <button
            id="header-locale-en"
            onClick={() => onLocaleChange("en")}
            className={`
              flex cursor-pointer items-center gap-1.5
              rounded-full px-3 py-1.5
              text-sm font-bold
              transition-all duration-200
              ${locale === "en"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground-secondary hover:text-foreground"
              }
            `}
            aria-label="Switch to English"
          >
            <span className="text-base">🇬🇧</span>
            <span className="hidden sm:inline">EN</span>
          </button>
          <button
            id="header-locale-vi"
            onClick={() => onLocaleChange("vi")}
            className={`
              flex cursor-pointer items-center gap-1.5
              rounded-full px-3 py-1.5
              text-sm font-bold
              transition-all duration-200
              ${locale === "vi"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground-secondary hover:text-foreground"
              }
            `}
            aria-label="Chuyển sang Tiếng Việt"
          >
            <span className="text-base">🇻🇳</span>
            <span className="hidden sm:inline">VI</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          id="header-theme-toggle"
          onClick={onThemeToggle}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-brutal-black bg-brutal-white text-foreground shadow-[var(--shadow-brutal-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:translate-x-px active:shadow-none"
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" /><path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
