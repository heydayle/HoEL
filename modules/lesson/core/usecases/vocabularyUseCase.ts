import type {
  IVocabularyCreatePayload,
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';
import {
  addVocab,
  deleteVocab,
  getVocabsByLesson,
  updateVocab,
} from '@/modules/lesson/infras/vocabularyApi';

/**
 * Minimum length a word must satisfy to be persisted.
 */
const MIN_WORD_LENGTH = 1;

/**
 * Validates that a vocabulary payload contains the minimum required data
 * before it is sent to the persistence layer.
 *
 * @param payload - The create/update payload to validate
 * @throws {Error} When the word field is missing or blank
 */
const validateVocabularyPayload = (
  payload: IVocabularyCreatePayload | IVocabularyUpdatePayload,
): void => {
  if ('word' in payload) {
    const word = (payload.word ?? '').trim();

    if (word.length < MIN_WORD_LENGTH) {
      throw new Error('Vocabulary word cannot be empty.');
    }
  }
};

/**
 * Fetches all vocabularies belonging to a given lesson.
 *
 * @param lessonId - UUID of the parent lesson
 * @returns Array of vocabulary rows sorted by creation date ascending
 */
export const fetchVocabulariesByLesson = async (
  lessonId: string,
): Promise<IVocabularyRow[]> => {
  if (!lessonId) {
    throw new Error('Lesson ID is required to fetch vocabularies.');
  }

  return getVocabsByLesson(lessonId);
};

/**
 * Creates a new vocabulary record, ensuring `lesson_id` is always attached.
 *
 * @param lessonId - UUID of the parent lesson
 * @param payload - Vocabulary creation data (without lesson_id)
 * @returns The newly created vocabulary row, or `null` on failure
 * @throws {Error} When validation fails
 */
export const createVocabulary = async (
  lessonId: string,
  payload: Omit<IVocabularyCreatePayload, 'lesson_id'>,
): Promise<IVocabularyRow | null> => {
  const fullPayload: IVocabularyCreatePayload = {
    ...payload,
    lesson_id: lessonId,
  };

  validateVocabularyPayload(fullPayload);

  return addVocab(fullPayload);
};

/**
 * Updates an existing vocabulary record after validation.
 *
 * @param id - UUID of the vocabulary record to update
 * @param payload - Partial vocabulary data to apply
 * @returns The updated vocabulary row, or `null` on failure
 * @throws {Error} When validation fails
 */
export const editVocabulary = async (
  id: string,
  payload: IVocabularyUpdatePayload,
): Promise<IVocabularyRow | null> => {
  if (!id) {
    throw new Error('Vocabulary ID is required for update.');
  }

  validateVocabularyPayload(payload);

  return updateVocab(id, payload);
};

/**
 * Removes a vocabulary record by its ID.
 *
 * @param id - UUID of the vocabulary record to delete
 * @returns `true` if the record was deleted successfully
 * @throws {Error} When the ID is missing
 */
export const removeVocabulary = async (id: string): Promise<boolean> => {
  if (!id) {
    throw new Error('Vocabulary ID is required for deletion.');
  }

  return deleteVocab(id);
};
