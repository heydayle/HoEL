'use client';

import React from 'react';

import { LocaleSwitcher, ThemeToggle } from '@/shared/components/atoms';
import LogoutButton from '@/shared/components/atoms/Button/LogoutButton';
import { getUserLocal } from '@/shared/hooks/getUserLocal';
import type { Locale } from '@/shared/types';

/**
 * Props for the AppHeader organism component.
 */
export interface IAppHeaderProps {
  /** Left-side content: title block, back button, etc. */
  left?: React.ReactNode;
  /** Optional extra action buttons inserted before the controls */
  actions?: React.ReactNode;
  /** Whether to show the LogoutButton (defaults to true) */
  showLogout?: boolean;
  /** The currently active locale */
  locale: Locale;
  /** Callback to change the locale */
  onLocaleChange: (locale: Locale) => void;
  /** The currently resolved theme (light or dark) */
  resolvedTheme: 'light' | 'dark';
  /** Callback to toggle the theme */
  onToggleTheme: () => void;
}

/**
 * Common sticky header organism with Neo-Brutalism styling.
 * Features solid background, thick bottom border, no glassmorphism.
 *
 * @param props - AppHeader props
 * @returns The rendered AppHeader element
 */
export function AppHeader({
  left,
  actions,
  showLogout = true,
  locale,
  onLocaleChange,
  resolvedTheme,
  onToggleTheme,
}: IAppHeaderProps): React.JSX.Element {
  const { user } = getUserLocal();
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap sticky top-0 z-40 py-3 px-2 bg-cream border-b-2 border-brutal-black">
      {/* Left slot */}
      <div className="flex items-center gap-2">
        {!left && user?.display_name
          ? [
              'Hi, ',
              <span
                key="display-name"
                className="font-bold text-lg"
              >{`${user.display_name}!`}</span>,
            ]
          : left}
      </div>

      {/* Right: actions + controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle resolvedTheme={resolvedTheme} onToggle={onToggleTheme} />
        {actions}
        <LocaleSwitcher locale={locale} onLocaleChange={onLocaleChange} />
        {showLogout && <LogoutButton />}
      </div>
    </header>
  );
}
