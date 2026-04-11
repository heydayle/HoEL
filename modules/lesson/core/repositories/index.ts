import type { ILesson, ISummaryLesson } from '@/modules/lesson/core/models';

/**
 * Repository contract for lesson data access.
 */
export interface ILessonRepository {
  /**
   * Reads all lessons from a persistence source.
   * @returns A list of stored lessons
   */
  getAllLessons: () => ILesson[];

  /**
   * Reads all summary lessons from a persistence source.
   * @returns A list of stored summary lessons
   */
  getAllSummaryLessons: () => ISummaryLesson[];
}
