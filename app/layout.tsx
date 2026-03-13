import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import StyledComponentsRegistry from "@/lib/registry";

import "./globals.css";

/** Geist Sans font configuration */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Geist Mono font configuration */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** SEO metadata for the application */
export const metadata: Metadata = {
  title: "English Learning History — Learn English Through History",
  description:
    "Master English vocabulary, grammar, and comprehension by exploring fascinating historical events and cultural milestones across different eras.",
  keywords: [
    "English learning",
    "history",
    "vocabulary",
    "grammar",
    "education",
  ],
};

/**
 * Root layout component wrapping all pages.
 * Provides global fonts, default theme attribute, and body styling.
 * @param props - Layout props containing children elements
 * @param props.children - The child page component to render
 * @returns The root HTML layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
