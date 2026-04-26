import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateLessonModal } from './CreateLessonModal';

describe('CreateLessonModal', () => {
  const mockOnAddLesson = vi.fn();
  const mockT = (key: string) => key;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button', () => {
    render(<CreateLessonModal t={mockT} onAddLesson={mockOnAddLesson} />);
    expect(screen.getByText('create_lesson_title')).toBeInTheDocument();
  });

  it('opens modal on trigger click and submits form', () => {
    render(<CreateLessonModal t={mockT} onAddLesson={mockOnAddLesson} />);

    // Open modal
    fireEvent.click(screen.getByText('create_lesson_title'));
    
    expect(screen.getByText('create_lesson_desc')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'New Topic' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('form_notes'), { target: { value: 'Some notes' } });

    // Submit form
    fireEvent.click(screen.getByText('create_lesson_submit'));

    expect(mockOnAddLesson).toHaveBeenCalledTimes(1);
    const addedLesson = mockOnAddLesson.mock.calls[0][0];
    expect(addedLesson.topic).toBe('New Topic');
    expect(addedLesson.participantName).toBe('John Doe');
    expect(addedLesson.date).toBe('2023-01-01T09:00:00.000Z');
    expect(addedLesson.notes).toBe('Some notes');
    expect(addedLesson.priority).toBe('Medium'); // default
    expect(addedLesson.vocabularies).toEqual([]);
  });

  it('can add and remove vocabularies', () => {
    render(<CreateLessonModal t={mockT} onAddLesson={mockOnAddLesson} />);

    // Open modal
    fireEvent.click(screen.getByText('create_lesson_title'));
    
    // Add two vocabularies
    fireEvent.click(screen.getByText('add_vocab_btn'));
    fireEvent.click(screen.getByText('add_vocab_btn'));

    // Fill form basics
    fireEvent.change(screen.getByLabelText('form_topic'), { target: { value: 'Vocab Lesson' } });
    fireEvent.change(screen.getByLabelText('form_participant'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('form_date'), { target: { value: '2023-01-01' } });

    // Fill first vocab
    const vocabWordInputs = document.querySelectorAll('input[name$="_word"]');
    expect(vocabWordInputs.length).toBe(2);
    fireEvent.change(vocabWordInputs[0], { target: { value: 'apple' } });
    
    const vocabMeaningInputs = document.querySelectorAll('input[name$="_meaning"]');
    fireEvent.change(vocabMeaningInputs[0], { target: { value: 'a fruit' } });

    const vocabTranslationInputs = document.querySelectorAll('input[name$="_translation"]');
    fireEvent.change(vocabTranslationInputs[0], { target: { value: 'quả táo' } });

    // Remove the second vocab
    const removeBtns = screen.getAllByLabelText('remove_vocab_btn');
    expect(removeBtns.length).toBe(2);
    fireEvent.click(removeBtns[1]);

    // Submit form
    fireEvent.click(screen.getByText('create_lesson_submit'));

    expect(mockOnAddLesson).toHaveBeenCalledTimes(1);
    const addedLesson = mockOnAddLesson.mock.calls[0][0];
    
    // We expect 1 vocab entry
    expect(addedLesson.vocabularies.length).toBe(1);
    expect(addedLesson.vocabularies[0].word).toBe('apple');
    expect(addedLesson.vocabularies[0].meaning).toBe('a fruit');
  });

  it('closes modal on cancel', () => {
    render(<CreateLessonModal t={mockT} onAddLesson={mockOnAddLesson} />);

    // Open modal
    fireEvent.click(screen.getByText('create_lesson_title'));
    
    expect(screen.getByText('cancel')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('cancel'));

    // Should not call addLesson
    expect(mockOnAddLesson).not.toHaveBeenCalled();
  });
});
