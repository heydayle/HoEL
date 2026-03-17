'use client';

import { useState } from 'react';

import type { ILesson } from '@/app/modules/lesson/core/models';
import { CreateLessonModal } from '@/app/modules/lesson/ui/components/CreateLessonModal';
import { LessonDetailModal } from '@/app/modules/lesson/ui/components/LessonDetailModal';
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
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);

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
    updateLesson,
  } = useLessonPage();

  const handleUpdateLesson = (lessonId: string, updatedLesson: Omit<ILesson, 'id'>) => {
    updateLesson(lessonId, updatedLesson);
    setEditingLesson(null);
  };

  const onEditLesson = (lesson: ILesson) => {
    // If clicking edit on the same lesson, close and reopen to refresh the form
    if (editingLesson?.id === lesson.id) {
      setEditingLesson(null);
      // Use setTimeout to ensure the state update is processed before reopening
      setTimeout(() => {
        setEditingLesson(lesson);
      }, 0);
    } else {
      setEditingLesson(lesson);
    }
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
            <CreateLessonModal 
              t={t} 
              onAddLesson={addLesson}
              editingLesson={editingLesson}
              onEditLesson={handleUpdateLesson}
              onClose={() => setEditingLesson(null)}
            />
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
