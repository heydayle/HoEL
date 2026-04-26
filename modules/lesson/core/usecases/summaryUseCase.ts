import type {
  ISummaryLesson,
  ISummaryLessonCreatePayload,
} from '@/modules/lesson/core/models';
import { executeGenerateSummaryLesson } from '@/modules/lesson/core/usecases';
import {
  createSummaryRecord,
  getSummaryByLessonId,
  updateSummaryRecord,
} from '@/modules/lesson/infras/summaryApi';
import { parseTextResult } from '@/shared/hooks';

/**
 * Parsed shape returned from the Dify AI summary generation.
 */
interface IParsedSummary {
  /** Generated English paragraph */
  paragraph: string;
  /** Vietnamese translation of the paragraph */
  translate: string;
  /** First comprehension question */
  question_1: string;
  /** Second comprehension question */
  question_2: string;
  /** Third comprehension question */
  question_3: string;
}

/**
 * Fetches the existing summary for a lesson.
 *
 * @param lessonId - UUID of the parent lesson
 * @returns The summary record, or `null` if not found
 * @throws {Error} When the lesson ID is missing
 */
export const fetchSummaryByLesson = async (
  lessonId: string,
): Promise<ISummaryLesson | null> => {
  if (!lessonId) {
    throw new Error('Lesson ID is required to fetch summary.');
  }

  return getSummaryByLessonId(lessonId);
};

/**
 * Generates a lesson summary via AI and persists it to the database.
 *
 * **Case 1:** No existing summary → creates a new record.
 * **Case 2:** Existing summary → updates the existing record with regenerated content.
 *
 * @param lessonId - UUID of the parent lesson
 * @param wordList - Array of vocabulary words used to generate the summary
 * @param existingSummaryId - Optional UUID of an existing summary to update
 * @returns The created or updated summary record, or `null` on failure
 */
export const generateAndSaveSummary = async (
  lessonId: string,
  wordList: string[],
  existingSummaryId?: string,
): Promise<ISummaryLesson | null> => {
  if (!lessonId) {
    throw new Error('Lesson ID is required to generate a summary.');
  }

  if (!wordList || wordList.length === 0) {
    throw new Error('Word list cannot be empty for summary generation.');
  }

  /** Step 1: Call AI to generate summary content */
  const aiResult = await executeGenerateSummaryLesson(wordList);
  const parsed = parseTextResult(
    aiResult?.data?.outputs?.text_result,
  ) as IParsedSummary | null;

  if (!parsed) {
    throw new Error('Failed to parse AI-generated summary content.');
  }

  /** Step 2: Build the payload */
  const summaryPayload: ISummaryLessonCreatePayload = {
    paragraph: parsed.paragraph ?? '',
    translate: parsed.translate ?? '',
    question_1: parsed.question_1 ?? '',
    question_2: parsed.question_2 ?? '',
    question_3: parsed.question_3 ?? '',
    lesson_id: lessonId,
  };

  /** Step 3: Create or update based on existence of summary */
  if (existingSummaryId) {
    /** Case 2: Update existing summary */
    const updated = await updateSummaryRecord(existingSummaryId, summaryPayload);
    return updated;
  }

  /** Case 1: Create new summary */
  const created = await createSummaryRecord(summaryPayload);
  return created;
};
