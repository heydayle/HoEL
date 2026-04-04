import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LessonForm } from './LessonForm';
import type { ILesson } from '@/modules/lesson/core/models';

/** Mock useGenerateVocab so tests don't call the real API */
jest.mock('../../hooks/useGenerateVocab', () => ({
  useGenerateVocab: jest.fn().mockReturnValue({
    generate: jest.fn(),
    isLoading: false,
    newVocab: '',
    setNewVocab: jest.fn(),
    vocabularies: [],
    setVocabularies: jest.fn(),
  }),
}));

import { useGenerateVocab } from '../../hooks/useGenerateVocab';

/** Shared i18n stub */
const t = (key: string) => key;

/** Minimal base props */
const baseProps = {
  t,
  title: 'Test Title',
  description: 'Test Description',
  submitLabel: 'Submit',
  onSubmitLesson: jest.fn(),
  onCancel: jest.fn(),
};

/** Helper: build a full ILesson fixture */
const makeLesson = (overrides: Partial<ILesson> = {}): ILesson => ({
  id: 'lesson-1',
  topic: 'English Basics',
  participantName: 'Alice',
  date: '2026-03-01T09:00:00.000Z',
  notes: 'Some notes',
  priority: 'High',
  isPinned: false,
  isFavorite: true,
  vocabularies: [],
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();

  // Reset mock to default empty state before each test
  (useGenerateVocab as jest.Mock).mockReturnValue({
    generate: jest.fn(),
    isLoading: false,
    newVocab: '',
    setNewVocab: jest.fn(),
    vocabularies: [],
    setVocabularies: jest.fn(),
  });
});

describe('LessonForm — base fields', () => {
  it('renders all lesson-level fields', () => {
    render(<LessonForm {...baseProps} />);

    expect(screen.getByLabelText('form_topic')).toBeInTheDocument();
    expect(screen.getByLabelText('form_participant')).toBeInTheDocument();
    expect(screen.getByLabelText('form_date')).toBeInTheDocument();
    expect(screen.getByLabelText('form_notes')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders cancel and submit buttons', () => {
    render(<LessonForm {...baseProps} />);
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<LessonForm {...baseProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmitLesson when form is submitted with required fields filled', () => {
    const onSubmitLesson = jest.fn();
    render(<LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />);

    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'Topic' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2026-03-21' } });
    fireEvent.submit(screen.getByText('Submit').closest('form')!);

    expect(onSubmitLesson).toHaveBeenCalledTimes(1);
  });

  it('appends T09:00:00.000Z to bare date strings on submit', () => {
    const onSubmitLesson = jest.fn();
    render(<LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />);

    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2026-03-21' } });
    fireEvent.submit(screen.getByText('Submit').closest('form')!);

    expect(onSubmitLesson).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2026-03-21T09:00:00.000Z' }),
    );
  });
});

describe('LessonForm — editing mode', () => {
  it('pre-fills fields from initialLesson', () => {
    const lesson = makeLesson();
    render(<LessonForm {...baseProps} initialLesson={lesson} />);

    expect(screen.getByLabelText('form_topic')).toHaveValue('English Basics');
    expect(screen.getByLabelText('form_participant')).toHaveValue('Alice');
    expect(screen.getByLabelText('form_notes')).toHaveValue('Some notes');
  });

  it('preserves isPinned / isFavorite from initialLesson on submit', () => {
    const lesson = makeLesson({ isPinned: true, isFavorite: true });
    const onSubmitLesson = jest.fn();
    render(
      <LessonForm {...baseProps} initialLesson={lesson} onSubmitLesson={onSubmitLesson} />,
    );

    fireEvent.submit(screen.getByText('Submit').closest('form')!);

    expect(onSubmitLesson).toHaveBeenCalledWith(
      expect.objectContaining({ isPinned: true, isFavorite: true }),
    );
  });
});

describe('LessonForm — vocabulary section', () => {
  it('renders the AI vocab loader input and button', () => {
    render(<LessonForm {...baseProps} />);
    expect(screen.getByPlaceholderText('ex: happy')).toBeInTheDocument();
    expect(screen.getByText('load_vocab_btn')).toBeInTheDocument();
  });

  it('renders the load_vocab_description hint text', () => {
    render(<LessonForm {...baseProps} />);
    expect(screen.getByText('load_vocab_description')).toBeInTheDocument();
  });

  it('renders add vocab button', () => {
    render(<LessonForm {...baseProps} />);
    expect(screen.getByText('add_vocab_btn')).toBeInTheDocument();
  });

  it('shows vocab item fields when vocabularies exist', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: false,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        {
          id: 'v1',
          word: 'happy',
          ipa: '/ˈhæpi/',
          partOfSpeech: 'adjective',
          meaning: 'Feeling pleasure',
          translation: 'vui vẻ',
          pronunciation: 'HAP-ee',
          example: 'She is happy.',
        },
      ],
    });

    render(<LessonForm {...baseProps} />);

    // Word field with placeholder
    const wordInput = document.querySelector('input[name="vocab_0_word"]') as HTMLInputElement;
    expect(wordInput).toBeInTheDocument();
    expect(wordInput.placeholder).toBe('ex: happy');

    // IPA field
    const ipaInput = document.querySelector('input[name="vocab_0_ipa"]') as HTMLInputElement;
    expect(ipaInput?.placeholder).toBe('ex: /ˈhæpi/');

    // PoS field
    const posInput = document.querySelector(
      'input[name="vocab_0_partOfSpeech"]',
    ) as HTMLInputElement;
    expect(posInput?.placeholder).toBe('ex: adjective');

    // Meaning is now a Textarea
    const meaningTextarea = document.querySelector(
      'textarea[name="vocab_0_meaning"]',
    ) as HTMLTextAreaElement;
    expect(meaningTextarea).toBeInTheDocument();
    expect(meaningTextarea.placeholder).toBe(
      'ex: Feeling or showing pleasure or contentment.',
    );

    // Example is now a Textarea
    const exampleTextarea = document.querySelector(
      'textarea[name="vocab_0_example"]',
    ) as HTMLTextAreaElement;
    expect(exampleTextarea).toBeInTheDocument();
    expect(exampleTextarea.placeholder).toBe('ex: She was happy to see her friends.');
  });

  it('removes a vocab item when its remove button is clicked', () => {
    const setVocabularies = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: false,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies,
      vocabularies: [
        { id: 'v1', word: 'a', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
        { id: 'v2', word: 'b', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
      ],
    });

    render(<LessonForm {...baseProps} />);

    const removeBtns = screen.getAllByLabelText('remove_vocab_btn');
    expect(removeBtns).toHaveLength(2);
    fireEvent.click(removeBtns[0]);

    // setVocabularies should have been called (filtering out v1)
    expect(setVocabularies).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'v2' })]),
    );
    expect(setVocabularies.mock.calls[0][0]).toHaveLength(1);
  });

  it('calls generate when load vocab button is clicked with non-empty input', () => {
    const generate = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate,
      isLoading: false,
      newVocab: 'happy',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    fireEvent.click(screen.getByText('load_vocab_btn'));
    expect(generate).toHaveBeenCalledWith('happy');
  });

  it('does NOT call generate when load vocab is clicked with empty input', () => {
    const generate = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate,
      isLoading: false,
      newVocab: '   ',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    fireEvent.click(screen.getByText('load_vocab_btn'));
    expect(generate).not.toHaveBeenCalled();
  });

  it('calls generate on Enter key press in the new-vocab input', () => {
    const generate = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate,
      isLoading: false,
      newVocab: 'happy',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    const input = screen.getByPlaceholderText('ex: happy');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(generate).toHaveBeenCalledWith('happy');
  });

  it('does NOT submit the outer form on Enter in new-vocab input', () => {
    const onSubmitLesson = jest.fn();
    const generate = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate,
      isLoading: false,
      newVocab: 'happy',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />);
    const input = screen.getByPlaceholderText('ex: happy');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSubmitLesson).not.toHaveBeenCalled();
  });

  it('shows Loading... text and disables button while isLoading is true', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    const loadBtn = screen.getByText('Loading...');
    expect(loadBtn).toBeInTheDocument();
    expect(loadBtn).toBeDisabled();
  });
});

describe('LessonForm — submit with vocabularies', () => {
  it('submits vocabulary data read from Textarea fields', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: false,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        { id: 'v1', word: '', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
      ],
    });

    const onSubmitLesson = jest.fn();
    render(<LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />);

    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2026-01-01' } });

    // Fill word (required to include in submitted vocabs)
    const wordInput = document.querySelector('input[name="vocab_0_word"]')!;
    fireEvent.change(wordInput, { target: { value: 'happy' } });

    // Fill meaning via Textarea
    const meaningTextarea = document.querySelector('textarea[name="vocab_0_meaning"]')!;
    fireEvent.change(meaningTextarea, { target: { value: 'Feeling pleasure' } });

    // Fill example via Textarea
    const exampleTextarea = document.querySelector('textarea[name="vocab_0_example"]')!;
    fireEvent.change(exampleTextarea, { target: { value: 'She is happy.' } });

    fireEvent.submit(screen.getByText('Submit').closest('form')!);

    expect(onSubmitLesson).toHaveBeenCalledWith(
      expect.objectContaining({
        vocabularies: expect.arrayContaining([
          expect.objectContaining({
            word: 'happy',
            meaning: 'Feeling pleasure',
            example: 'She is happy.',
          }),
        ]),
      }),
    );
  });
});
