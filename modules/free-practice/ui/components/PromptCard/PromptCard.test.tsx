import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { IQuizItem } from '@/modules/free-practice/core/models';

import PromptCard from './PromptCard';

/**
 * Factory producing a valid IQuizItem stub.
 */
const createItem = (overrides: Partial<IQuizItem> = {}): IQuizItem => ({
  vocabId: 'v-1',
  word: 'apple',
  ipa: '/ˈæp.əl/',
  partOfSpeech: 'noun',
  meaning: 'quả táo',
  translation: 'táo',
  example: 'I ate an apple today.',
  promptType: 'meaning',
  ...overrides,
});

/**
 * Default props factory.
 */
const createProps = (overrides = {}) => ({
  currentItem: createItem(),
  answerStatus: 'idle' as const,
  t: (key: string) => key,
  currentIndex: 0,
  totalQuestions: 5,
  correctAnswers: 0,
  ...overrides,
});

describe('PromptCard', () => {
  it('renders the meaning text in meaning mode', () => {
    render(<PromptCard {...createProps()} />);

    expect(screen.getByText('quả táo')).toBeInTheDocument();
  });

  it('renders the example sentence with a blank in example mode', () => {
    render(
      <PromptCard
        {...createProps({
          currentItem: createItem({ promptType: 'example' }),
        })}
      />,
    );

    // "apple" should be replaced with a blank line, sentence segments visible
    expect(screen.getByText(/I ate an/)).toBeInTheDocument();
    expect(screen.getByText(/today\./)).toBeInTheDocument();
  });

  it('shows meaning prompt label in meaning mode', () => {
    render(<PromptCard {...createProps()} />);

    expect(screen.getByTestId('prompt-label')).toHaveTextContent('meaning_prompt_label');
  });

  it('shows example prompt label in example mode', () => {
    render(
      <PromptCard
        {...createProps({
          currentItem: createItem({ promptType: 'example' }),
        })}
      />,
    );

    expect(screen.getByTestId('prompt-label')).toHaveTextContent('example_prompt_label');
  });

  it('displays question progress', () => {
    render(<PromptCard {...createProps({ currentIndex: 2, totalQuestions: 10 })} />);

    expect(screen.getByText(/3\/10/)).toBeInTheDocument();
  });

  it('displays the score', () => {
    render(<PromptCard {...createProps({ correctAnswers: 5 })} />);

    expect(screen.getByText(/score_label: 5/)).toBeInTheDocument();
  });

  it('reveals the word when answerStatus is correct', () => {
    render(<PromptCard {...createProps({ answerStatus: 'correct' })} />);

    expect(screen.getByTestId('revealed-word')).toHaveTextContent('apple');
  });

  it('shows timeout label when status is timeout', () => {
    render(<PromptCard {...createProps({ answerStatus: 'timeout' })} />);

    expect(screen.getByText('timeout_label')).toBeInTheDocument();
  });

  it('shows correct label when status is correct', () => {
    render(<PromptCard {...createProps({ answerStatus: 'correct' })} />);

    expect(screen.getByText('correct_label')).toBeInTheDocument();
  });

  describe('vocabulary hints', () => {
    it('shows IPA and part of speech in the hint area', () => {
      render(<PromptCard {...createProps()} />);

      const hints = screen.getByTestId('vocab-hints');

      expect(within(hints).getByText('/ˈæp.əl/')).toBeInTheDocument();
      expect(within(hints).getByText('noun')).toBeInTheDocument();
    });

    it('shows translation in meaning mode (not meaning again)', () => {
      render(<PromptCard {...createProps()} />);

      const hints = screen.getByTestId('vocab-hints');

      expect(within(hints).getByText('táo')).toBeInTheDocument();
      // meaning is the main prompt, should NOT appear in hints
      expect(within(hints).queryByText('quả táo')).not.toBeInTheDocument();
    });

    it('shows meaning in example mode (not translation)', () => {
      render(
        <PromptCard
          {...createProps({
            currentItem: createItem({ promptType: 'example' }),
          })}
        />,
      );

      const hints = screen.getByTestId('vocab-hints');

      expect(within(hints).getByText('quả táo')).toBeInTheDocument();
    });

    it('hides IPA when empty', () => {
      render(
        <PromptCard
          {...createProps({
            currentItem: createItem({ ipa: '' }),
          })}
        />,
      );

      const hints = screen.getByTestId('vocab-hints');

      expect(within(hints).queryByText('/ˈæp.əl/')).not.toBeInTheDocument();
    });

    it('hides part of speech when empty', () => {
      render(
        <PromptCard
          {...createProps({
            currentItem: createItem({ partOfSpeech: '' }),
          })}
        />,
      );

      const hints = screen.getByTestId('vocab-hints');

      expect(within(hints).queryByText('noun')).not.toBeInTheDocument();
    });
  });
});
