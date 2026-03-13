"use client";

/**
 * Props for the ThemeToggle atom component.
 */
interface IThemeToggleProps {
  /** The currently resolved theme (light or dark) */
  resolvedTheme: "light" | "dark";
  /** Callback to toggle the theme */
  onToggle: () => void;
}

/**
 * Theme toggle button atom that switches between light/dark modes.
 * Displays a sun icon for dark mode and a moon icon for light mode.
 * @param props - ThemeToggle props including resolved theme and toggle callback
 * @returns The rendered ThemeToggle element
 */
export default function ThemeToggle({
  resolvedTheme,
  onToggle,
}: IThemeToggleProps): React.JSX.Element {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="
        relative flex h-10 w-10 items-center justify-center
        rounded-[var(--radius-md)] bg-surface-hover
        text-foreground-secondary
        transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:bg-accent-primary-light hover:text-accent-primary
        cursor-pointer
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
          className="transition-transform duration-300"
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
          className="transition-transform duration-300"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
