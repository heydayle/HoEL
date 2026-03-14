import { render, screen } from '@testing-library/react';

import LessonPage from './index';

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
    stats: {
      totalLessons: 1,
      totalVocabularies: 1,
      totalQuestions: 1,
    },
    latestLesson: {
      id: 'lesson-001',
      date: '2026-03-14T09:00:00.000Z',
      topic: 'Daily Conversation',
      participantName: 'Ms. Linh',
      isPinned: true,
      isFavorite: true,
      priority: 'High' as const,
      notes: 'Notes',
      links: ['https://example.com'],
      vocabularies: [],
      questions: [],
    },
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
