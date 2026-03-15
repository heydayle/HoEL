'use client';

import { CreateLessonModal } from '@/app/modules/lesson/ui/components/CreateLessonModal';
import { LessonOverview } from '@/app/modules/lesson/ui/components/LessonOverview';
import { ControlsGroup, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';

import { LessonContainer, LessonPageWrapper, LessonSubtitle, LessonTitle } from './styled';

/**
 * Main page component for lessons list routes.
 * Renders i18n-aware list information and theme/locale controls.
 * @returns Lessons list page UI
 */
export default function LessonPage(): React.JSX.Element {
  const {
    resolvedTheme,
    locale,
    setLocale,
    t,
    toggleTheme,
    filters,
    displayedLessons,
    stats,
    updateSearchTerm,
    updatePinnedFilter,
    updateFavoriteFilter,
    updatePriorityFilter,
    updateStartDate,
    updateEndDate,
    updateSortBy,
    resetFilters,
    addLesson,
  } = useLessonPage();

  return (
    <LessonPageWrapper>
      <LessonContainer>
        <LessonHeaderRow>
          <div>
            <LessonTitle>{t('page_title')}</LessonTitle>
            <LessonSubtitle>{t('page_subtitle')}</LessonSubtitle>
          </div>

          <ControlsGroup>
            <CreateLessonModal t={t} onAddLesson={addLesson} />
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          </ControlsGroup>
        </LessonHeaderRow>

        <LessonOverview
          stats={stats}
          lessons={displayedLessons}
          filters={filters}
          t={t}
          onSearchTermChange={updateSearchTerm}
          onPinnedFilterChange={updatePinnedFilter}
          onFavoriteFilterChange={updateFavoriteFilter}
          onPriorityFilterChange={updatePriorityFilter}
          onStartDateChange={updateStartDate}
          onEndDateChange={updateEndDate}
          onSortChange={updateSortBy}
          onResetFilters={resetFilters}
        />
      </LessonContainer>
    </LessonPageWrapper>
  );
}
