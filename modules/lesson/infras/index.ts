import type { ILesson } from '@/modules/lesson/core/models';

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

/**
 * Saves lesson records to localStorage.
 * @param lessons - Lessons to save
 */
export const saveLessonsToLocalStorage = (lessons: ILesson[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(lessons));
};
