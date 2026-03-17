import type { ILesson } from '@/app/modules/lesson/core/models';

/**
 * Repository contract for lesson data access.
 */
export interface ILessonRepository {
  /**
   * Reads all lessons from a persistence source.
   * @returns A list of stored lessons
   */
  getAllLessons: () => ILesson[];
}
