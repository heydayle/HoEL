'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { AnswerStatus, IQuizItem, ModalState } from '@/modules/free-practice/core/models';
import { GAME_CONFIG } from '@/modules/free-practice/core/models';
import { buildQuizQueue, evaluateAnswer } from '@/modules/free-practice/core/usecases';
import { getPublicVocabulariesForLesson, getVocabulariesForLesson } from '@/modules/free-practice/infras';
import enMessages from '@/modules/free-practice/messages/en.json';
import viMessages from '@/modules/free-practice/messages/vi.json';
import { useLocale, useTheme } from '@/shared/hooks';
import type { Locale, TranslationMessages } from '@/shared/types';

/**
 * Locale messages map for the free-practice module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Return type for the {@link useFreePractice} hook.
 */
export interface UseFreePracticeReturn {
  /** Whether vocabulary is being loaded from the server */
  isLoading: boolean;
  /** Error message if vocabulary fetch failed */
  fetchError: string | null;
  /** The full quiz queue */
  quizQueue: IQuizItem[];
  /** The currently active quiz item, or `null` when complete */
  currentItem: IQuizItem | null;
  /** Zero-based index of the current question */
  currentIndex: number;
  /** Seconds remaining for the current question */
  timeLeft: number;
  /** Total number of questions the user has attempted */
  totalAnswered: number;
  /** Number of correct answers */
  correctAnswers: number;
  /** Current text in the answer input */
  userInput: string;
  /** Drives animation feedback on the input/prompt */
  answerStatus: AnswerStatus;
  /** Which modal (if any) is currently displayed */
  modalState: ModalState;
  /** Whether the game has finished all questions */
  isGameComplete: boolean;
  /** Resolved theme for UI rendering */
  resolvedTheme: 'light' | 'dark';
  /** i18n translation function */
  t: (key: string) => string;
  /** Current locale */
  locale: Locale;
  /** Locale setter */
  setLocale: (locale: Locale) => void;
  /** Toggle dark/light theme */
  toggleTheme: () => void;
  /** Update the user's typed input */
  setUserInput: (value: string) => void;
  /** Submit the current answer (called on Enter) */
  handleSubmit: () => void;
  /** Open the confirm-exit modal */
  handleEndGame: () => void;
  /** Dismiss the confirm-exit modal and resume the timer */
  handleResume: () => void;
  /** Confirm exit and show the summary */
  handleConfirmExit: () => void;
  /** Reset all game state and replay the same quiz queue from the beginning */
  handleReplay: () => void;
}

/**
 * Central game hook for the Vocabulary Sprint free-practice game.
 *
 * Manages all client-side state including the quiz queue, countdown timer,
 * answer evaluation, animation status, and modal transitions.
 *
 * @param lessonId - UUID of the lesson to load vocabulary from
 * @param isPublic - When true, fetches vocabulary via the public (anon) API
 *                   endpoint so no auth token is needed
 * @returns The full game view-model
 */
export const useFreePractice = (
  lessonId: string,
  isPublic = false,
): UseFreePracticeReturn => {
  /** --- Theme & i18n --- */
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);

  /** --- Core game state --- */
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [quizQueue, setQuizQueue] = useState<IQuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.TIME_PER_QUESTION);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');
  const [modalState, setModalState] = useState<ModalState>('NONE');
  const [isGameComplete, setIsGameComplete] = useState(false);

  /** Timer interval ref — cleared on pause, unmount, or question change */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Reveal timeout ref — controls the 2-second correct/timeout answer display */
  const revealRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Whether the timer is currently paused (modal open) */
  const isPausedRef = useRef(false);
  /**
   * Stable ref to the latest `advanceToNext` so the setInterval closure
   * inside `startTimer` never captures a stale version.
   */
  const advanceToNextRef = useRef<() => void>(() => {});

  /** --- Cleanup helpers --- */

  /**
   * Clears the countdown interval.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Clears the reveal timeout.
   */
  const clearReveal = useCallback(() => {
    if (revealRef.current) {
      clearTimeout(revealRef.current);
      revealRef.current = null;
    }
  }, []);

  /** --- Timer logic --- */

  /** Tracks current timeLeft for the interval callback (avoids stale closures). */
  const timeLeftRef = useRef<number>(GAME_CONFIG.TIME_PER_QUESTION);

  /**
   * Starts (or restarts) the 1-second countdown interval.
   * Decrements `timeLeft` each tick. When it reaches 0, sets
   * `answerStatus` to `'timeout'`, increments `totalAnswered`,
   * and schedules an auto-advance after {@link GAME_CONFIG.REVEAL_DURATION}.
   */
  const startTimer = useCallback(() => {
    clearTimer();

    timerRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1;

      if (next <= 0) {
        clearTimer();
        timeLeftRef.current = 0;
        setTimeLeft(0);
        setAnswerStatus('timeout');
        setTotalAnswered((a) => a + 1);

        /** Auto-advance after showing the correct answer */
        revealRef.current = setTimeout(() => {
          advanceToNextRef.current();
        }, GAME_CONFIG.REVEAL_DURATION * 1000);

        return;
      }

      timeLeftRef.current = next;
      setTimeLeft(next);
    }, 1000);
  }, [clearTimer]);

  /** --- Vocabulary loading --- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const vocabs = isPublic
          ? await getPublicVocabulariesForLesson(lessonId)
          : await getVocabulariesForLesson(lessonId);
        const queue = buildQuizQueue(vocabs);

        if (!mounted) return;

        setQuizQueue(queue);

        if (queue.length === 0) {
          setFetchError(t('not_enough_vocab'));
        }
      } catch (err: unknown) {
        if (!mounted) return;

        const message = (err as Error).message || 'Failed to load vocabulary';
        setFetchError(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
    // t is excluded intentionally — only fetch on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  /** --- Start timer when quiz queue is ready or question changes --- */

  useEffect(() => {
    if (quizQueue.length === 0 || isGameComplete || modalState !== 'NONE') {
      return;
    }

    if (answerStatus === 'correct' || answerStatus === 'timeout') {
      return;
    }

    startTimer();

    return clearTimer;
  }, [quizQueue, currentIndex, isGameComplete, modalState, answerStatus, startTimer, clearTimer]);

  /** --- Cleanup on unmount --- */

  useEffect(() => {
    return () => {
      clearTimer();
      clearReveal();
    };
  }, [clearTimer, clearReveal]);

  /** --- Derived state --- */

  const currentItem = currentIndex < quizQueue.length ? quizQueue[currentIndex] : null;

  /** --- Advance to next question --- */

  /**
   * Advances to the next question after the reveal period.
   * If all questions are exhausted, marks the game as complete.
   */
  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quizQueue.length) {
      setIsGameComplete(true);
      setModalState('SUMMARY');
      return;
    }

    setCurrentIndex(nextIndex);
    timeLeftRef.current = GAME_CONFIG.TIME_PER_QUESTION;
    setTimeLeft(GAME_CONFIG.TIME_PER_QUESTION);
    setUserInput('');
    setAnswerStatus('idle');
  }, [currentIndex, quizQueue.length]);

  /** Keep the ref in sync so the timer closure is never stale */
  advanceToNextRef.current = advanceToNext;

  /** --- Handlers --- */

  /**
   * Evaluates the user's current input against the correct answer.
   * On correct: locks input, shows reveal for {@link GAME_CONFIG.REVEAL_DURATION},
   * then auto-advances. On wrong: triggers shake animation.
   */
  const handleSubmit = useCallback(() => {
    if (!currentItem || answerStatus === 'correct' || answerStatus === 'timeout') {
      return;
    }

    const isCorrect = evaluateAnswer(userInput, currentItem.word);

    if (isCorrect) {
      clearTimer();
      setAnswerStatus('correct');
      setCorrectAnswers((prev) => prev + 1);
      setTotalAnswered((prev) => prev + 1);

      revealRef.current = setTimeout(() => {
        advanceToNext();
      }, GAME_CONFIG.REVEAL_DURATION * 1000);
    } else {
      setAnswerStatus('wrong');

      /** Reset shake status after animation completes (~400ms) */
      setTimeout(() => {
        setAnswerStatus('idle');
      }, 400);
    }
  }, [currentItem, answerStatus, userInput, clearTimer, advanceToNext]);

  /**
   * Opens the confirm-exit modal and pauses the timer.
   */
  const handleEndGame = useCallback(() => {
    clearTimer();
    clearReveal();
    isPausedRef.current = true;
    setModalState('CONFIRM_EXIT');
  }, [clearTimer, clearReveal]);

  /**
   * Dismisses the confirm-exit modal and resumes the timer.
   */
  const handleResume = useCallback(() => {
    isPausedRef.current = false;
    setModalState('NONE');
    /** Timer restart is handled by the useEffect watching modalState */
  }, []);

  /**
   * Confirms exit: stops timer and shows the summary modal.
   */
  const handleConfirmExit = useCallback(() => {
    clearTimer();
    clearReveal();
    setModalState('SUMMARY');
  }, [clearTimer, clearReveal]);

  /**
   * Resets all game state and replays the same quiz queue from the beginning.
   * Clears timers, resets index, scores, input, and closes the summary modal.
   */
  const handleReplay = useCallback(() => {
    clearTimer();
    clearReveal();
    timeLeftRef.current = GAME_CONFIG.TIME_PER_QUESTION;
    setCurrentIndex(0);
    setTimeLeft(GAME_CONFIG.TIME_PER_QUESTION);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    setUserInput('');
    setAnswerStatus('idle');
    setIsGameComplete(false);
    setModalState('NONE');
  }, [clearTimer, clearReveal]);

  /**
   * Toggles light/dark mode with system-mode awareness.
   */
  const toggleTheme = useCallback(() => {
    if (mode === 'system') {
      setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
      return;
    }

    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, resolvedTheme, setThemeMode]);

  return {
    isLoading,
    fetchError,
    quizQueue,
    currentItem,
    currentIndex,
    timeLeft,
    totalAnswered,
    correctAnswers,
    userInput,
    answerStatus,
    modalState,
    isGameComplete,
    resolvedTheme,
    t,
    locale,
    setLocale,
    toggleTheme,
    setUserInput,
    handleSubmit,
    handleEndGame,
    handleResume,
    handleConfirmExit,
    handleReplay,
  };
};
