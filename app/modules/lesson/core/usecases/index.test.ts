import type { ILesson } from '@/app/modules/lesson/core/models';

import { getLessonStats } from './index';

/**
 * Creates a minimal lesson object for statistics tests.
 * @param id - Identifier of lesson
 * @param vocabCount - Number of vocab entries
 * @param questionCount - Number of question entries
 * @returns Lesson object for testing
 */
const buildLesson = (id: string, vocabCount: number, questionCount: number): ILesson => ({
  id,
  date: '2026-03-14T09:00:00.000Z',
  topic: `Topic ${id}`,
  participantName: 'Learner',
  isPinned: false,
  isFavorite: false,
  priority: 'Low',
  notes: 'Note',
  links: [],
  vocabularies: Array.from({ length: vocabCount }, (_, index) => ({
    id: `${id}-vocab-${index}`,
    word: 'word',
    ipa: '/wɜːd/',
    partOfSpeech: 'noun',
    meaning: 'meaning',
    translation: 'dịch',
    pronunciation: 'word',
    example: 'example',
  })),
  questions: Array.from({ length: questionCount }, (_, index) => ({
    id: `${id}-question-${index}`,
    questionText: 'question',
    answerText: 'answer',
  })),
});

describe('lesson usecases', () => {
  it('should compute total lessons, vocabularies, and questions', () => {
    const lessons = [buildLesson('1', 2, 1), buildLesson('2', 3, 4)];

    expect(getLessonStats(lessons)).toEqual({
      totalLessons: 2,
      totalVocabularies: 5,
      totalQuestions: 5,
    });
  });
});
