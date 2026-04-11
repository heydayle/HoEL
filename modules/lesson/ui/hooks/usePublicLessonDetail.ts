import { useState } from 'react';

import type { ILesson, ISummaryLesson } from '@/modules/lesson/core/models';
import { getLessonByIdPublic } from '@/modules/lesson/infras';

/**
 * Hook for fetching a lesson by ID without authentication.
 * Intended for use on the public share view `/s/[id]`.
 * Returns both the lesson data and its associated summary.
 *
 * @param lessonId - UUID of the lesson to load
 * @returns State and fetch trigger for the public lesson detail
 */
export const usePublicLessonDetail = (lessonId: string) => {
  /** The resolved lesson data, or null if not yet loaded */
  const [lesson, setLesson] = useState<ILesson | null>(null);

  /** The associated summary data, or null if not available */
  const [summary, setSummary] = useState<ISummaryLesson | null>(null);

  /** Whether the fetch request is in-flight */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** Error message if the fetch failed */
  const [error, setError] = useState<string | null>(null);

  /**
   * Triggers a fetch of the lesson from Supabase using the public API.
   * Updates `lesson`, `summary`, `isLoading`, and `error` state accordingly.
   */
  const fetchPublicLesson = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLessonByIdPublic(lessonId);

      if (data) {
        setLesson(data.lesson);
        setSummary(data.summary);
      } else {
        setError('Lesson not found');
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Failed to fetch lesson');
    } finally {
      setIsLoading(false);
    }
  };

  return { lesson, summary, isLoading, error, fetchPublicLesson };
};
