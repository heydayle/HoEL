"use client";

/**
 * Props for the HomeFooter component.
 */
interface IHomeFooterProps {
  /** Translated footer tagline text */
  footerText: string;
  /** Translated copyright text */
  copyright: string;
}

/**
 * Footer component for the Home onboarding page.
 * Displays the LingoNote tagline and copyright notice.
 * @param props - HomeFooter props
 * @returns The rendered HomeFooter element
 */
export function HomeFooter({
  footerText,
  copyright,
}: IHomeFooterProps): React.JSX.Element {
  return (
    <footer id="home-footer" className="py-6 border-t border-surface-border bg-background">
      <div className="max-w-[72rem] mx-auto px-6 flex flex-col items-center gap-1">
        <p className="text-sm text-foreground-secondary">{footerText}</p>
        <p className="text-xs text-foreground-muted">{copyright}</p>
      </div>
    </footer>
  );
}
