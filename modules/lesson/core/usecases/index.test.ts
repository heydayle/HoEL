import type { ILesson } from '@/modules/lesson/core/models';

import { getFilteredLessons, getLessonStats, sortLessons } from './index';

/**
 * Creates a minimal lesson object for use case tests.
 * @param id - Identifier of lesson
 * @param overrides - Optional custom fields to override defaults
 * @returns Lesson object for testing
 */
const buildLesson = (id: string, overrides?: Partial<ILesson>): ILesson => ({
  id,
  date: '2026-03-14T09:00:00.000Z',
  topic: `Topic ${id}`,
  participantName: 'Learner',
  isPinned: false,
  isFavorite: false,
  priority: 'Low',
  notes: 'Note',
  vocabularies: [],
  ...overrides,
});

describe('lesson usecases', () => {
  it('should compute total lessons, vocabularies, and questions', () => {
    const lessons = [
      buildLesson('1', {
        vocabularies: [
          {
            id: '1-vocab',
            word: 'w1',
            ipa: '/w1/',
            partOfSpeech: 'noun',
            meaning: 'm1',
            translation: 't1',
            pronunciation: 'p1',
            example: 'e1',
          },
        ],
      }),
      buildLesson('2', {
        vocabularies: [
          {
            id: '2-vocab-1',
            word: 'w2',
            ipa: '/w2/',
            partOfSpeech: 'noun',
            meaning: 'm2',
            translation: 't2',
            pronunciation: 'p2',
            example: 'e2',
          },
          {
            id: '2-vocab-2',
            word: 'w3',
            ipa: '/w3/',
            partOfSpeech: 'verb',
            meaning: 'm3',
            translation: 't3',
            pronunciation: 'p3',
            example: 'e3',
          },
        ],
      }),
    ];

    expect(getLessonStats(lessons)).toEqual({
      totalLessons: 2,
      totalVocabularies: 3,
      totalQuestions: 0,
    });
  });

  it('should filter lessons by search term and pinned flag', () => {
    const lessons = [
      buildLesson('1', { topic: 'Daily Conversation', isPinned: true }),
      buildLesson('2', { topic: 'Travel English', isPinned: false }),
    ];

    expect(
      getFilteredLessons(lessons, {
        searchTerm: 'daily',
        isPinned: true,
        isFavorite: false,
        priority: 'all',
        startDate: '',
        endDate: '',
        sortBy: 'date_desc',
      }),
    ).toHaveLength(1);
  });

  it('should sort lessons by priority descending', () => {
    const sorted = sortLessons(
      [
        buildLesson('1', { priority: 'Low' }),
        buildLesson('2', { priority: 'High' }),
        buildLesson('3', { priority: 'Medium' }),
      ],
      'priority_desc',
    );

    expect(sorted.map((lesson) => lesson.priority)).toEqual(['High', 'Medium', 'Low']);
  });
});
