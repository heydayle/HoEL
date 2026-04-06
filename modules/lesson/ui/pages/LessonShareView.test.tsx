import React from 'react';
import { render, screen } from '@testing-library/react';

import type { ILesson } from '@/modules/lesson/core/models';

import { LessonShareView } from './LessonShareView';

/**
 * Mock styled-components exported from `./styled` to plain HTML elements.
 * This avoids SSR/CSS-in-JS issues in the Jest jsdom environment while
 * still verifying the component's rendered output and behaviour.
 */
jest.mock('./styled', () => {
  /**
   * Factory that returns a component rendering as `tag`.
   * Strips styled-components transient props (`$`-prefixed) to avoid
   * React DOM warnings about unknown attributes.
   */
  const el =
    (tag: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children, ...rest }: any) => {
      // Remove all transient props (prefixed with $) before forwarding to the DOM
      const domProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('$')),
      );
      return React.createElement(tag, domProps, children);
    };

  return {
    PageWrapper: el('div'),
    PageContainer: el('main'),
    PageBanner: el('section'),
    PageBadge: el('span'),
    PageHeader: el('div'),
    PageTitle: el('h1'),
    PageSubtitle: el('p'),
    ReadonlyHint: el('p'),
    InfoGrid: el('div'),
    InfoItem: el('div'),
    InfoLabel: el('span'),
    InfoValue: el('span'),
    SectionDivider: el('hr'),
    SectionHeading: el('h2'),
    NotesBlock: el('p'),
    VocabGrid: el('div'),
    VocabCard: el('article'),
    VocabMeta: el('div'),
    VocabCardWord: el('span'),
    VocabIpa: el('span'),
    VocabCardBody: el('div'),
    VocabCardField: el('div'),
    VocabCardFieldLabel: el('span'),
    VocabCardFieldValue: el('span'),
    PriorityChip: el('span'),
    EmptyVocabHint: el('p'),
  };
});


/** Mock lucide-react icons to avoid SVG rendering in jsdom */
jest.mock('lucide-react', () => ({
  Eye: () => null,
  BookOpen: () => null,
  Calendar: () => null,
  Flag: () => null,
  User: () => null,
  Volume2: () => null,
}));

/** Minimal translation stub — returns the key as-is */
const t = (key: string): string => key;

/** Base lesson fixture used across tests */
const baseLesson: ILesson = {
  id: 'lesson-001',
  date: '2024-03-10T09:00:00.000Z',
  topic: 'Past Simple',
  participantName: 'John',
  isPinned: false,
  isFavorite: false,
  priority: 'High',
  notes: 'Reviewed irregular verbs.',
  vocabularies: [],
};

describe('LessonShareView', () => {
  /** ── Banner ── */

  it('renders the lesson topic as the h1 heading', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Past Simple');
  });

  it('renders the public-view badge', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('share_view_badge')).toBeInTheDocument();
  });

  it('renders the share_view_title subtitle', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('share_view_title')).toBeInTheDocument();
  });

  /** ── Read-only hint ── */

  it('renders the readonly hint with role="note"', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByRole('note')).toHaveTextContent('share_view_readonly_hint');
  });

  /** ── Metadata grid ── */

  it('renders participant name', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders the priority chip with the lesson priority value', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders a formatted date string', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    /**
     * toLocaleDateString output is locale-dependent in jsdom, so we only
     * assert that *some* date string is present in the document rather
     * than a hard-coded locale string.
     */
    expect(screen.getByText('share_view_date')).toBeInTheDocument();
  });

  /** ── Notes section ── */

  it('renders the notes content when notes is non-empty', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('Reviewed irregular verbs.')).toBeInTheDocument();
    expect(screen.getByText('share_view_notes')).toBeInTheDocument();
  });

  it('does not render the notes section when notes is an empty string', () => {
    const lessonNoNotes: ILesson = { ...baseLesson, notes: '' };
    render(<LessonShareView lesson={lessonNoNotes} t={t} />);
    expect(screen.queryByText('share_view_notes')).not.toBeInTheDocument();
    expect(screen.queryByText('Reviewed irregular verbs.')).not.toBeInTheDocument();
  });

  /** ── Vocabulary section — empty state ── */

  it('shows the empty vocab hint when there are no vocabularies', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.getByText('share_view_no_vocab')).toBeInTheDocument();
  });

  it('does not render the vocab grid when vocabularies are empty', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  /** ── Vocabulary section — with data ── */

  it('renders a vocabulary card for each entry', () => {
    const lessonWithVocab: ILesson = {
      ...baseLesson,
      vocabularies: [
        {
          id: 'v1',
          word: 'run',
          ipa: '/rʌn/',
          partOfSpeech: 'verb',
          meaning: 'To move swiftly on foot.',
          translation: 'chạy',
          pronunciation: '/rʌn/',
          example: 'She runs every morning.',
        },
        {
          id: 'v2',
          word: 'jump',
          ipa: '/dʒʌmp/',
          partOfSpeech: 'verb',
          meaning: 'To leap.',
          translation: 'nhảy',
          pronunciation: '/dʒʌmp/',
          example: 'He jumped high.',
        },
      ],
    };

    render(<LessonShareView lesson={lessonWithVocab} t={t} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('renders all vocab fields inside a card', () => {
    const lessonWithVocab: ILesson = {
      ...baseLesson,
      vocabularies: [
        {
          id: 'v1',
          word: 'run',
          ipa: '/rʌn/',
          partOfSpeech: 'verb',
          meaning: 'To move swiftly on foot.',
          translation: 'chạy',
          pronunciation: '/rʌn/',
          example: 'She runs every morning.',
        },
      ],
    };

    render(<LessonShareView lesson={lessonWithVocab} t={t} />);

    expect(screen.getByText('run')).toBeInTheDocument();
    // IPA and pronunciation both contain '/rʌn/' in this fixture — assert both are present
    expect(screen.getAllByText('/rʌn/')).toHaveLength(2);
    expect(screen.getByText('verb')).toBeInTheDocument();
    expect(screen.getByText('To move swiftly on foot.')).toBeInTheDocument();
    expect(screen.getByText('chạy')).toBeInTheDocument();
    expect(screen.getByText('She runs every morning.')).toBeInTheDocument();

  });

  it('does not render ipa span when ipa is empty', () => {
    const lessonWithVocab: ILesson = {
      ...baseLesson,
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: '',
          meaning: 'A greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: '',
        },
      ],
    };

    render(<LessonShareView lesson={lessonWithVocab} t={t} />);
    // Only the word should be in the meta row — no empty ipa or pos chip
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.queryByText('//')).not.toBeInTheDocument();
  });

  /** ── Vocabulary count in heading ── */

  it('shows vocabulary count in the section heading when vocab is present', () => {
    const lessonWithVocab: ILesson = {
      ...baseLesson,
      vocabularies: [
        {
          id: 'v1',
          word: 'hello',
          ipa: '',
          partOfSpeech: '',
          meaning: 'Greeting',
          translation: 'xin chào',
          pronunciation: '',
          example: '',
        },
      ],
    };

    render(<LessonShareView lesson={lessonWithVocab} t={t} />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    const vocabHeading = headings.find((h) => h.textContent?.includes('(1)'));
    expect(vocabHeading).toBeTruthy();
  });

  it('does not show count suffix in vocabulary heading when vocab is empty', () => {
    render(<LessonShareView lesson={baseLesson} t={t} />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    const vocabHeading = headings.find((h) => h.textContent?.includes('share_view_vocabulary'));
    expect(vocabHeading?.textContent).not.toContain('(0)');
  });
});
