import { vi } from 'vitest'
import { render, screen } from '@testing-library/react';

import LessonPage from './index';

/**
 * Mock next/navigation router
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));


/**
 * Mock overview component to focus on page composition.
 */
vi.mock('@/modules/lesson/ui/components/LessonOverview', () => ({
  LessonOverview: () => <section data-testid="mock-lesson-overview">LessonOverview</section>,
}));

/**
 * Mock hook to provide deterministic page data.
 */
vi.mock('@/modules/lesson/ui/hooks', () => ({
  useLessonPage: vi.fn(() => ({
    resolvedTheme: 'dark' as const,
    locale: 'en' as const,
    setLocale: vi.fn(),
    t: (key: string) => key,
    toggleTheme: vi.fn(),
    filters: {
      searchTerm: '',
      isPinned: false,
      isFavorite: false,
      priority: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    },
    displayedLessons: [],
    stats: {
      totalLessons: 1,
      totalVocabularies: 1,
      totalQuestions: 1,
    },
    loading: false,
    updateSearchTerm: vi.fn(),
    updateVocabSearchTerm: vi.fn(),
    updatePinnedFilter: vi.fn(),
    updateFavoriteFilter: vi.fn(),
    updatePriorityFilter: vi.fn(),
    updateStartDate: vi.fn(),
    updateEndDate: vi.fn(),
    updateSortBy: vi.fn(),
    resetFilters: vi.fn(),
  })),
}));

describe('LessonPage', () => {
  it('should render the create button and overview section', () => {
    render(<LessonPage />);

    expect(screen.getByText('create_lesson_title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lesson-overview')).toBeInTheDocument();
  });
});
