"use client";

import { FooterContent, FooterWrapper } from "../styled";

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
    <FooterWrapper id="home-footer">
      <FooterContent>
        <p className="text-sm text-foreground-secondary">{footerText}</p>
        <p className="text-xs text-foreground-muted">{copyright}</p>
      </FooterContent>
    </FooterWrapper>
  );
}
