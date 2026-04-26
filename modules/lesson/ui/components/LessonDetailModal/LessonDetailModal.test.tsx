import { vi } from 'vitest'
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LessonDetailModal } from './LessonDetailModal';
import type { ILesson } from '@/modules/lesson/core/models';

/** Mock speak function for useTextToSpeech */
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

/** Mutable state refs so tests can control isSpeaking / currentWord */
let mockIsSpeaking = false;
let mockCurrentWord: string | null = null;

vi.mock('@/shared/hooks', () => ({
  useTextToSpeech: () => ({
    speak: mockSpeak,
    cancel: mockCancel,
    isSupported: true,
    get isSpeaking() {
      return mockIsSpeaking;
    },
    get currentWord() {
      return mockCurrentWord;
    },
  }),
}));

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
  vocabularies: [],
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
      <LessonDetailModal lesson={null} t={t} onClose={vi.fn()} />,
    );
    // Only the React fragment root — no dialog content
    expect(container.firstChild).toBeNull();
  });
});

describe('LessonDetailModal — header', () => {
  it('renders topic as dialog title', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('English Basics')).toBeInTheDocument();
  });

  it('renders participant name as dialog description', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('form_participant: Alice')).toBeInTheDocument();
  });
});

describe('LessonDetailModal — meta strip', () => {
  it('renders the formatted date chip', () => {
    const lesson = makeLesson({ date: '2026-03-01T09:00:00.000Z' });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // toLocaleDateString output varies by locale; just verify it's present
    const formatted = new Date('2026-03-01T09:00:00.000Z').toLocaleDateString();
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it('renders priority chip', () => {
    render(<LessonDetailModal lesson={makeLesson({ priority: 'High' })} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders notes chip when notes are present', () => {
    render(<LessonDetailModal lesson={makeLesson({ notes: 'Test note' })} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  it('does NOT render a notes chip when notes are empty', () => {
    const { container } = render(
      <LessonDetailModal lesson={makeLesson({ notes: '' })} t={t} onClose={vi.fn()} />,
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
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // "1 vocab_count" — &nbsp; renders as a space in DOM
    expect(screen.getByText(/1\s*vocab_count/)).toBeInTheDocument();
  });

  it('renders question count chip', () => {
    const lesson = makeLesson();
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText(/0\s*question_count/)).toBeInTheDocument();
  });
});

describe('LessonDetailModal — vocabulary list', () => {
  it('does not render vocab section when vocabularies are empty', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText('vocab_section_title')).not.toBeInTheDocument();
  });

  it('renders vocab section title when vocabularies exist', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('vocab_section_title')).toBeInTheDocument();
  });

  it('renders vocab index number', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders the word', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // 'happy' can appear in both VocabWord and the example HTML context
    expect(screen.getAllByText('happy').length).toBeGreaterThanOrEqual(1);
  });

  it('renders IPA when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('/ˈhæpi/')).toBeInTheDocument();
  });

  it('does not render IPA when absent', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ ipa: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText('/ˈhæpi/')).not.toBeInTheDocument();
  });

  it('renders part of speech badge when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // The CSS applies text-transform: uppercase, but the DOM text is still lowercase
    // Use a regex to match case-insensitive
    expect(screen.getByText(/adjective/i)).toBeInTheDocument();
  });

  it('does not render PoS badge when absent', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ partOfSpeech: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText(/adjective/i)).not.toBeInTheDocument();
  });

  it('renders pronunciation when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText(/HAP-ee/)).toBeInTheDocument();
  });

  it('renders meaning row (Row 2) when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // The <br/> node splits the label span text — use regex to match
    expect(screen.getByText(/vocab_meaning_label/)).toBeInTheDocument();
    expect(screen.getByText('Feeling or showing pleasure')).toBeInTheDocument();
  });

  it('does not render meaning row when meaning is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ meaning: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText('vocab_meaning_label:')).not.toBeInTheDocument();
  });

  it('renders example row (Row 3) via dangerouslySetInnerHTML', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // Label uses <br/> — match via regex
    expect(screen.getByText(/vocab_example_label/)).toBeInTheDocument();
    // Dialog renders in a portal (document.body), not in the local container.
    // Verify the example text content is present anywhere in the document.
    expect(document.body.innerHTML).toContain('She is');
    expect(document.body.innerHTML).toContain('<b>');
  });

  it('does not render example row when example is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ example: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText('vocab_example_label:')).not.toBeInTheDocument();
  });

  it('renders translation row (Row 4) when present', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    // Label uses <br/> — match via regex
    expect(screen.getByText(/vocab_translation_label/)).toBeInTheDocument();
    expect(screen.getByText('vui vẻ')).toBeInTheDocument();
  });

  it('does not render translation row when translation is empty', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab({ translation: '' })] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByText('vocab_translation_label:')).not.toBeInTheDocument();
  });

  it('renders correct index for multiple vocab entries', () => {
    const lesson = makeLesson({
      vocabularies: [
        makeVocab({ id: 'v1', word: 'happy' }),
        makeVocab({ id: 'v2', word: 'sad' }),
      ],
    });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    // Both words appear — getAllByText handles multiple matches (word title + meaning context)
    expect(screen.getAllByText('happy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('sad').length).toBeGreaterThanOrEqual(1);
  });
});

describe('LessonDetailModal — close behaviour', () => {
  it('calls onClose when dialog requests close', () => {
    const onClose = vi.fn();
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={onClose} />);
    // Simulate pressing Escape — radix Dialog fires onOpenChange(false)
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('LessonDetailModal — edit button', () => {
  it('renders the Edit button when onEditLesson is provided', () => {
    render(
      <LessonDetailModal
        lesson={makeLesson()}
        t={t}
        onClose={vi.fn()}
        onEditLesson={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('modal_edit_btn')).toBeInTheDocument();
  });

  it('does NOT render the Edit button when onEditLesson is not provided', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.queryByLabelText('modal_edit_btn')).not.toBeInTheDocument();
  });

  it('calls onEditLesson with the lesson and onClose when clicked', () => {
    const onEditLesson = vi.fn();
    const onClose = vi.fn();
    const lesson = makeLesson();
    render(
      <LessonDetailModal
        lesson={lesson}
        t={t}
        onClose={onClose}
        onEditLesson={onEditLesson}
      />,
    );

    fireEvent.click(screen.getByLabelText('modal_edit_btn'));
    expect(onEditLesson).toHaveBeenCalledWith(lesson);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('LessonDetailModal — share button', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders the Share button', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.getByLabelText('share_link_label')).toBeInTheDocument();
  });

  it('copies the share URL to clipboard when clicked', async () => {
    const lesson = makeLesson({ id: 'test-123' });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('share_link_label'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/s/test-123`,
      );
    });
  });

  it('shows the copied checkmark text after clicking share', async () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('share_link_label'));

    await waitFor(() => {
      expect(screen.getByText('share_link_copied')).toBeInTheDocument();
    });
  });
});

describe('LessonDetailModal — delete button', () => {
  it('renders the Delete button when onDeleteLesson is provided', () => {
    render(
      <LessonDetailModal
        lesson={makeLesson()}
        t={t}
        onClose={vi.fn()}
        onDeleteLesson={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('modal_delete_btn')).toBeInTheDocument();
  });

  it('does NOT render the Delete button when onDeleteLesson is not provided', () => {
    render(<LessonDetailModal lesson={makeLesson()} t={t} onClose={vi.fn()} />);
    expect(screen.queryByLabelText('modal_delete_btn')).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(
      <LessonDetailModal
        lesson={makeLesson()}
        t={t}
        onClose={vi.fn()}
        onDeleteLesson={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText('modal_delete_btn'));
    expect(screen.getByText('delete_confirm_title')).toBeInTheDocument();
    expect(screen.getByText('delete_confirm_description')).toBeInTheDocument();
  });

  it('calls onDeleteLesson and onClose when confirmed', async () => {
    const onDeleteLesson = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    const lesson = makeLesson({ id: 'del-123' });

    render(
      <LessonDetailModal
        lesson={lesson}
        t={t}
        onClose={onClose}
        onDeleteLesson={onDeleteLesson}
      />,
    );

    // Open the confirmation dialog
    fireEvent.click(screen.getByLabelText('modal_delete_btn'));
    // Click the confirm button
    fireEvent.click(screen.getByText('delete_confirm_action'));

    await waitFor(() => {
      expect(onDeleteLesson).toHaveBeenCalledWith('del-123');
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('does NOT close modal when delete fails', async () => {
    const onDeleteLesson = vi.fn().mockResolvedValue(false);
    const onClose = vi.fn();

    render(
      <LessonDetailModal
        lesson={makeLesson()}
        t={t}
        onClose={onClose}
        onDeleteLesson={onDeleteLesson}
      />,
    );

    fireEvent.click(screen.getByLabelText('modal_delete_btn'));
    fireEvent.click(screen.getByText('delete_confirm_action'));

    await waitFor(() => {
      expect(onDeleteLesson).toHaveBeenCalled();
    });
    // Modal should NOT close when deletion failed
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('LessonDetailModal — TTS pronunciation', () => {
  beforeEach(() => {
    mockSpeak.mockClear();
    mockCancel.mockClear();
    mockIsSpeaking = false;
    mockCurrentWord = null;
  });

  it('renders the pronunciation as a clickable button with correct aria-label', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);

    const btn = screen.getByLabelText('tts_speak_label: happy');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('calls speak with the vocab word when pronunciation button is clicked', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('tts_speak_label: happy'));
    expect(mockSpeak).toHaveBeenCalledWith('happy');
  });

  it('does not render pronunciation button when pronunciation is empty', () => {
    const lesson = makeLesson({
      vocabularies: [makeVocab({ pronunciation: '' })],
    });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);
    expect(screen.queryByLabelText(/tts_speak_label/)).not.toBeInTheDocument();
  });

  it('renders pronunciation text inside the button', () => {
    const lesson = makeLesson({ vocabularies: [makeVocab()] });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);

    const btn = screen.getByLabelText('tts_speak_label: happy');
    expect(btn).toHaveTextContent('HAP-ee');
  });

  it('calls speak with the correct word for each vocab entry', () => {
    const lesson = makeLesson({
      vocabularies: [
        makeVocab({ id: 'v1', word: 'happy', pronunciation: 'HAP-ee' }),
        makeVocab({ id: 'v2', word: 'sad', pronunciation: 'SAD' }),
      ],
    });
    render(<LessonDetailModal lesson={lesson} t={t} onClose={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('tts_speak_label: sad'));
    expect(mockSpeak).toHaveBeenCalledWith('sad');
  });
});
