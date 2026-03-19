'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { ILesson } from '@/app/modules/lesson/core/models';
import { LessonDetailModal } from '@/app/modules/lesson/ui/components/LessonDetailModal';
import { LessonOverview } from '@/app/modules/lesson/ui/components/LessonOverview';
import { ControlsGroup, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import { Button } from '@/app/shared/components/Styled';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';

import { LessonContainer, LessonPageWrapper, LessonSubtitle, LessonTitle } from './styled';

/**
 * Main page component for lessons list routes.
 * Renders i18n-aware list information and theme/locale controls.
 * @returns Lessons list page UI
 */
export default function LessonPage(): React.JSX.Element {
  const router = useRouter();
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);

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
  } = useLessonPage();

  const onEditLesson = (lesson: ILesson) => {
    router.push(`/lessons/${lesson.id}/edit`);
  };

  return (
    <LessonPageWrapper>
      <LessonContainer>
        <LessonHeaderRow>
          <div>
            <LessonTitle>{t('page_title')}</LessonTitle>
            <LessonSubtitle>{t('page_subtitle')}</LessonSubtitle>
          </div>

          <ControlsGroup>
            <Button type="button" onClick={() => router.push('/lessons/new')}>
              {t('create_lesson_title')}
            </Button>
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
          onSelectLesson={setSelectedLesson}
          onEditLesson={onEditLesson}
        />

        <LessonDetailModal lesson={selectedLesson} t={t} onClose={() => setSelectedLesson(null)} />
      </LessonContainer>
    </LessonPageWrapper>
  );
}
