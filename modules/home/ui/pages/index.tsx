"use client";

import {
  FeatureHighlights,
  HomeFooter,
  HomeHeader,
  ModeSelector,
} from "@/modules/home/ui/components";
import { useHomePage } from "@/modules/home/ui/hooks";

/**
 * Main page component for the Home onboarding module.
 * Composes the header, mode selector, feature highlights, and footer.
 * @returns The complete Home onboarding page view
 */
export default function HomePage(): React.JSX.Element {
  const {
    resolvedTheme,
    toggleTheme,
    locale,
    setLocale,
    t,
    modeCards,
    featureHighlights,
    handleSelectMode,
  } = useHomePage();

  return (
    <div className="min-h-screen bg-cream text-foreground flex flex-col">
      <HomeHeader
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        locale={locale}
        onLocaleChange={setLocale}
      />

      {/* Spacer for fixed header */}
      <div className="h-20" />

      <main className="flex-1 flex flex-col items-center gap-16 px-4 py-12 max-w-[72rem] mx-auto w-full">
        <ModeSelector
          title={t("onboarding_title")}
          subtitle={t("onboarding_subtitle")}
          appTagline={t("app_tagline")}
          modeCards={modeCards}
          featureHighlights={featureHighlights}
          t={t}
          onSelectMode={handleSelectMode}
        />

        <FeatureHighlights highlights={featureHighlights} t={t} />
      </main>

      <HomeFooter
        footerText={t("footer_text")}
        copyright={t("footer_copyright")}
      />
    </div>
  );
}
