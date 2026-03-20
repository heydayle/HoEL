import type { ILesson, IVocabulary } from '@/modules/lesson/core/models';

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

/**
 * Gửi request lên server để tạo từ vựng tự động qua LLM
 * @param {string} word - Từ vựng cần tra cứu
 * @returns {Promise<IVocabulary>} Dữ liệu từ vựng đã được format
 */
export const fetchGeneratedVocab = async (word: string): Promise<IVocabulary> => {
  const response = await fetch('/api/workflow/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate vocabulary from server');
  }

  return response.json();
};