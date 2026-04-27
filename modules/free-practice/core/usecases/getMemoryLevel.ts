import type { MemoryLevel } from '../models';

/**
 * Computes a memory-level classification based on the percentage of
 * correct answers in the session.
 *
 * | Range       | Level           |
 * |-------------|-----------------|
 * | < 50 %      | `needs_review`  |
 * | 50 – 80 %   | `good_grasp`    |
 * | > 80 %      | `excellent`     |
 *
 * When `totalAnswered` is 0, returns `'needs_review'` to avoid division
 * by zero.
 *
 * @param correctAnswers - Number of questions answered correctly
 * @param totalAnswered - Total number of questions attempted
 * @returns The calculated memory level
 */
export const getMemoryLevel = (
  correctAnswers: number,
  totalAnswered: number,
): MemoryLevel => {
  if (totalAnswered === 0) {
    return 'needs_review';
  }

  const percentage = (correctAnswers / totalAnswered) * 100;

  if (percentage > 80) {
    return 'excellent';
  }

  if (percentage >= 50) {
    return 'good_grasp';
  }

  return 'needs_review';
};
