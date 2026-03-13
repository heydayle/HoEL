"use client";

/**
 * Props for the HomeFooter component.
 */
interface IHomeFooterProps {
  /** Translated footer description text */
  footerText: string;
  /** Translated copyright text */
  copyright: string;
}

/**
 * Footer component for the Home page.
 * Displays the tagline and copyright notice with subtle top border.
 * @param props - HomeFooter props including translated footer text and copyright
 * @returns The rendered HomeFooter element
 */
export default function HomeFooter({
  footerText,
  copyright,
}: IHomeFooterProps): React.JSX.Element {
  return (
    <footer
      id="home-footer"
      className="
        mt-auto w-full border-t border-surface-border
        bg-background-secondary
        px-6 py-10
      "
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="text-sm text-foreground-secondary">{footerText}</p>
        <p className="text-xs text-foreground-muted">{copyright}</p>
      </div>
    </footer>
  );
}
