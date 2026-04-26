'use client';

import { useCallback, useState } from 'react';

import type { ILesson, IVocabularyCreatePayload } from '@/modules/lesson/core/models';
import {
  deleteLessonFromSupabase,
  saveLessonsToLocalStorage,
  updateLessonInSupabase,
} from '@/modules/lesson/infras';
import { bulkAddVocabs, syncVocabularies } from '@/modules/lesson/infras/vocabularyApi';
import { getUserLocal } from '@/shared/hooks/getUserLocal';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Return shape of the {@link useLessonMutations} hook.
 */
export interface IUseLessonMutationsReturn {
  /** Whether a lesson creation request is in progress */
  isAdding: boolean;
  /** Whether a lesson update request is in progress */
  isUpdating: boolean;
  /** Creates a new lesson and persists it to Supabase */
  addLesson: (lesson: Omit<ILesson, 'id'>) => Promise<string | null>;
  /** Updates an existing lesson and syncs vocabularies to Supabase */
  updateLesson: (lessonId: string, lesson: Omit<ILesson, 'id'>) => Promise<void>;
  /** Deletes a lesson by ID from Supabase */
  deleteLesson: (lessonId: string) => Promise<boolean>;
}

/**
 * Builds vocabulary create payloads from a lesson's vocabulary array.
 * Filters out entries with empty words.
 *
 * @param vocabularies - Array of vocabulary entries from the lesson
 * @param lessonId - UUID of the parent lesson
 * @returns Array of payloads ready for Supabase insertion
 */
const buildVocabPayloads = (
  vocabularies: ILesson['vocabularies'],
  lessonId: string,
): IVocabularyCreatePayload[] =>
  (vocabularies ?? [])
    .filter((v) => v.word.trim() !== '')
    .map((v) => ({
      word: v.word,
      ipa: v.ipa,
      partOfSpeech: v.partOfSpeech,
      meaning: v.meaning,
      translation: v.translation,
      pronunciation: v.pronunciation,
      example: v.example,
      lesson_id: lessonId,
    }));

/**
 * Lightweight hook providing lesson CRUD mutation functions without
 * fetching or maintaining the full lessons list state.
 *
 * Use this hook on pages that only need to create, update, or delete
 * a lesson (e.g. `/lessons/new`, `/lessons/[id]`) instead of
 * {@link useLessonPage} which loads all lessons from Supabase on mount.
 *
 * @param t - Translation function for localised toast messages
 * @returns Mutation functions and their loading states
 */
export const useLessonMutations = (
  t: (key: string) => string,
): IUseLessonMutationsReturn => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Creates a new lesson and persists it to Supabase.
   * Generates a UUID, attaches the current user, inserts the lesson row,
   * then bulk-inserts any associated vocabularies.
   *
   * @param lesson - Lesson data without `id`
   * @returns The UUID of the created lesson, or `null` on failure
   */
  const addLesson = useCallback(
    async (lesson: Omit<ILesson, 'id'>): Promise<string | null> => {
      setIsAdding(true);
      const uuid = uuidv4();
      const { userId } = getUserLocal();
      const newLesson: ILesson = {
        ...lesson,
        id: uuid,
        createdBy: userId || 'unknown',
      };

      try {
        const result = await saveLessonsToLocalStorage(newLesson);

        if (!result.success) {
          toast.error(t('lesson_save_error_toast'));
          return null;
        }

        /** Save vocabularies into the separate `vocabularies` table */
        if (lesson.vocabularies && lesson.vocabularies.length > 0) {
          const vocabPayloads = buildVocabPayloads(lesson.vocabularies, uuid);
          const savedVocabs = await bulkAddVocabs(vocabPayloads);

          if (savedVocabs.length === 0 && vocabPayloads.length > 0) {
            console.error('Failed to save vocabularies for lesson:', uuid);
            toast.error(t('vocab_save_error_toast') || 'Failed to save vocabularies');
          }
        }

        toast.success(t('lesson_created_toast'));
        return uuid;
      } catch (err: unknown) {
        const message = (err as Error).message || 'Failed to create lesson';
        console.error('addLesson error:', message);
        toast.error(message);
        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [t],
  );

  /**
   * Updates an existing lesson's metadata and syncs its vocabulary list.
   * Does **not** manage any local lesson list state — the consuming page
   * should refresh its own detail data independently.
   *
   * @param lessonId - UUID of the lesson to update
   * @param lesson - Updated lesson data
   */
  const updateLesson = useCallback(
    async (lessonId: string, lesson: Omit<ILesson, 'id'>): Promise<void> => {
      setIsUpdating(true);
      try {
        /** Persist lesson metadata */
        const result = await updateLessonInSupabase(lessonId, lesson);

        if (!result.success) {
          toast.error(t('lesson_save_error_toast'));
          return;
        }

        /** Sync vocabularies using the safe insert-first approach */
        const vocabPayloads = buildVocabPayloads(lesson.vocabularies, lessonId);
        await syncVocabularies(lessonId, vocabPayloads);

        toast.success(t('lesson_updated_toast'));
      } catch (err: unknown) {
        const message = (err as Error).message || 'Failed to update lesson';
        console.error('updateLesson error:', message);
        toast.error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [t],
  );

  /**
   * Deletes a lesson from Supabase. Related vocabularies and summaries
   * are cascade-deleted by database FK constraints.
   *
   * @param lessonId - UUID of the lesson to delete
   * @returns Whether the deletion succeeded
   */
  const deleteLesson = useCallback(
    async (lessonId: string): Promise<boolean> => {
      try {
        const result = await deleteLessonFromSupabase(lessonId);

        if (!result.success) {
          toast.error(t('lesson_delete_error'));
          return false;
        }

        toast.success(t('lesson_deleted_toast'));
        return true;
      } catch (err: unknown) {
        const message = (err as Error).message || 'Failed to delete lesson';
        console.error('deleteLesson error:', message);
        toast.error(message);
        return false;
      }
    },
    [t],
  );

  return {
    isAdding,
    isUpdating,
    addLesson,
    updateLesson,
    deleteLesson,
  };
};
