import { render, screen } from '@testing-library/react';

import type { ILesson, ILessonStats } from '@/app/modules/lesson/core/models';

import { LessonOverview } from './LessonOverview';

/**
 * Mock lesson stats for component testing.
 */
const MOCK_STATS: ILessonStats = {
  totalLessons: 2,
  totalVocabularies: 5,
  totalQuestions: 3,
};

/**
 * Mock lesson for latest lesson card testing.
 */
const MOCK_LESSON: ILesson = {
  id: 'lesson-1',
  date: '2026-03-14T00:00:00.000Z',
  topic: 'Travel English',
  participantName: 'Mr. Nam',
  isPinned: false,
  isFavorite: true,
  priority: 'Medium',
  notes: 'Practice asking for directions.',
  links: ['https://example.com/travel-english'],
  vocabularies: [],
  questions: [],
};

/**
 * Translation mock that returns the input key.
 * @param key - Translation key
 * @returns Same key for predictable tests
 */
const t = (key: string): string => key;

describe('LessonOverview', () => {
  it('should render summary statistics', () => {
    render(<LessonOverview stats={MOCK_STATS} latestLesson={MOCK_LESSON} t={t} />);

    expect(screen.getByText('stats_lessons')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('stats_vocab')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('stats_questions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render latest lesson details', () => {
    render(<LessonOverview stats={MOCK_STATS} latestLesson={MOCK_LESSON} t={t} />);

    expect(screen.getByText('Travel English')).toBeInTheDocument();
    expect(screen.getByText(/participant_label/)).toBeInTheDocument();
    expect(screen.getByText(/priority_label/)).toBeInTheDocument();
    expect(screen.getByText(/notes_label/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://example.com/travel-english' }),
    ).toBeInTheDocument();
  });
});
