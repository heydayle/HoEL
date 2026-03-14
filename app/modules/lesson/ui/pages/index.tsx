'use client';

import { LessonOverview } from '@/app/modules/lesson/ui/components/LessonOverview';
import { ControlsGroup, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';

import { LessonContainer, LessonPageWrapper, LessonSubtitle, LessonTitle } from './styled';

/**
 * Main page component for the '/lesson' route.
 * Renders i18n-aware overview information and theme/locale controls.
 * @returns Lesson page UI
 */
export default function LessonPage(): React.JSX.Element {
  const { resolvedTheme, locale, setLocale, t, toggleTheme, stats, latestLesson } = useLessonPage();

  return (
    <LessonPageWrapper>
      <LessonContainer>
        <LessonHeaderRow>
          <div>
            <LessonTitle>{t('page_title')}</LessonTitle>
            <LessonSubtitle>{t('page_subtitle')}</LessonSubtitle>
          </div>

          <ControlsGroup>
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          </ControlsGroup>
        </LessonHeaderRow>

        <LessonOverview stats={stats} latestLesson={latestLesson} t={t} />
      </LessonContainer>
    </LessonPageWrapper>
  );
}
