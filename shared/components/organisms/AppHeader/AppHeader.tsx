'use client';

import React from 'react';

import { LocaleSwitcher, ThemeToggle } from '@/shared/components/atoms';
import LogoutButton from '@/shared/components/atoms/Button/LogoutButton';
import type { Locale } from '@/shared/types';

/**
 * Props for the AppHeader organism component.
 */
export interface IAppHeaderProps {
  /** Left-side content: title block, back button, etc. */
  left: React.ReactNode;
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
 * Common sticky header organism used across all pages.
 * Composes LocaleSwitcher, ThemeToggle, and LogoutButton with
 * page-specific left content and optional action buttons.
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
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap sticky top-8 z-40 py-2 bg-background/94 backdrop-blur-[10px]">
      {/* Left slot */}
      <div>{left}</div>

      {/* Right: actions + controls */}
      <div className="flex items-center gap-3">
        {actions}
        <LocaleSwitcher locale={locale} onLocaleChange={onLocaleChange} />
        <ThemeToggle resolvedTheme={resolvedTheme} onToggle={onToggleTheme} />
        {showLogout && <LogoutButton />}
      </div>
    </header>
  );
}
