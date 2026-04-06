import { useState } from 'react';

import type { ILesson } from '@/modules/lesson/core/models';
import { getLessonByIdPublic } from '@/modules/lesson/infras';

/**
 * Hook for fetching a lesson by ID without authentication.
 * Intended for use on the public share view `/lessons/s/[id]`.
 *
 * @param lessonId - UUID of the lesson to load
 * @returns State and fetch trigger for the public lesson detail
 */
export const usePublicLessonDetail = (lessonId: string) => {
  /** The resolved lesson data, or null if not yet loaded */
  const [lesson, setLesson] = useState<ILesson | null>(null);

  /** Whether the fetch request is in-flight */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** Error message if the fetch failed */
  const [error, setError] = useState<string | null>(null);

  /**
   * Triggers a fetch of the lesson from Supabase using the public API.
   * Updates `lesson`, `isLoading`, and `error` state accordingly.
   */
  const fetchPublicLesson = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLessonByIdPublic(lessonId);

      if (data) {
        setLesson(data);
      } else {
        setError('Lesson not found');
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Failed to fetch lesson');
    } finally {
      setIsLoading(false);
    }
  };

  return { lesson, isLoading, error, fetchPublicLesson };
};
