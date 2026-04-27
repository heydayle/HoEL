import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AnswerInput from './AnswerInput';

/**
 * Default props factory.
 */
const createProps = (overrides = {}) => ({
  value: '',
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  answerStatus: 'idle' as const,
  t: (key: string) => key,
  ...overrides,
});

describe('AnswerInput', () => {
  it('renders the input with the correct placeholder', () => {
    render(<AnswerInput {...createProps()} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toBeInTheDocument();
  });

  it('calls onChange when the user types', () => {
    const onChange = vi.fn();
    render(<AnswerInput {...createProps({ onChange })} />);

    fireEvent.change(screen.getByPlaceholderText('input_placeholder'), {
      target: { value: 'hello' },
    });

    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('calls onSubmit when Enter key is pressed', () => {
    const onSubmit = vi.fn();
    render(<AnswerInput {...createProps({ onSubmit })} />);

    fireEvent.keyDown(screen.getByPlaceholderText('input_placeholder'), {
      key: 'Enter',
    });

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not call onSubmit for non-Enter keys', () => {
    const onSubmit = vi.fn();
    render(<AnswerInput {...createProps({ onSubmit })} />);

    fireEvent.keyDown(screen.getByPlaceholderText('input_placeholder'), {
      key: 'a',
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input when answerStatus is "correct"', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'correct' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toBeDisabled();
  });

  it('disables input when answerStatus is "timeout"', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'timeout' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toBeDisabled();
  });

  it('does not disable input when answerStatus is "idle"', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'idle' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).not.toBeDisabled();
  });

  it('does not disable input when answerStatus is "wrong"', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'wrong' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).not.toBeDisabled();
  });

  it('displays the current value', () => {
    render(<AnswerInput {...createProps({ value: 'test' })} />);

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('auto-focuses the input on mount when status is idle', () => {
    render(<AnswerInput {...createProps()} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toHaveFocus();
  });

  it('auto-focuses the input when status is wrong', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'wrong' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toHaveFocus();
  });

  it('does not focus the input when status is correct', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'correct' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).not.toHaveFocus();
  });

  it('does not focus the input when status is timeout', () => {
    render(<AnswerInput {...createProps({ answerStatus: 'timeout' })} />);

    expect(screen.getByPlaceholderText('input_placeholder')).not.toHaveFocus();
  });
});
