'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { ISummaryLesson } from '@/modules/lesson/core/models';
import {
  fetchSummaryByLesson,
  generateAndSaveSummary,
} from '@/modules/lesson/core/usecases/summaryUseCase';

/**
 * Return shape of the {@link useSummaryLesson} hook.
 */
export interface IUseSummaryLessonReturn {
  /** Loaded summary data */
  summary: ISummaryLesson | null;
  /** Whether a network request is in progress */
  isLoading: boolean;
  /** Whether summary generation is in progress */
  isGenerating: boolean;
  /** Human-readable error message, or `null` */
  error: string | null;
  /** Fetches the existing summary for the lesson */
  fetchSummary: (lessonId: string) => Promise<void>;
  /** Generates (or regenerates) a summary and persists it */
  handleGenerateSummary: (
    lessonId: string,
    wordList: string[],
    existingSummaryId?: string,
  ) => Promise<ISummaryLesson | null>;
}

/**
 * Hook that manages summary lesson state for a specific lesson.
 * Handles fetching existing summaries and generating new ones via AI.
 *
 * @param t - Translation function for i18n messages
 * @returns Summary state and action handlers
 */
export const useSummaryLesson = (
  t: (key: string) => string,
): IUseSummaryLessonReturn => {
  const [summary, setSummary] = useState<ISummaryLesson | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the existing summary for a lesson from the database.
   *
   * @param lessonId - UUID of the parent lesson
   */
  const fetchSummary = useCallback(
    async (lessonId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchSummaryByLesson(lessonId);
        setSummary(data);
      } catch (err: unknown) {
        const message = (err as Error).message || t('summary_fetch_error');
        setError(message);
        console.error('fetchSummary error:', message);
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  /**
   * Generates a summary via AI and persists it to the database.
   * Supports both create (no existing ID) and update (existing ID) flows.
   *
   * @param lessonId - UUID of the parent lesson
   * @param wordList - Array of vocabulary words for AI generation
   * @param existingSummaryId - Optional UUID of existing summary to update
   * @returns The created/updated summary record, or `null` on failure
   */
  const handleGenerateSummary = useCallback(
    async (
      lessonId: string,
      wordList: string[],
      existingSummaryId?: string,
    ): Promise<ISummaryLesson | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateAndSaveSummary(
          lessonId,
          wordList,
          existingSummaryId,
        );

        if (result) {
          setSummary(result);
          toast.success(t('summary_generated'));
        }

        return result;
      } catch (err: unknown) {
        const message = (err as Error).message || t('summary_generate_error');
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [t],
  );

  return {
    summary,
    isLoading,
    isGenerating,
    error,
    fetchSummary,
    handleGenerateSummary,
  };
};
