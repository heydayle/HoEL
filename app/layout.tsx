import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/shared/components/Styled";
import { AuthSyncProvider } from "@/shared/components/organisms/AuthSyncProvider/AuthSyncProvider";

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
  title: "LingoNote — Language Lesson Tracker",
  description:
    "An offline-first app to record language learning sessions, build vocabulary lists, and track lessons as a student or teacher. No sign-up required.",
  keywords: [
    "language learning",
    "lesson tracker",
    "vocabulary",
    "offline",
    "student",
    "teacher",
    "LingoNote",
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
        <AuthSyncProvider />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
