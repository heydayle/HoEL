'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonDetailModal } from '@/modules/lesson/ui/components/LessonDetailModal';
import { LessonOverview } from '@/modules/lesson/ui/components/LessonOverview';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/shared/components';
import { Button } from '@/shared/components/Styled';

import LogoutButton from '@/shared/components/atoms/Button/LogoutButton';

/**
 * Main page component for lessons list routes.
 * Renders i18n-aware list information and theme/locale controls.
 * @returns Lessons list page UI
 */
export default function LessonPage(): React.JSX.Element {
  const router = useRouter();
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);

  const {
    loading,
    resolvedTheme,
    locale,
    setLocale,
    t,
    toggleTheme,
    filters,
    displayedLessons,
    stats,
    updateSearchTerm,
    updateVocabSearchTerm,
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
    <main className="min-h-screen py-8 px-4 bg-background text-foreground md:py-10 md:px-8">
      <div className="w-full max-w-[60rem] !mx-auto flex flex-col gap-4">
        <header className="flex items-center justify-between gap-4 flex-wrap sticky top-8 bg-background/94 backdrop-blur-[10px]">
          <div>
            <h1 className="m-0 text-3xl leading-tight">{t('page_title')}</h1>
            <p className="m-0 text-foreground-secondary leading-relaxed">{t('page_subtitle')}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => router.push('/lessons/new')}>
              {t('create_lesson_title')}
            </Button>
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
            <LogoutButton />
          </div>
        </header>

        <LessonOverview
          loading={loading}
          stats={stats}
          lessons={displayedLessons}
          filters={filters}
          t={t}
          onSearchTermChange={updateSearchTerm}
          onVocabSearchTermChange={updateVocabSearchTerm}
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
      </div>
    </main>
  );
}
