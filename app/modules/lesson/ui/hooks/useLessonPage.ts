'use client';

import { useMemo } from 'react';

import { getLessonStats, LESSON_FALLBACK_DATA } from '@/app/modules/lesson/core/usecases';
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
 * Hook providing state and handlers for the lesson overview page.
 * @returns View model for rendering the lesson page
 */
export const useLessonPage = () => {
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);

  /**
   * Reads lessons from storage, with fallback sample data.
   */
  const lessons = useMemo(() => {
    const localLessons = getLessonsFromLocalStorage();
    return localLessons.length > 0 ? localLessons : LESSON_FALLBACK_DATA;
  }, []);

  /**
   * Computes overview stats for all lessons.
   */
  const stats = useMemo(() => getLessonStats(lessons), [lessons]);

  /**
   * Picks the latest lesson (first item for this initial overview).
   */
  const latestLesson = lessons[0];

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
    stats,
    latestLesson,
  };
};
