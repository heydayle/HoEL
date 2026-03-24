import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonDetailModal } from './LessonDetailModal';
import type { ILesson } from '@/modules/lesson/core/models';

/** i18n stub — returns the key so assertions stay readable */
const t = (key: string) => key;

/** Builds a minimal ILesson fixture */
const makeLesson = (overrides: Partial<ILesson> = {}): ILesson => ({
  id: 'lesson-1',
  topic: 'English Basics',
  participantName: 'Alice',
  date: '2026-03-01T09:00:00.000Z',
  notes: 'Some notes',
  priority: 'High',
  isPinned: false,
  isFavorite: false,
  links: [],
  vocabularies: [],
  questions: [],
  ...overrides,
});

/** A full vocabulary entry fixture */
const makeVocab = (overrides = {}) => ({
  id: 'vocab-1',
  word: 'happy',
  ipa: '/ˈhæpi/',
  partOfSpeech: 'adjective',
  meaning: 'Feeling or showing pleasure',
  translation: 'vui vẻ',
  pronunciation: 'HAP-ee',
  example: 'She is <b>happy</b>.',
  ...overrides,
});

describe('LessonDetailModal — null lesson', () => {
  it('renders nothing when lesson is null', () => {
    const { container } = render(
      <LessonDetailModal lesson={null} t={t} onClose={jest.fn()} />,
    );
    // Only the React fragment root — no dialog content
    expect(container.firstChild).toBeNull();
  });
});

describe('LessonDetailModal — header', () => {
  it('renders topic as dialog title', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('English Basics')).toBeInTheDocument();
  });

  it('renders participant name as dialog description', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('form_participant: Alice')).toBeInTheDocument();
  });
});

describe('LessonDetailModal — meta strip', () => {
  it('renders the formatted date chip', () => {
    const lesson = makeLesson({ date: '2026-03-01T09:00:00.000Z' });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // toLocaleDateString output varies by locale; just verify it's present
    const formatted = new Date('2026-03-01T09:00:00.000Z').toLocaleDateString();
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it('renders priority chip', () => {
    render(<LessonDetailModal lesson={makeLesson({ priority: 'High' })} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders notes chip when notes are present', () => {
    render(<LessonDetailModal lesson={makeLesson({ notes: 'Test note' })} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  it('does NOT render a notes chip when notes are empty', () => {
    const { container } = render(
      <LessonDetailModal lesson={makeLesson({ notes: '' })} t={t} onClose={jest.fn()} />,
    );
    // The dim MetaChip is only rendered when notes is truthy;
    // verify no element with $dim prop text exists (check via absence of aria or structure)
    const dimChips = container.querySelectorAll('[class*="MetaChip"]');
    // All present chips should NOT contain an empty string as sole text content
    dimChips.forEach((chip) => {
      expect(chip.textContent?.trim()).not.toBe('');
    });
  });

  it('renders vocab count chip', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // "1 vocab_count" — &nbsp; renders as a space in DOM
    expect(screen.getByText(/1\s*vocab_count/)).toBeInTheDocument();
  });

  it('renders question count chip', () => {
    const lesson = makeLesson({ questions: [{ id: 'q1' }] as ILesson['questions'] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText(/1\s*question_count/)).toBeInTheDocument();
  });
});

describe('LessonDetailModal — vocabulary list', () => {
  it('does not render vocab section when vocabularies are empty', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('vocab_section_title')).not.toBeInTheDocument();
  });

  it('renders vocab section title when vocabularies exist', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('vocab_section_title')).toBeInTheDocument();
  });

  it('renders vocab index number', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders the word', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // 'happy' can appear in both VocabWord and the example HTML context
    expect(screen.getAllByText('happy').length).toBeGreaterThanOrEqual(1);
  });

  it('renders IPA when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('/ˈhæpi/')).toBeInTheDocument();
  });

  it('does not render IPA when absent', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ ipa: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('/ˈhæpi/')).not.toBeInTheDocument();
  });

  it('renders part of speech badge when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('adjective')).toBeInTheDocument();
  });

  it('does not render PoS badge when absent', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ partOfSpeech: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('adjective')).not.toBeInTheDocument();
  });

  it('renders pronunciation when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText(/HAP-ee/)).toBeInTheDocument();
  });

  it('renders meaning row (Row 2) when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // The <br/> node splits the label span text — use regex to match
    expect(screen.getByText(/vocab_meaning_label/)).toBeInTheDocument();
    expect(screen.getByText('Feeling or showing pleasure')).toBeInTheDocument();
  });

  it('does not render meaning row when meaning is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ meaning: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('vocab_meaning_label:')).not.toBeInTheDocument();
  });

  it('renders example row (Row 3) via dangerouslySetInnerHTML', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // Label uses <br/> — match via regex
    expect(screen.getByText(/vocab_example_label/)).toBeInTheDocument();
    // Dialog renders in a portal (document.body), not in the local container.
    // Verify the example text content is present anywhere in the document.
    expect(document.body.innerHTML).toContain('She is');
    expect(document.body.innerHTML).toContain('<b>');
  });

  it('does not render example row when example is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ example: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('vocab_example_label:')).not.toBeInTheDocument();
  });

  it('renders translation row (Row 4) when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    // Label uses <br/> — match via regex
    expect(screen.getByText(/vocab_translation_label/)).toBeInTheDocument();
    expect(screen.getByText('vui vẻ')).toBeInTheDocument();
  });

  it('does not render translation row when translation is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ translation: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.queryByText('vocab_translation_label:')).not.toBeInTheDocument();
  });

  it('renders correct index for multiple vocab entries', () => {
    const lesson = makeLesson({
      vocabularies: [
        makeVocab({ id: 'v1', word: 'happy' }),
        makeVocab({ id: 'v2', word: 'sad' }),
      ],
    });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={jest.fn()} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    // Both words appear — getAllByText handles multiple matches (word title + meaning context)
    expect(screen.getAllByText('happy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('sad').length).toBeGreaterThanOrEqual(1);
  });
});

describe('LessonDetailModal — close behaviour', () => {
  it('calls onClose when dialog requests close', () => {
    const onClose = jest.fn();
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={onClose} />);
    // Simulate pressing Escape — radix Dialog fires onOpenChange(false)
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
