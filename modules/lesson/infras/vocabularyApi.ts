import { createClient } from '@/shared/utils/supabase/client';
import type {
  IVocabularyCreatePayload,
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';

/**
 * Supabase table name for vocabulary records.
 */
const TABLE_NAME = 'vocabularies';

/**
 * Fetches all vocabulary records belonging to a specific lesson.
 * Results are ordered by creation date ascending (oldest first).
 *
 * @param lessonId - UUID of the parent lesson
 * @returns Array of vocabulary rows, or an empty array on failure
 */
export const getVocabsByLesson = async (lessonId: string): Promise<IVocabularyRow[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching vocabularies:', error);
    return [];
  }

  return (data ?? []) as IVocabularyRow[];
};

/**
 * Inserts a new vocabulary record into Supabase.
 *
 * @param payload - Vocabulary data to insert (without `id` / `created_at`)
 * @returns The inserted row on success, or `null` on failure
 */
export const addVocab = async (
  payload: IVocabularyCreatePayload,
): Promise<IVocabularyRow | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error adding vocabulary:', error);
    return null;
  }

  return data as IVocabularyRow;
};

/**
 * Updates an existing vocabulary record by its primary key.
 *
 * @param id - UUID of the vocabulary record to update
 * @param payload - Partial vocabulary data to apply
 * @returns The updated row on success, or `null` on failure
 */
export const updateVocab = async (
  id: string,
  payload: IVocabularyUpdatePayload,
): Promise<IVocabularyRow | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vocabulary:', error);
    return null;
  }

  return data as IVocabularyRow;
};

/**
 * Inserts multiple vocabulary records in a single batch operation.
 * Used when creating a lesson that already contains vocabularies.
 *
 * @param payloads - Array of vocabulary data to insert
 * @returns The inserted rows on success, or an empty array on failure
 */
export const bulkAddVocabs = async (
  payloads: IVocabularyCreatePayload[],
): Promise<IVocabularyRow[]> => {
  if (payloads.length === 0) {
    return [];
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payloads)
    .select();

  if (error) {
    console.error('Error bulk adding vocabularies:', error);
    return [];
  }

  return (data ?? []) as IVocabularyRow[];
};

/**
 * Deletes a vocabulary record by its primary key.
 *
 * @param id - UUID of the vocabulary record to remove
 * @returns `true` when deleted successfully, `false` on failure
 */
export const deleteVocab = async (id: string): Promise<boolean> => {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vocabulary:', error);
    return false;
  }

  return true;
};

/**
 * Replaces all vocabulary records for a lesson with a new set.
 *
 * Uses a **safe insert-first, delete-after** strategy to prevent data loss:
 * 1. Snapshot existing vocabulary IDs.
 * 2. Insert the new vocabulary records (old data remains intact during this step).
 * 3. Delete the old records by their specific IDs only after the insert succeeds.
 *
 * If the insert fails, existing vocabularies are preserved and returned.
 * If the delete fails after insert, duplicates may exist temporarily but
 * no data is lost — a subsequent sync will clean them up.
 *
 * @param lessonId - UUID of the parent lesson
 * @param payloads - New vocabulary records to insert
 * @returns The inserted rows on success, or the existing rows if the insert fails
 */
export const syncVocabularies = async (
  lessonId: string,
  payloads: IVocabularyCreatePayload[],
): Promise<IVocabularyRow[]> => {
  const supabase = createClient();

  /** Step 1: Snapshot existing vocabulary IDs for later cleanup */
  const existingVocabs = await getVocabsByLesson(lessonId);
  const existingIds = existingVocabs.map((v) => v.id);

  /** Step 2: Insert new vocabularies first — data remains safe if this fails */
  let insertedRows: IVocabularyRow[] = [];

  if (payloads.length > 0) {
    insertedRows = await bulkAddVocabs(payloads);

    if (insertedRows.length === 0) {
      /** Insert failed — return existing vocabs unchanged (no data loss) */
      console.error('syncVocabularies: bulk insert failed, keeping existing data');
      return existingVocabs;
    }
  }

  /** Step 3: Delete old vocabs by specific IDs (not by lesson_id) */
  if (existingIds.length > 0) {
    const { error: deleteError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .in('id', existingIds);

    if (deleteError) {
      console.error('syncVocabularies: failed to delete old records:', deleteError);
      /** Old vocabs still exist alongside new ones — not ideal but no data loss.
       *  A subsequent sync will clean up the duplicates. */
    }
  }

  return insertedRows;
};
