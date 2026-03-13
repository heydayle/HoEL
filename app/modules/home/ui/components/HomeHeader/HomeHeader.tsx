"use client";

import type { Locale } from "@/app/shared/types";

/**
 * Props for the HomeHeader component.
 */
interface IHomeHeaderProps {
  /** The currently resolved theme (light or dark) */
  resolvedTheme: "light" | "dark";
  /** Callback to toggle the theme */
  onThemeToggle: () => void;
  /** The currently active locale */
  locale: Locale;
  /** Callback to change the locale */
  onLocaleChange: (locale: Locale) => void;
}

/**
 * Header/navigation bar component for the Home page.
 * Contains the app logo/brand, theme toggle, and locale switcher.
 * Features a frosted glass background effect that blurs content on scroll.
 * @param props - HomeHeader props including theme and locale controls
 * @returns The rendered HomeHeader element
 */
export default function HomeHeader({
  resolvedTheme,
  onThemeToggle,
  locale,
  onLocaleChange,
}: IHomeHeaderProps): React.JSX.Element {
  return (
    <header
      id="home-header"
      className="
        fixed top-0 right-0 left-0 z-50
        flex h-16 items-center justify-between
        border-b border-surface-border
        bg-background/80 px-6
        backdrop-blur-xl
      "
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-[var(--radius-md)]
            bg-accent-primary text-lg text-white
          "
        >
          📜
        </div>
        <span className="text-base font-bold tracking-tight text-foreground">
          ELH
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Locale Switcher */}
        <div className="flex items-center gap-1 rounded-[var(--radius-md)] bg-surface-hover p-1">
          <button
            id="header-locale-en"
            onClick={() => {
              onLocaleChange("en");
            }}
            className={`
              flex items-center gap-1.5
              rounded-[var(--radius-sm)] px-3 py-1.5
              text-sm font-medium cursor-pointer
              transition-all duration-200
              ${
                locale === "en"
                  ? "bg-accent-primary text-white shadow-sm"
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
            onClick={() => {
              onLocaleChange("vi");
            }}
            className={`
              flex items-center gap-1.5
              rounded-[var(--radius-sm)] px-3 py-1.5
              text-sm font-medium cursor-pointer
              transition-all duration-200
              ${
                locale === "vi"
                  ? "bg-accent-primary text-white shadow-sm"
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
          className="
            flex h-10 w-10 items-center justify-center
            rounded-[var(--radius-md)] bg-surface-hover
            text-foreground-secondary cursor-pointer
            transition-all duration-200
            hover:bg-accent-primary-light hover:text-accent-primary
            active:scale-[0.92]
          "
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
