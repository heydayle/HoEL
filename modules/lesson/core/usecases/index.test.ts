import type { ILesson } from '@/modules/lesson/core/models';

import { getFilteredLessons, getLessonStats, matchesVocabSearch, sortLessons } from './index';

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
        vocabSearchTerm: '',
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

describe('matchesVocabSearch', () => {
  it('should return true when search term is empty', () => {
    const lesson = buildLesson('1');
    expect(matchesVocabSearch(lesson, '')).toBe(true);
  });

  it('should return true when search term is whitespace only', () => {
    const lesson = buildLesson('1');
    expect(matchesVocabSearch(lesson, '   ')).toBe(true);
  });

  it('should return false when lesson has no vocabularies and term is non-empty', () => {
    const lesson = buildLesson('1', { vocabularies: [] });
    expect(matchesVocabSearch(lesson, 'hello')).toBe(false);
  });

  it('should return true when word matches', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'icebreaker',
          ipa: '',
          partOfSpeech: 'noun',
          meaning: 'a prompt',
          translation: 'câu mở đầu',
          pronunciation: '',
          example: 'We used an icebreaker.',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'icebreaker')).toBe(true);
  });

  it('should return true when meaning matches (case-insensitive)', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A greeting used to say hi',
          translation: 'xin chào',
          pronunciation: '',
          example: 'Hello there!',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'GREETING')).toBe(true);
  });

  it('should return true when translation matches', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: 'Hello there!',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'xin chào')).toBe(true);
  });

  it('should return true when example matches', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: 'Hello there, my friend!',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'my friend')).toBe(true);
  });

  it('should return false when no vocabulary field matches', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: 'Hello there!',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'nonexistent')).toBe(false);
  });

  it('should match if any vocabulary item matches in a multi-vocab lesson', () => {
    const lesson = buildLesson('1', {
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: 'Hello there!',
        },
        {
          id: 'v2',
          word: 'goodbye',
          ipa: '',
          partOfSpeech: 'interjection',
          meaning: 'A farewell',
          translation: 'tạm biệt',
          pronunciation: '',
          example: 'Goodbye!',
        },
      ],
    });

    expect(matchesVocabSearch(lesson, 'farewell')).toBe(true);
  });
});

describe('getFilteredLessons with vocabSearchTerm', () => {
  it('should filter out lessons with no matching vocabulary', () => {
    const lessons = [
      buildLesson('1', {
        topic: 'Daily Conversation',
        vocabularies: [
          {
            id: 'v1',
            word: 'icebreaker',
            ipa: '',
            partOfSpeech: 'noun',
            meaning: 'a prompt',
            translation: 'câu mở đầu',
            pronunciation: '',
            example: 'We used an icebreaker.',
          },
        ],
      }),
      buildLesson('2', {
        topic: 'Travel English',
        vocabularies: [
          {
            id: 'v2',
            word: 'airport',
            ipa: '',
            partOfSpeech: 'noun',
            meaning: 'place for planes',
            translation: 'sân bay',
            pronunciation: '',
            example: 'I went to the airport.',
          },
        ],
      }),
    ];

    const result = getFilteredLessons(lessons, {
      searchTerm: '',
      vocabSearchTerm: 'icebreaker',
      isPinned: false,
      isFavorite: false,
      priority: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should return all lessons when vocabSearchTerm is empty', () => {
    const lessons = [buildLesson('1'), buildLesson('2')];

    const result = getFilteredLessons(lessons, {
      searchTerm: '',
      vocabSearchTerm: '',
      isPinned: false,
      isFavorite: false,
      priority: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    });

    expect(result).toHaveLength(2);
  });

  it('should compose with existing search filters', () => {
    const lessons = [
      buildLesson('1', {
        topic: 'Daily Conversation',
        isPinned: true,
        vocabularies: [
          {
            id: 'v1',
            word: 'icebreaker',
            ipa: '',
            partOfSpeech: 'noun',
            meaning: 'a prompt',
            translation: 'câu mở đầu',
            pronunciation: '',
            example: 'We used an icebreaker.',
          },
        ],
      }),
      buildLesson('2', {
        topic: 'Daily Conversation',
        isPinned: false,
        vocabularies: [
          {
            id: 'v2',
            word: 'icebreaker',
            ipa: '',
            partOfSpeech: 'noun',
            meaning: 'a prompt',
            translation: 'câu mở đầu',
            pronunciation: '',
            example: 'Another icebreaker example.',
          },
        ],
      }),
    ];

    const result = getFilteredLessons(lessons, {
      searchTerm: 'daily',
      vocabSearchTerm: 'icebreaker',
      isPinned: true,
      isFavorite: false,
      priority: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
