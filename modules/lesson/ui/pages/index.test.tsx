import { render, screen } from '@testing-library/react';

import LessonPage from './index';

/**
 * Mock next/navigation router
 */
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

/**
 * Mock styled-components module to avoid test environment issues.
 */
jest.mock('styled-components', () => {
  const actual = jest.requireActual('styled-components');
  return actual;
});

/**
 * Mock overview component to focus on page composition.
 */
jest.mock('@/app/modules/lesson/ui/components/LessonOverview', () => ({
  LessonOverview: () => <section data-testid="mock-lesson-overview">LessonOverview</section>,
}));

/**
 * Mock hook to provide deterministic page data.
 */
jest.mock('@/app/modules/lesson/ui/hooks', () => ({
  useLessonPage: jest.fn(() => ({
    resolvedTheme: 'dark' as const,
    locale: 'en' as const,
    setLocale: jest.fn(),
    t: (key: string) => key,
    toggleTheme: jest.fn(),
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
    updateSearchTerm: jest.fn(),
    updatePinnedFilter: jest.fn(),
    updateFavoriteFilter: jest.fn(),
    updatePriorityFilter: jest.fn(),
    updateStartDate: jest.fn(),
    updateEndDate: jest.fn(),
    updateSortBy: jest.fn(),
    resetFilters: jest.fn(),
  })),
}));

describe('LessonPage', () => {
  it('should render title, subtitle, and overview section', () => {
    render(<LessonPage />);

    expect(screen.getByText('page_title')).toBeInTheDocument();
    expect(screen.getByText('page_subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lesson-overview')).toBeInTheDocument();
  });
});
