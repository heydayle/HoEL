import { fireEvent, render, screen } from '@testing-library/react';

import type { ILesson, ILessonStats } from '@/modules/lesson/core/models';
import type { ILessonFilterInput } from '@/modules/lesson/core/usecases';

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
        onSelectLesson={jest.fn()}
        onEditLesson={jest.fn()}
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
        onSelectLesson={jest.fn()}
        onEditLesson={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('search_aria_label'), {
      target: { value: 'travel' },
    });

    expect(onSearchTermChange).toHaveBeenCalledWith('travel');
  });

  it('should call corresponding handlers when filters are changed', () => {
    const onPriorityFilterChange = jest.fn();
    const onPinnedFilterChange = jest.fn();
    const onFavoriteFilterChange = jest.fn();
    const onStartDateChange = jest.fn();
    const onEndDateChange = jest.fn();
    const onSortChange = jest.fn();
    const onResetFilters = jest.fn();

    render(
      <LessonOverview
        stats={MOCK_STATS}
        lessons={MOCK_LESSONS}
        filters={MOCK_FILTERS}
        t={t}
        onSearchTermChange={jest.fn()}
        onPinnedFilterChange={onPinnedFilterChange}
        onFavoriteFilterChange={onFavoriteFilterChange}
        onPriorityFilterChange={onPriorityFilterChange}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
        onSelectLesson={jest.fn()}
        onEditLesson={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('priority_filter_aria_label'), {
      target: { value: 'High' },
    });
    expect(onPriorityFilterChange).toHaveBeenCalledWith('High');

    fireEvent.change(screen.getByLabelText('sort_aria_label'), {
      target: { value: 'topic_asc' },
    });
    expect(onSortChange).toHaveBeenCalledWith('topic_asc');

    fireEvent.change(screen.getByLabelText('start_date_aria_label'), {
      target: { value: '2026-03-01' },
    });
    expect(onStartDateChange).toHaveBeenCalledWith('2026-03-01');

    fireEvent.change(screen.getByLabelText('end_date_aria_label'), {
      target: { value: '2026-03-31' },
    });
    expect(onEndDateChange).toHaveBeenCalledWith('2026-03-31');

    fireEvent.click(screen.getByLabelText('filter_pinned'));
    expect(onPinnedFilterChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByLabelText('filter_favorite'));
    expect(onFavoriteFilterChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByText('reset_filters'));
    expect(onResetFilters).toHaveBeenCalled();
  });

  it('renders empty state when lessons array is empty', () => {
    render(
      <LessonOverview
        stats={MOCK_STATS}
        lessons={[]}
        filters={MOCK_FILTERS}
        t={t}
        onSearchTermChange={jest.fn()}
        onPinnedFilterChange={jest.fn()}
        onFavoriteFilterChange={jest.fn()}
        onPriorityFilterChange={jest.fn()}
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onSortChange={jest.fn()}
        onResetFilters={jest.fn()}        onSelectLesson={jest.fn()}
        onEditLesson={jest.fn()}      />,
    );

    expect(screen.getByText('empty_state')).toBeInTheDocument();
  });
});
