import type { IVocabulary } from '@/modules/lesson/core/models';
import type { IFreePracticeRepository } from '@/modules/free-practice/core/repositories';
import { getVocabsByLesson } from '@/modules/lesson/infras/vocabularyApi';

/**
 * Concrete implementation of {@link IFreePracticeRepository}.
 *
 * Delegates to the existing lesson infras `getVocabsByLesson` Supabase
 * query so we don't duplicate data-access logic.
 *
 * @param lessonId - UUID of the lesson whose vocabulary should be loaded
 * @returns Array of vocabulary items for the lesson
 */
export const getVocabulariesForLesson = async (
  lessonId: string,
): Promise<IVocabulary[]> => {
  const rows = await getVocabsByLesson(lessonId);

  return rows.map((row) => ({
    id: row.id,
    word: row.word,
    ipa: row.ipa,
    partOfSpeech: row.partOfSpeech,
    meaning: row.meaning,
    translation: row.translation,
    pronunciation: row.pronunciation,
    example: row.example,
  }));
};

/**
 * Public (unauthenticated) variant of {@link getVocabulariesForLesson}.
 *
 * Fetches vocabulary via the `/api/share/[id]/vocab` endpoint which uses
 * the Supabase anon key server-side. No auth token is required, making
 * this safe to call from any public page.
 *
 * @param lessonId - UUID of the lesson whose vocabulary should be loaded
 * @returns Array of vocabulary items for the lesson
 */
export const getPublicVocabulariesForLesson = async (
  lessonId: string,
): Promise<IVocabulary[]> => {
  const response = await fetch(`/api/share/${lessonId}/vocab`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? 'Failed to fetch public vocabulary',
    );
  }

  const { vocabularies } = (await response.json()) as { vocabularies: IVocabulary[] };

  return vocabularies;
};
