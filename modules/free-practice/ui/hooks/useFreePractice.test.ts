import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { GAME_CONFIG } from '@/modules/free-practice/core/models';

import { useFreePractice } from './useFreePractice';

/** --- Mocks --- */

vi.mock('@/modules/free-practice/infras', () => ({
  getVocabulariesForLesson: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({
  useTheme: vi.fn(() => ({
    mode: 'light',
    resolvedTheme: 'light',
    setThemeMode: vi.fn(),
  })),
  useLocale: vi.fn(() => ({
    locale: 'en',
    setLocale: vi.fn(),
    t: (key: string) => key,
  })),
}));

import { getVocabulariesForLesson } from '@/modules/free-practice/infras';

/**
 * Factory producing a valid IVocabulary stub.
 */
const createVocab = (id: string, word: string) => ({
  id,
  word,
  ipa: '/test/',
  partOfSpeech: 'noun',
  meaning: `${word} meaning`,
  translation: `${word} translation`,
  pronunciation: word,
  example: `I have a ${word}.`,
});

/**
 * Default set of 4 vocabulary items (above the 3-word minimum).
 */
const MOCK_VOCABS = [
  createVocab('v-1', 'apple'),
  createVocab('v-2', 'banana'),
  createVocab('v-3', 'cherry'),
  createVocab('v-4', 'date'),
];

describe('useFreePractice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (getVocabulariesForLesson as Mock).mockResolvedValue(MOCK_VOCABS);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.quizQueue).toEqual([]);
  });

  it('loads vocabulary and builds a quiz queue', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.quizQueue.length).toBe(4);
    expect(result.current.currentItem).not.toBeNull();
  });

  it('sets fetchError when vocabulary count is below minimum', async () => {
    (getVocabulariesForLesson as Mock).mockResolvedValue([
      createVocab('v-1', 'apple'),
    ]);

    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.fetchError).toBe('not_enough_vocab');
    expect(result.current.quizQueue).toEqual([]);
  });

  it('sets fetchError on API failure', async () => {
    (getVocabulariesForLesson as Mock).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.fetchError).toBe('Network error');
  });

  it('decrements timeLeft each second', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.timeLeft).toBe(GAME_CONFIG.TIME_PER_QUESTION);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(GAME_CONFIG.TIME_PER_QUESTION - 3);
  });

  it('sets answerStatus to "timeout" when timer reaches 0 and auto-advances', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      vi.advanceTimersByTime(GAME_CONFIG.TIME_PER_QUESTION * 1000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.answerStatus).toBe('timeout');
    expect(result.current.totalAnswered).toBe(1);

    const indexBefore = result.current.currentIndex;

    /** After the reveal duration, should auto-advance to the next word */
    act(() => {
      vi.advanceTimersByTime(GAME_CONFIG.REVEAL_DURATION * 1000);
    });

    expect(result.current.currentIndex).toBe(indexBefore + 1);
    expect(result.current.answerStatus).toBe('idle');
    expect(result.current.timeLeft).toBe(GAME_CONFIG.TIME_PER_QUESTION);
  });

  it('marks correct answer and advances after reveal duration', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const correctWord = result.current.currentItem!.word;

    act(() => {
      result.current.setUserInput(correctWord);
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.answerStatus).toBe('correct');
    expect(result.current.correctAnswers).toBe(1);
    expect(result.current.totalAnswered).toBe(1);

    const indexBefore = result.current.currentIndex;

    act(() => {
      vi.advanceTimersByTime(GAME_CONFIG.REVEAL_DURATION * 1000);
    });

    expect(result.current.currentIndex).toBe(indexBefore + 1);
    expect(result.current.answerStatus).toBe('idle');
  });

  it('triggers wrong answer shake and resets to idle', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.setUserInput('totally_wrong');
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.answerStatus).toBe('wrong');

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.answerStatus).toBe('idle');
    // Should NOT advance
    expect(result.current.currentIndex).toBe(0);
  });

  it('does not submit when answer is empty', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.setUserInput('');
    });

    act(() => {
      result.current.handleSubmit();
    });

    // 'wrong' status triggered (empty != correct word)
    expect(result.current.answerStatus).toBe('wrong');
  });

  describe('modal state transitions', () => {
    it('opens CONFIRM_EXIT modal on handleEndGame', async () => {
      const { result } = renderHook(() => useFreePractice('lesson-1'));

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      act(() => {
        result.current.handleEndGame();
      });

      expect(result.current.modalState).toBe('CONFIRM_EXIT');
    });

    it('resumes game on handleResume', async () => {
      const { result } = renderHook(() => useFreePractice('lesson-1'));

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      act(() => {
        result.current.handleEndGame();
      });

      act(() => {
        result.current.handleResume();
      });

      expect(result.current.modalState).toBe('NONE');
    });

    it('shows SUMMARY modal on handleConfirmExit', async () => {
      const { result } = renderHook(() => useFreePractice('lesson-1'));

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      act(() => {
        result.current.handleEndGame();
      });

      act(() => {
        result.current.handleConfirmExit();
      });

      expect(result.current.modalState).toBe('SUMMARY');
    });
  });

  it('case-insensitive answer evaluation', async () => {
    const { result } = renderHook(() => useFreePractice('lesson-1'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const correctWord = result.current.currentItem!.word;

    act(() => {
      result.current.setUserInput(correctWord.toUpperCase());
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.answerStatus).toBe('correct');
  });
});
