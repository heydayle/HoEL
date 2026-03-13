"use client";

import {
  FeatureGrid,
  HeroSection,
  HomeFooter,
  HomeHeader,
  StatsBar,
} from "@/app/modules/home/ui/components";
import { useHomePage } from "@/app/modules/home/ui/hooks";

/**
 * Main page component for the Home module.
 * Composes all Home sub-components (Header, Hero, Stats, Features, Footer)
 * and wires them with data/handlers from the useHomePage hook.
 * @returns The complete Home page view
 */
export default function HomePage(): React.JSX.Element {
  const {
    resolvedTheme,
    toggleTheme,
    locale,
    setLocale,
    t,
    features,
    stats,
  } = useHomePage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HomeHeader
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        locale={locale}
        onLocaleChange={setLocale}
      />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <main className="flex flex-1 flex-col">
        <HeroSection
          greeting={t("hero_greeting")}
          subtitle={t("hero_subtitle")}
          ctaStart={t("cta_start")}
          ctaExplore={t("cta_explore")}
        />

        <StatsBar stats={stats} t={t} />

        <FeatureGrid
          features={features}
          t={t}
          sectionTitle={t("feature_section_title")}
          sectionSubtitle={t("feature_section_subtitle")}
        />
      </main>

      <HomeFooter
        footerText={t("footer_text")}
        copyright={t("footer_copyright")}
      />
    </div>
  );
}
