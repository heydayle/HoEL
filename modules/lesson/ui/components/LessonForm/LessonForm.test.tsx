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

  it('always shows load_vocab_btn text on button regardless of loading state', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    const loadBtn = screen.getByText('load_vocab_btn');
    expect(loadBtn).toBeInTheDocument();
    // Button is intentionally NOT disabled to allow concurrent vocab generation
    expect(loadBtn).not.toBeDisabled();
  });

  it('does NOT disable the vocab input while isLoading is true', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    const input = screen.getByPlaceholderText('ex: happy');
    expect(input).not.toBeDisabled();
  });

  it('renders skeleton cards for vocabulary items with _loading: true', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        {
          id: 'v-loading-1',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'happy',
        },
        {
          id: 'v2',
          word: 'sad',
          ipa: '/sæd/',
          partOfSpeech: 'adjective',
          meaning: 'Feeling sorrow',
          translation: 'buồn',
          pronunciation: 'SAD',
          example: 'She is sad.',
        },
      ],
    });

    render(<LessonForm {...baseProps} />);

    // Skeleton card for the loading item
    expect(screen.getByTestId('vocab-card-skeleton')).toBeInTheDocument();
    expect(screen.getByText('vocab_loading_word: happy')).toBeInTheDocument();

    // Normal card for the non-loading item
    const wordInput = document.querySelector('input[name="vocab_0_word"]') as HTMLInputElement;
    expect(wordInput).toBeInTheDocument();
    expect(wordInput.defaultValue).toBe('sad');
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

  it('excludes _loading vocabulary items from the submitted data', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        {
          id: 'v-done',
          word: 'done',
          ipa: '',
          partOfSpeech: '',
          meaning: 'm',
          translation: 't',
          pronunciation: '',
          example: '',
        },
        {
          id: 'v-loading',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'pending',
        },
      ],
    });

    const onSubmitLesson = jest.fn();
    render(<LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />);

    // Fill required form fields
    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2026-01-01' } });

    fireEvent.submit(screen.getByText('Submit').closest('form')!);

    const submittedVocabs = onSubmitLesson.mock.calls[0][0].vocabularies;
    expect(submittedVocabs).toHaveLength(1);
    expect(submittedVocabs[0]).toEqual(
      expect.objectContaining({ word: 'done' }),
    );
  });
});

describe('LessonForm — empty state', () => {
  it('shows the no_vocabularies message when vocabularies list is empty', () => {
    render(<LessonForm {...baseProps} />);
    expect(screen.getByText('no_vocabularies')).toBeInTheDocument();
  });

  it('hides the no_vocabularies message when vocabularies exist', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: false,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        { id: 'v1', word: 'a', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
      ],
    });

    render(<LessonForm {...baseProps} />);
    expect(screen.queryByText('no_vocabularies')).not.toBeInTheDocument();
  });
});

describe('LessonForm — loading state UI indicators', () => {
  it('does not render a spinner icon on the load button even when isGenerating is true', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [],
    });

    render(<LessonForm {...baseProps} />);
    // Button always shows load_vocab_btn — skeleton cards provide loading feedback
    const loadBtn = screen.getByText('load_vocab_btn');
    const svgIcon = loadBtn.querySelector('.animate-spin');
    expect(svgIcon).not.toBeInTheDocument();
  });

  it('does not render a spinner icon on the load button when isGenerating is false', () => {
    render(<LessonForm {...baseProps} />);
    const loadBtn = screen.getByText('load_vocab_btn');
    const svgIcon = loadBtn.querySelector('.animate-spin');
    expect(svgIcon).not.toBeInTheDocument();
  });
});

describe('LessonForm — multiple skeletons', () => {
  it('renders multiple skeleton cards for multiple loading items', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        {
          id: 'v-load-1',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'happy',
        },
        {
          id: 'v-load-2',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'sad',
        },
      ],
    });

    render(<LessonForm {...baseProps} />);

    const skeletons = screen.getAllByTestId('vocab-card-skeleton');
    expect(skeletons).toHaveLength(2);
    expect(screen.getByText('vocab_loading_word: happy')).toBeInTheDocument();
    expect(screen.getByText('vocab_loading_word: sad')).toBeInTheDocument();
  });

  it('correctly indexes non-loading items when loading items are interspersed', () => {
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: '',
      setNewVocab: jest.fn(),
      setVocabularies: jest.fn(),
      vocabularies: [
        { id: 'v1', word: 'first', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
        {
          id: 'v-load',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'loading',
        },
        { id: 'v2', word: 'second', ipa: '', partOfSpeech: '', meaning: '', translation: '', pronunciation: '', example: '' },
      ],
    });

    render(<LessonForm {...baseProps} />);

    // first non-loading item → index 0
    const firstWordInput = document.querySelector('input[name="vocab_0_word"]') as HTMLInputElement;
    expect(firstWordInput).toBeInTheDocument();
    expect(firstWordInput.defaultValue).toBe('first');

    // second non-loading item → index 1 (skipping the loading item)
    const secondWordInput = document.querySelector('input[name="vocab_1_word"]') as HTMLInputElement;
    expect(secondWordInput).toBeInTheDocument();
    expect(secondWordInput.defaultValue).toBe('second');

    // Skeleton is also rendered
    expect(screen.getByTestId('vocab-card-skeleton')).toBeInTheDocument();
  });
});

describe('LessonForm — manual add during loading', () => {
  it('calls setVocabularies when add vocab button is clicked while loading', () => {
    const setVocabularies = jest.fn();
    (useGenerateVocab as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      newVocab: 'test',
      setNewVocab: jest.fn(),
      setVocabularies,
      vocabularies: [
        {
          id: 'v-load',
          word: '',
          ipa: '',
          partOfSpeech: '',
          meaning: '',
          translation: '',
          pronunciation: '',
          example: '',
          _loading: true,
          _loadingWord: 'loading',
        },
      ],
    });

    render(<LessonForm {...baseProps} />);
    fireEvent.click(screen.getByText('add_vocab_btn'));

    expect(setVocabularies).toHaveBeenCalledTimes(1);
    const newList = setVocabularies.mock.calls[0][0];
    // Should include the loading placeholder + the new manual entry
    expect(newList).toHaveLength(2);
    expect(newList[1].word).toBe('test');
    expect(newList[1]._loading).toBeUndefined();
  });
});

describe('LessonForm — isLoading spinner (page-level)', () => {
  it('renders the full-page Spinner instead of the form when isLoading prop is true', () => {
    render(<LessonForm {...baseProps} isLoading={true} />);

    // The form should not be rendered
    expect(screen.queryByLabelText('form_topic')).not.toBeInTheDocument();
  });
});

