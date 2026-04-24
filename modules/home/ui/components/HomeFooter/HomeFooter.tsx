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
 * Neo-Brutalism footer for the Home onboarding page.
 * Features solid background and thick top border.
 * @param props - HomeFooter props
 * @returns The rendered HomeFooter element
 */
export function HomeFooter({
  footerText,
  copyright,
}: IHomeFooterProps): React.JSX.Element {
  return (
    <footer id="home-footer" className="py-6 border-t-2 border-brutal-black bg-cream">
      <div className="max-w-[72rem] mx-auto px-6 flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground-secondary">{footerText}</p>
        <p className="text-xs font-medium text-foreground-muted">{copyright}</p>
      </div>
    </footer>
  );
}
