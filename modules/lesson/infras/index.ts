import type { ILesson, IDifyVocabResponse } from '@/modules/lesson/core/models';
import { createClient } from '@/shared/utils/supabase/client';

/** Key used to persist lessons in browser localStorage. */
const LESSON_STORAGE_KEY = 'lingonote_lessons';

/**
 * Reads lesson records from localStorage.
 * @returns Parsed lessons, or an empty array if unavailable/invalid
 */
export const getLessonsFromLocalStorage = async (): Promise<ILesson[]> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('lessons').select('*');

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
  
  return data as ILesson[];

  // const raw = localStorage.getItem(LESSON_STORAGE_KEY);

  // if (!raw) {
  //   return [];
  // }

  // try {
  //   const parsed = JSON.parse(raw) as ILesson[];
  //   return Array.isArray(parsed) ? parsed : [];
  // } catch {
  //   return [];
  // }
};

/**
 * Saves lesson records to localStorage.
 * @param lessons - Lessons to save
 */
// export const saveLessonsToLocalStorage = (lessons: ILesson[]): void => {
//   if (typeof window === 'undefined') {
//     return;
//   }
//   localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(lessons));
// };

/**
 * Gửi request lên server để tạo từ vựng tự động qua LLM
 * @param {string} word - Từ vựng cần tra cứu
 * @returns {Promise<IDifyVocabResponse>} Raw response data từ Dify API
 */
export const fetchGeneratedVocab = async (word: string): Promise<IDifyVocabResponse> => {
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


/**
 * UseCase: Add lesson with supabase
 * @param {ILesson} lesson - Lesson data to be added
 * @returns {Promise<void>}
 */
export const saveLessonsToLocalStorage = async (lesson: ILesson): Promise<{ data?: any, success?: boolean, error?: boolean }> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      id: lesson.id,
      date: lesson.date,
      topic: lesson.topic,
      participantName: lesson.participantName,
      isPinned: lesson.isPinned,
      isFavorite: lesson.isFavorite,
      priority: lesson.priority,
      notes: lesson.notes,
      // links: JSON.stringify(lesson.links),
      // vocabularies: JSON.stringify(lesson.vocabularies),
      // questions: JSON.stringify(lesson.questions),
    });

  if (error) {
    console.error('Error adding lesson:', error);
    return { success: false, error: true, data: error };
  }
  return { success: true, data };
}