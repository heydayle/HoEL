import type { ILesson, ILessonStats, LessonPriority, IDifyVocabResponse } from '@/modules/lesson/core/models';
import { fetchGeneratedVocab } from '../../infras';
/**
 * Supported sort options for the lessons list.
 */
export type LessonSortOption = 'date_desc' | 'date_asc' | 'priority_desc' | 'topic_asc';

/**
 * Filter input used to query lessons list data.
 */
export interface ILessonFilterInput {
  /** Full-text term matched against topic, participant name, and notes */
  searchTerm: string;
  /** Optional pinned filter */
  isPinned: boolean;
  /** Optional favorite filter */
  isFavorite: boolean;
  /** Priority filter where 'all' means no filtering */
  priority: LessonPriority | 'all';
  /** Optional ISO start date */
  startDate: string;
  /** Optional ISO end date */
  endDate: string;
  /** Active sort strategy */
  sortBy: LessonSortOption;
}

/**
 * Fallback sample lessons displayed when local data does not exist yet.
 */
export const LESSON_FALLBACK_DATA: ILesson[] = [
  {
    id: 'lesson-001',
    date: '2026-03-14T09:00:00.000Z',
    topic: 'Daily Conversation',
    participantName: 'Ms. Linh',
    isPinned: true,
    isFavorite: true,
    priority: 'High',
    notes: 'Focus on greetings, introducing yourself, and asking follow-up questions naturally.',
    vocabularies: [
      {
        id: 'vocab-001',
        word: 'icebreaker',
        ipa: '/ˈaɪsˌbreɪ.kɚ/',
        partOfSpeech: 'noun',
        meaning: 'A prompt or activity that helps people start talking.',
        translation: 'câu/chủ đề mở đầu',
        pronunciation: 'ice-bray-ker',
        example: 'We used a simple icebreaker before role-play.',
      },
    ],
  },
  {
    id: 'lesson-002',
    date: '2026-03-12T09:00:00.000Z',
    topic: 'Travel English',
    participantName: 'Mr. Nam',
    isPinned: false,
    isFavorite: true,
    priority: 'Medium',
    notes: 'Practice asking for directions, booking hotels, and airport conversations.',
    vocabularies: [],
  },
];

/**
 * Priority ranking map used by sort strategies.
 */
const PRIORITY_RANK: Record<LessonPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Checks whether a lesson matches free-text search conditions.
 * @param lesson - Candidate lesson
 * @param searchTerm - Search text entered by user
 * @returns True when the lesson should be included
 */
export const matchesLessonSearch = (lesson: ILesson, searchTerm: string): boolean => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [lesson.topic, lesson.participantName, lesson.notes]
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
};

/**
 * Checks whether a lesson satisfies toggle/priority/date filters.
 * @param lesson - Candidate lesson
 * @param filters - Filter conditions
 * @returns True when all active filters are satisfied
 */
export const matchesLessonFilters = (lesson: ILesson, filters: ILessonFilterInput): boolean => {
  if (filters.isPinned && !lesson.isPinned) {
    return false;
  }

  if (filters.isFavorite && !lesson.isFavorite) {
    return false;
  }

  if (filters.priority !== 'all' && lesson.priority !== filters.priority) {
    return false;
  }

  const lessonDate = new Date(lesson.date).getTime();

  if (filters.startDate) {
    const startDate = new Date(filters.startDate).getTime();
    if (lessonDate < startDate) {
      return false;
    }
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate).getTime();
    if (lessonDate > endDate) {
      return false;
    }
  }

  return true;
};

/**
 * Sorts lessons with a selected strategy.
 * @param lessons - Lessons before sorting
 * @param sortBy - Sort strategy option
 * @returns New sorted lesson array
 */
export const sortLessons = (lessons: ILesson[], sortBy: LessonSortOption): ILesson[] => {
  const copiedLessons = [...lessons];

  switch (sortBy) {
    case 'date_asc':
      return copiedLessons.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'priority_desc':
      return copiedLessons.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
    case 'topic_asc':
      return copiedLessons.sort((a, b) => a.topic.localeCompare(b.topic));
    case 'date_desc':
    default:
      return copiedLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

/**
 * Applies search, filters, and sort to produce lessons list data.
 * @param lessons - Source lesson collection
 * @param filters - Search/filter/sort criteria
 * @returns Processed lesson list
 */
export const getFilteredLessons = (lessons: ILesson[], filters: ILessonFilterInput): ILesson[] => {
  const filteredLessons = lessons
    .filter((lesson) => matchesLessonSearch(lesson, filters.searchTerm))
    .filter((lesson) => matchesLessonFilters(lesson, filters));

  return sortLessons(filteredLessons, filters.sortBy);
};

/**
 * Builds aggregate statistics from a lesson list.
 * @param lessons - Source lesson collection
 * @returns Computed lesson statistics for the overview UI
 */
export const getLessonStats = (lessons: ILesson[]): ILessonStats => {
  const totalLessons = lessons.length;
  const totalVocabularies = lessons.reduce((sum, lesson) => sum + lesson.vocabularies.length, 0);

  return {
    totalLessons,
    totalVocabularies,
  };
};

/**
 * UseCase: Xử lý logic nghiệp vụ khi người dùng yêu cầu tạo từ vựng
 * @param {string} word - Từ vựng nhập vào từ UI
 * @returns {Promise<IDifyVocabResponse>} Raw response từ Dify API
 */
export const executeGenerateVocab = async (word: string): Promise<IDifyVocabResponse> => {
  // 1. Validate đầu vào (Business logic)
  if (!word || word.trim().length === 0) {
    throw new Error('Word cannot be empty');
  }

  try {
    // 2. Gọi tầng Infras để lấy data
    const newVocab = await fetchGeneratedVocab(word.trim());

    // 3. (Optional) Thực hiện các nghiệp vụ khác:
    // Ví dụ: SaveToLocalStorage(newVocab) hoặc dispatch(addVocab(newVocab))

    return newVocab;
  } catch (error) {
    // Xử lý lỗi đặc thù của business nếu cần
    console.error('UseCase Error: executeGenerateVocab failed', error);
    throw error;
  }
};