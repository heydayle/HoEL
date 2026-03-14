"use client";

import {
  FeatureHighlights,
  HomeFooter,
  HomeHeader,
  ModeSelector,
} from "@/app/modules/home/ui/components";
import { useHomePage } from "@/app/modules/home/ui/hooks";

import { HeaderSpacer, HomeMainContent, HomePageWrapper } from "./styled";

/**
 * Main page component for the Home onboarding module.
 * Composes the header, mode selector, feature highlights, and footer.
 * Wires data and handlers from the useHomePage hook.
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
    <HomePageWrapper>
      <HomeHeader
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        locale={locale}
        onLocaleChange={setLocale}
      />

      {/* Spacer for fixed header */}
      <HeaderSpacer />

      <HomeMainContent>
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
      </HomeMainContent>

      <HomeFooter
        footerText={t("footer_text")}
        copyright={t("footer_copyright")}
      />
    </HomePageWrapper>
  );
}
