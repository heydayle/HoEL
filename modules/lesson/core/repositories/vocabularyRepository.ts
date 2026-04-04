import type {
  IVocabularyCreatePayload,
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';

/**
 * Repository contract for vocabulary data access.
 * Defines the CRUD operations that any vocabulary persistence adapter must implement.
 */
export interface IVocabularyRepository {
  /**
   * Reads all vocabularies associated with a specific lesson.
   * @param lessonId - UUID of the parent lesson
   * @returns A promise resolving to the list of vocabulary rows
   */
  getByLesson: (lessonId: string) => Promise<IVocabularyRow[]>;

  /**
   * Creates a new vocabulary record.
   * @param payload - Data for the new vocabulary entry
   * @returns The inserted row, or `null` on failure
   */
  create: (payload: IVocabularyCreatePayload) => Promise<IVocabularyRow | null>;

  /**
   * Updates an existing vocabulary record.
   * @param id - UUID of the vocabulary to update
   * @param payload - Partial data to apply
   * @returns The updated row, or `null` on failure
   */
  update: (id: string, payload: IVocabularyUpdatePayload) => Promise<IVocabularyRow | null>;

  /**
   * Deletes a vocabulary record.
   * @param id - UUID of the vocabulary to remove
   * @returns `true` on successful deletion
   */
  delete: (id: string) => Promise<boolean>;
}
