"use client";

import type { Locale } from "@/app/shared/types";

/**
 * Props for the LocaleSwitcher atom component.
 */
interface ILocaleSwitcherProps {
  /** The currently active locale */
  locale: Locale;
  /** Callback to change the locale */
  onLocaleChange: (locale: Locale) => void;
}

/**
 * Locale switcher atom that toggles between English and Vietnamese.
 * Displays flag emoji indicators for each language option.
 * @param props - LocaleSwitcher props including locale and change callback
 * @returns The rendered LocaleSwitcher element
 */
export default function LocaleSwitcher({
  locale,
  onLocaleChange,
}: ILocaleSwitcherProps): React.JSX.Element {
  return (
    <div
      id="locale-switcher"
      className="
        flex items-center gap-1
        rounded-[var(--radius-md)]
        bg-surface-hover p-1
      "
    >
      <button
        id="locale-btn-en"
        onClick={() => {
          onLocaleChange("en");
        }}
        className={`
          flex items-center gap-1.5
          rounded-[var(--radius-sm)] px-3 py-1.5
          text-sm font-medium
          transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          cursor-pointer
          ${
            locale === "en"
              ? "bg-accent-primary text-white shadow-sm"
              : "text-foreground-secondary hover:text-foreground"
          }
        `}
        aria-label="Switch to English"
      >
        <span className="text-base">🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        id="locale-btn-vi"
        onClick={() => {
          onLocaleChange("vi");
        }}
        className={`
          flex items-center gap-1.5
          rounded-[var(--radius-sm)] px-3 py-1.5
          text-sm font-medium
          transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          cursor-pointer
          ${
            locale === "vi"
              ? "bg-accent-primary text-white shadow-sm"
              : "text-foreground-secondary hover:text-foreground"
          }
        `}
        aria-label="Chuyển sang Tiếng Việt"
      >
        <span className="text-base">🇻🇳</span>
        <span>VI</span>
      </button>
    </div>
  );
}
