import type { ILesson, ILessonStats } from '@/app/modules/lesson/core/models';

/**
 * Fallback sample lesson displayed when no local data exists yet.
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
    links: ['https://www.bbc.co.uk/learningenglish'],
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
    questions: [
      {
        id: 'question-001',
        questionText: 'How do you introduce yourself in a formal context?',
        answerText: 'Use your name, role, and a polite greeting.',
      },
    ],
  },
];

/**
 * Builds aggregate statistics from a lesson list.
 * @param lessons - Source lesson collection
 * @returns Computed lesson statistics for the overview UI
 */
export const getLessonStats = (lessons: ILesson[]): ILessonStats => {
  const totalLessons = lessons.length;
  const totalVocabularies = lessons.reduce((sum, lesson) => sum + lesson.vocabularies.length, 0);
  const totalQuestions = lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);

  return {
    totalLessons,
    totalVocabularies,
    totalQuestions,
  };
};
