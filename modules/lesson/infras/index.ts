import type { IDifyVocabResponse, ILesson, ISummaryLesson, IVocabulary } from '@/modules/lesson/core/models';
import { getUserLocal } from '@/shared/hooks/getUserLocal';
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
  const { userId } = getUserLocal();

  const { data, error } = await supabase
    .from('lessons')
    .select('*, vocabularies(*), summaries(*)')
    .eq('createdBy', userId);

  if (error) {
    console.error('Error fetching lessons:', error);
    throw new Error(`Failed to load lessons: ${error.message}`);
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

    /** Extract summary_id from joined summaries (one-to-one) */
    const summaryRows = (row.summaries ?? []) as Array<Record<string, unknown>>;
    const summaryId = summaryRows.length > 0 ? (summaryRows[0].id as string) : undefined;

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
      created_at: (row.created_at as string) ?? undefined,
      vocabularies,
      summary_id: summaryId,
    };
  });

  return lessons;
};

/**
 * Response shape from the public share API.
 */
export interface IPublicLessonResponse {
  /** The lesson data */
  lesson: ILesson;
  /** The associated summary, or null if none exists */
  summary: ISummaryLesson | null;
}

/**
 * Fetches a single lesson by ID without requiring authentication.
 * Used exclusively for the public share view route `/s/[id]`.
 *
 * Delegates to the internal `/api/share/[id]` route which uses the
 * Supabase service role key server-side to bypass RLS, so no auth
 * token is needed from the browser.
 *
 * @param lessonId - UUID of the lesson to retrieve
 * @returns The lesson with nested vocabularies and summary, or null if not found
 */
export const getLessonByIdPublic = async (lessonId: string): Promise<IPublicLessonResponse | null> => {
  const response = await fetch(`/api/share/${lessonId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Failed to fetch public lesson');
  }

  return response.json() as Promise<IPublicLessonResponse>;
};


export const getLessonById = async (lessonId: string): Promise<ILesson | null> => {
  const supabase = createClient();
  const { userId } = getUserLocal();

  const { data, error } = await supabase
    .from('lessons')
    .select('*, vocabularies(*), summaries(*)')
    .eq('id', lessonId)
    .eq('createdBy', userId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching lesson with ID ${lessonId}:`, error);
    return null;
  }

  if (!data) {
    console.warn(`No lesson found with ID ${lessonId}`);
    return null;
  }

  const vocabRows = (data.vocabularies ?? []) as Array<Record<string, unknown>>;

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

  /** Extract summary_id from joined summaries (one-to-one) */
  const summaryRows = (data.summaries ?? []) as Array<Record<string, unknown>>;
  const summaryId = summaryRows.length > 0 ? (summaryRows[0].id as string) : undefined;

  const lesson: ILesson = {
    id: data.id as string,
    date: data.date as string,
    topic: data.topic as string,
    participantName: data.participantName as string,
    isPinned: data.isPinned as boolean,
    isFavorite: data.isFavorite as boolean,
    priority: data.priority as ILesson['priority'],
    notes: (data.notes as string) ?? '',
    createdBy: (data.createdBy as string) ?? undefined,
    created_at: (data.created_at as string) ?? undefined,
    vocabularies,
    summary_id: summaryId,
  };

  return lesson;
};

const TYPES_REQUEST = {
  VOCAB: 1,
  SUMMARY_LESSON: 2,
}

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
    body: JSON.stringify({ word, type: TYPES_REQUEST.VOCAB }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate vocabulary from server');
  }

  return response.json();
};

/**
 * Sends a request to the Dify AI workflow API to generate a lesson summary.
 *
 * @param wordList - Array of vocabulary words used to build the summary
 * @returns Raw response payload from the Dify API
 */
export const fetchGeneratedSummaryLesson = async (wordList: string[]): Promise<IDifyVocabResponse> => {
  const response = await fetch('/api/workflow/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word_list: wordList.join(','), type: TYPES_REQUEST.SUMMARY_LESSON }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary from server');
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
 * Deletes a lesson record from Supabase.
 * Related vocabularies and summaries are cascade-deleted by database FK constraints.
 *
 * @param lessonId - UUID of the lesson to delete
 * @returns Result indicating success or failure
 */
export const deleteLessonFromSupabase = async (
  lessonId: string,
): Promise<ILessonSaveResult> => {
  const supabase = createClient();
  const { userId } = getUserLocal();

  const { data, error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)
    .eq('createdBy', userId);

  if (error) {
    console.error('Error deleting lesson:', error);
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
  const { userId } = getUserLocal();

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
    .eq('id', lessonId)
    .eq('createdBy', userId);

  if (error) {
    console.error('Error updating lesson:', error);
    return { success: false, error: true, data: error };
  }

  return { success: true, data };
};