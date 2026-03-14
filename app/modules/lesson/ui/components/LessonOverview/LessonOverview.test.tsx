import { fireEvent, render, screen } from '@testing-library/react';

import type { ILesson, ILessonStats } from '@/app/modules/lesson/core/models';
import type { ILessonFilterInput } from '@/app/modules/lesson/core/usecases';

import { LessonOverview } from './LessonOverview';

/**
 * Mock lesson stats for component testing.
 */
const MOCK_STATS: ILessonStats = {
  totalLessons: 1,
  totalVocabularies: 2,
  totalQuestions: 1,
};

/**
 * Mock lesson for list rendering tests.
 */
const MOCK_LESSONS: ILesson[] = [
  {
    id: 'lesson-1',
    date: '2026-03-14T00:00:00.000Z',
    topic: 'Travel English',
    participantName: 'Mr. Nam',
    isPinned: true,
    isFavorite: true,
    priority: 'Medium',
    notes: 'Practice asking for directions.',
    links: ['https://example.com/travel-english'],
    vocabularies: [
      {
        id: 'v1',
        word: 'ticket',
        ipa: '/ˈtɪk.ɪt/',
        partOfSpeech: 'noun',
        meaning: 'travel ticket',
        translation: 'vé',
        pronunciation: 'ti-kit',
        example: 'I need a train ticket.',
      },
      {
        id: 'v2',
        word: 'platform',
        ipa: '/ˈplæt.fɔːm/',
        partOfSpeech: 'noun',
        meaning: 'train platform',
        translation: 'sân ga',
        pronunciation: 'plat-form',
        example: 'Which platform should I go to?',
      },
    ],
    questions: [{ id: 'q1', questionText: 'Where is gate 5?', answerText: 'Near the escalator.' }],
  },
];

/**
 * Mock filters used by the form controls.
 */
const MOCK_FILTERS: ILessonFilterInput = {
  searchTerm: '',
  isPinned: false,
  isFavorite: false,
  priority: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date_desc',
};

/**
 * Translation mock that returns the input key.
 * @param key - Translation key
 * @returns Same key for predictable tests
 */
const t = (key: string): string => key;

describe('LessonOverview', () => {
  it('should render summary statistics and a lesson card', () => {
    render(
      <LessonOverview
        stats={MOCK_STATS}
        lessons={MOCK_LESSONS}
        filters={MOCK_FILTERS}
        t={t}
        onSearchTermChange={jest.fn()}
        onPinnedFilterChange={jest.fn()}
        onFavoriteFilterChange={jest.fn()}
        onPriorityFilterChange={jest.fn()}
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onSortChange={jest.fn()}
        onResetFilters={jest.fn()}
      />,
    );

    expect(screen.getByText('stats_lessons')).toBeInTheDocument();
    expect(screen.getByText('Travel English')).toBeInTheDocument();
    expect(screen.getByText(/vocab_count/)).toBeInTheDocument();
  });

  it('should call search handler when user types in search box', () => {
    const onSearchTermChange = jest.fn();

    render(
      <LessonOverview
        stats={MOCK_STATS}
        lessons={MOCK_LESSONS}
        filters={MOCK_FILTERS}
        t={t}
        onSearchTermChange={onSearchTermChange}
        onPinnedFilterChange={jest.fn()}
        onFavoriteFilterChange={jest.fn()}
        onPriorityFilterChange={jest.fn()}
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onSortChange={jest.fn()}
        onResetFilters={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('search_aria_label'), {
      target: { value: 'travel' },
    });

    expect(onSearchTermChange).toHaveBeenCalledWith('travel');
  });
});
