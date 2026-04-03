import type { ILesson, IDifyVocabResponse, IVocabulary } from '@/modules/lesson/core/models';
import { createClient } from '@/shared/utils/supabase/client';

/**
 * Result shape returned by lesson persistence operations.
 */
export interface ILessonSaveResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** Raw Supabase response or error payload */
  data?: unknown;
  /** Whether an error occurred */
  error?: boolean;
}

/**
 * Fetches all lessons from Supabase, including their related
 * vocabulary entries via a foreign-key join on the `vocabularies` table.
 *
 * @returns Array of lessons with nested vocabularies, or an empty array on failure
 */
export const getLessonsFromLocalStorage = async (): Promise<ILesson[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lessons')
    .select('*, vocabularies(*)');

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }

  /** Map Supabase rows into the app's ILesson shape */
  const lessons: ILesson[] = (data ?? []).map((row: Record<string, unknown>) => {
    const vocabRows = (row.vocabularies ?? []) as Array<Record<string, unknown>>;

    const vocabularies: IVocabulary[] = vocabRows.map((v) => ({
      id: v.id as string,
      word: (v.word as string) ?? '',
      ipa: (v.ipa as string) ?? '',
      partOfSpeech: (v.partOfSpeech as string) ?? '',
      meaning: (v.meaning as string) ?? '',
      translation: (v.translation as string) ?? '',
      pronunciation: (v.pronunciation as string) ?? '',
      example: (v.example as string) ?? '',
    }));

    return {
      id: row.id as string,
      date: row.date as string,
      topic: row.topic as string,
      participantName: row.participantName as string,
      isPinned: row.isPinned as boolean,
      isFavorite: row.isFavorite as boolean,
      priority: row.priority as ILesson['priority'],
      notes: (row.notes as string) ?? '',
      createdBy: (row.createdBy as string) ?? undefined,
      vocabularies,
    };
  });

  return lessons;
};

/**
 * Sends a request to the Dify AI workflow API to generate vocabulary data.
 *
 * @param word - The English word to look up
 * @returns Raw response payload from the Dify API
 */
export const fetchGeneratedVocab = async (word: string): Promise<IDifyVocabResponse> => {
  const response = await fetch('/api/workflow/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate vocabulary from server');
  }

  return response.json();
};

/**
 * Inserts a new lesson record into Supabase.
 * Vocabularies are handled separately via `bulkAddVocabs`.
 *
 * @param lesson - Full lesson object to persist
 * @returns Result indicating success or failure
 */
export const saveLessonsToLocalStorage = async (lesson: ILesson): Promise<ILessonSaveResult> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      id: lesson.id,
      date: lesson.date,
      topic: lesson.topic,
      participantName: lesson.participantName,
      isPinned: lesson.isPinned,
      isFavorite: lesson.isFavorite,
      priority: lesson.priority,
      notes: lesson.notes,
      createdBy: lesson.createdBy,
    });

  if (error) {
    console.error('Error adding lesson:', error);
    return { success: false, error: true, data: error };
  }

  return { success: true, data };
};

/**
 * Updates an existing lesson record in Supabase.
 * Only updates lesson metadata — vocabulary changes are handled separately.
 *
 * @param lessonId - UUID of the lesson to update
 * @param lesson - Partial lesson data to apply
 * @returns Result indicating success or failure
 */
export const updateLessonInSupabase = async (
  lessonId: string,
  lesson: Omit<ILesson, 'id'>,
): Promise<ILessonSaveResult> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lessons')
    .update({
      date: lesson.date,
      topic: lesson.topic,
      participantName: lesson.participantName,
      isPinned: lesson.isPinned,
      isFavorite: lesson.isFavorite,
      priority: lesson.priority,
      notes: lesson.notes,
    })
    .eq('id', lessonId);

  if (error) {
    console.error('Error updating lesson:', error);
    return { success: false, error: true, data: error };
  }

  return { success: true, data };
};