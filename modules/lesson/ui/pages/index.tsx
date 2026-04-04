'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonDetailModal } from '@/modules/lesson/ui/components/LessonDetailModal';
import { LessonOverview } from '@/modules/lesson/ui/components/LessonOverview';
import { ControlsGroup, LessonHeaderRow } from '@/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/shared/components';
import { Button } from '@/shared/components/Styled';

import LogoutButton from '@/shared/components/atoms/Button/LogoutButton';
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
    router.push(`/lessons/${lesson.id}`);
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
            <LogoutButton />
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
