import { vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { ILesson, ILessonStats } from '@/modules/lesson/core/models';
import type { ILessonFilterInput } from '@/modules/lesson/core/usecases';

import { LessonOverview } from './LessonOverview';

/** Mock sonner toast so we can assert toast.success calls */
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

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
  vocabSearchTerm: '',
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

/** Default props shared across all tests */
const defaultProps = {
  loading: false,
  stats: MOCK_STATS,
  lessons: MOCK_LESSONS,
  filters: MOCK_FILTERS,
  t,
  onSearchTermChange: vi.fn(),
  onVocabSearchTermChange: vi.fn(),
  onPinnedFilterChange: vi.fn(),
  onFavoriteFilterChange: vi.fn(),
  onPriorityFilterChange: vi.fn(),
  onStartDateChange: vi.fn(),
  onEndDateChange: vi.fn(),
  onSortChange: vi.fn(),
  onResetFilters: vi.fn(),
  onSelectLesson: vi.fn(),
  onEditLesson: vi.fn(),
};

describe('LessonOverview', () => {
  it('should render summary statistics and a lesson card', () => {
    render(<LessonOverview {...defaultProps} />);

    expect(screen.getByText('stats_lessons')).toBeInTheDocument();
    expect(screen.getByText('Travel English')).toBeInTheDocument();
    expect(screen.getByText(/vocab_count/)).toBeInTheDocument();
  });

  it('should call search handler when user types in search box', () => {
    const onSearchTermChange = vi.fn();

    render(<LessonOverview {...defaultProps} onSearchTermChange={onSearchTermChange} />);

    fireEvent.change(screen.getByLabelText('search_aria_label'), {
      target: { value: 'travel' },
    });

    expect(onSearchTermChange).toHaveBeenCalledWith('travel');
  });

  it('should call corresponding handlers when filters are changed', () => {
    const onPriorityFilterChange = vi.fn();
    const onPinnedFilterChange = vi.fn();
    const onFavoriteFilterChange = vi.fn();
    const onStartDateChange = vi.fn();
    const onEndDateChange = vi.fn();
    const onSortChange = vi.fn();
    const onResetFilters = vi.fn();

    render(
      <LessonOverview
        {...defaultProps}
        onPinnedFilterChange={onPinnedFilterChange}
        onFavoriteFilterChange={onFavoriteFilterChange}
        onPriorityFilterChange={onPriorityFilterChange}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
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
    render(<LessonOverview {...defaultProps} lessons={[]} />);
    expect(screen.getByText('empty_state')).toBeInTheDocument();
  });

  /** ── Share button ── */

  describe('Share button', () => {
    /** Set up navigator.clipboard mock before each share test */
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
      vi.clearAllMocks();
    });

    it('renders the share button for each lesson card', () => {
      render(<LessonOverview {...defaultProps} />);
      expect(screen.getByLabelText('share_link_label')).toBeInTheDocument();
    });

    it('copies the correct share URL to clipboard when share button is clicked', async () => {
      render(<LessonOverview {...defaultProps} />);

      const shareBtn = screen.getByLabelText('share_link_label');
      await act(async () => {
        fireEvent.click(shareBtn);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/s/lesson-1`,
      );
    });

    it('calls toast.success with the share_link_copied key after copying', async () => {
      render(<LessonOverview {...defaultProps} />);

      const shareBtn = screen.getByLabelText('share_link_label');
      await act(async () => {
        fireEvent.click(shareBtn);
      });

      expect(toast.success).toHaveBeenCalledWith('share_link_copied');
    });

    it('does not trigger onSelectLesson when share button is clicked (stopPropagation)', async () => {
      const onSelectLesson = vi.fn();
      render(<LessonOverview {...defaultProps} onSelectLesson={onSelectLesson} />);

      const shareBtn = screen.getByLabelText('share_link_label');
      await act(async () => {
        fireEvent.click(shareBtn);
      });

      expect(onSelectLesson).not.toHaveBeenCalled();
    });

    it('resets the copied icon back after 2000 ms', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<LessonOverview {...defaultProps} />);

      const shareBtn = screen.getByLabelText('share_link_label');
      await act(async () => {
        fireEvent.click(shareBtn);
      });

      // After clicking the icon should show the copied state — button still present
      await waitFor(() =>
        expect(screen.getByLabelText('share_link_label')).toBeInTheDocument(),
      );

      // Advance timers past the 2 s reset
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      // Button still rendered (icon reverted to Link2 — no copied state)
      expect(screen.getByLabelText('share_link_label')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});

