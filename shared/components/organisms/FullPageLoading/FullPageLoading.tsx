'use client';

import React from 'react';

import { Spinner } from '@/shared/components/ui/spinner';

/**
 * Props for the {@link FullPageLoading} component.
 */
interface IFullPageLoadingProps {
  /** Primary message displayed below the spinner. */
  message?: string;
  /** Optional secondary hint text (dimmed). */
  hint?: string;
}

/**
 * Full-page loading overlay with backdrop blur and centered spinner.
 * Renders on top of all content using a fixed position with a high z-index.
 * Used during heavy async operations such as lesson creation or update
 * to block user interaction and provide visual feedback.
 *
 * @param props - Component props.
 * @returns Rendered full-page loading overlay.
 */
export function FullPageLoading({
  message,
  hint,
}: IFullPageLoadingProps): React.JSX.Element {
  return (
    <div
      data-testid="full-page-loading"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      {/* Glow ring behind spinner */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full bg-primary/20 animate-ping" />
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-background border border-border shadow-lg">
          <Spinner size={32} className="text-primary" />
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className="mt-6 text-base font-medium text-foreground animate-pulse">
          {message}
        </p>
      )}

      {/* Hint */}
      {hint && (
        <p className="mt-2 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
