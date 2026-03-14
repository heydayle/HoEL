import type { ILesson } from '@/app/modules/lesson/core/models';

/** Key used to persist lessons in browser localStorage. */
const LESSON_STORAGE_KEY = 'lingonote_lessons';

/**
 * Reads lesson records from localStorage.
 * @returns Parsed lessons, or an empty array if unavailable/invalid
 */
export const getLessonsFromLocalStorage = (): ILesson[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(LESSON_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as ILesson[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
