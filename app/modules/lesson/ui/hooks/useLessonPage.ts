'use client';

import { useMemo, useState } from 'react';

import type { ILessonFilterInput, LessonSortOption } from '@/app/modules/lesson/core/usecases';
import {
  getFilteredLessons,
  getLessonStats,
  LESSON_FALLBACK_DATA,
} from '@/app/modules/lesson/core/usecases';
import { getLessonsFromLocalStorage } from '@/app/modules/lesson/infras';
import enMessages from '@/app/modules/lesson/messages/en.json';
import viMessages from '@/app/modules/lesson/messages/vi.json';
import { useLocale, useTheme } from '@/app/shared/hooks';
import type { Locale, TranslationMessages } from '@/app/shared/types';

/**
 * Locale messages map for the lesson module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Initial filter state for lessons list UI.
 */
const INITIAL_FILTERS: ILessonFilterInput = {
  searchTerm: '',
  isPinned: false,
  isFavorite: false,
  priority: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date_desc',
};

/**
 * Hook providing state and handlers for the lessons list page.
 * @returns View model for rendering lessons list UI
 */
export const useLessonPage = () => {
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);
  const [filters, setFilters] = useState<ILessonFilterInput>(INITIAL_FILTERS);

  /**
   * Reads lessons from local storage and falls back to sample data.
   */
  const lessons = useMemo(() => {
    const localLessons = getLessonsFromLocalStorage();
    return localLessons.length > 0 ? localLessons : LESSON_FALLBACK_DATA;
  }, []);

  /**
   * Computes the filtered and sorted lessons list.
   */
  const displayedLessons = useMemo(() => getFilteredLessons(lessons, filters), [lessons, filters]);

  /**
   * Computes summary numbers for currently displayed lessons.
   */
  const stats = useMemo(() => getLessonStats(displayedLessons), [displayedLessons]);

  /**
   * Updates the search input state.
   * @param searchTerm - New search term
   */
  const updateSearchTerm = (searchTerm: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      searchTerm,
    }));
  };

  /**
   * Updates pinned filter toggle.
   * @param isPinned - New pinned state
   */
  const updatePinnedFilter = (isPinned: boolean): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      isPinned,
    }));
  };

  /**
   * Updates favorite filter toggle.
   * @param isFavorite - New favorite state
   */
  const updateFavoriteFilter = (isFavorite: boolean): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      isFavorite,
    }));
  };

  /**
   * Updates priority filter option.
   * @param priority - Selected priority value
   */
  const updatePriorityFilter = (priority: ILessonFilterInput['priority']): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      priority,
    }));
  };

  /**
   * Updates start date filter.
   * @param startDate - ISO date string
   */
  const updateStartDate = (startDate: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      startDate,
    }));
  };

  /**
   * Updates end date filter.
   * @param endDate - ISO date string
   */
  const updateEndDate = (endDate: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      endDate,
    }));
  };

  /**
   * Updates sorting option.
   * @param sortBy - Selected sorting strategy
   */
  const updateSortBy = (sortBy: LessonSortOption): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      sortBy,
    }));
  };

  /**
   * Resets all list filters to defaults.
   */
  const resetFilters = (): void => {
    setFilters(INITIAL_FILTERS);
  };

  /**
   * Toggles light/dark mode with system-mode awareness.
   */
  const toggleTheme = (): void => {
    if (mode === 'system') {
      setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
      return;
    }

    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  };

  return {
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
  };
};
