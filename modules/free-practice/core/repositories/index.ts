import type { IVocabulary } from '@/modules/lesson/core/models';

/**
 * Contract for fetching vocabulary data needed by the free practice game.
 * Implementations live in the `infras/` layer.
 */
export interface IFreePracticeRepository {
  /**
   * Retrieves all vocabulary entries associated with a specific lesson.
   *
   * @param lessonId - UUID of the target lesson
   * @returns Array of vocabulary items for the lesson
   */
  getVocabulariesForLesson(lessonId: string): Promise<IVocabulary[]>;
}
