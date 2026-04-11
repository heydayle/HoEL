import type {
  ISummaryLesson,
  ISummaryLessonCreatePayload,
  ISummaryLessonUpdatePayload,
} from '@/modules/lesson/core/models';
import { createClient } from '@/shared/utils/supabase/client';

/**
 * Supabase table name for summary lesson records.
 */
const TABLE_NAME = 'summaries';

/**
 * Fetches the summary record associated with a specific lesson.
 *
 * @param lessonId - UUID of the parent lesson
 * @returns The summary row if found, or `null` on failure or absence
 */
export const getSummaryByLessonId = async (
  lessonId: string,
): Promise<ISummaryLesson | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
  return data as ISummaryLesson | null;
};

/**
 * Inserts a new summary record into Supabase.
 *
 * @param payload - Summary data to insert (without `id` / `created_at`)
 * @returns The inserted row on success, or `null` on failure
 */
export const createSummaryRecord = async (
  payload: ISummaryLessonCreatePayload,
): Promise<ISummaryLesson | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating summary:', error);
    return null;
  }

  return data as ISummaryLesson;
};

/**
 * Updates an existing summary record by its primary key.
 *
 * @param id - UUID of the summary record to update
 * @param payload - Partial summary data to apply
 * @returns The updated row on success, or `null` on failure
 */
export const updateSummaryRecord = async (
  id: string,
  payload: ISummaryLessonUpdatePayload,
): Promise<ISummaryLesson | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating summary:', error);
    return null;
  }

  return data as ISummaryLesson;
};
