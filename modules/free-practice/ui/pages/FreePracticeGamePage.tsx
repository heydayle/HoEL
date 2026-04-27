'use client';

import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useFreePractice } from '@/modules/free-practice/ui/hooks';
import {
  AnswerInput,
  ConfirmExitModal,
  GameHeader,
  PromptCard,
  SummaryModal,
  TimerBar,
} from '@/modules/free-practice/ui/components';

/**
 * Props for the FreePracticeGamePage component.
 */
interface IFreePracticeGamePageProps {
  /** UUID of the lesson whose vocabulary powers this game session */
  lessonId: string;
  /**
   * When true the page uses the public (anon) data fetcher and the back
   * button returns to the public share page instead of /lessons.
   */
  isPublic?: boolean;
}

/**
 * Composite smart component for the Vocabulary Sprint free-practice game.
 *
 * Orchestrates all game sub-components, handles loading/empty states,
 * and manages the full-height game layout following the Bento
 * Neo-Brutalism design system.
 *
 * ## iOS keyboard layout
 *
 * On iOS Safari, focusing an input scrolls the entire page upward so the
 * input appears above the software keyboard. This pushes the header and
 * question off the top of the screen.
 *
 * The fix: the header + prompt + timer live inside a **`sticky top-0`**
 * container. When Safari scrolls the page, the sticky block pins itself
 * to the top of the visible area so the question is always readable.
 * The input sits at the natural document bottom — Safari scrolls to it
 * automatically.
 *
 * @param props - Page configuration including the target lesson ID
 * @returns The rendered game page
 */
export default function FreePracticeGamePage({
  lessonId,
  isPublic = false,
}: IFreePracticeGamePageProps): React.JSX.Element {
  const router = useRouter();

  const {
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
    resolvedTheme,
    t,
    toggleTheme,
    setUserInput,
    handleSubmit,
    handleEndGame,
    handleResume,
    handleConfirmExit,
    handleReplay,
  } = useFreePractice(lessonId, isPublic);

  /**
   * Navigates back — to the public share page when public, otherwise /lessons.
   */
  const handleBack = () => {
    router.push(isPublic ? `/s/${lessonId}` : '/lessons');
  };

  /** --- Loading state --- */
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 size={48} className="text-accent-primary" />
        </motion.div>
        <p className="text-lg font-bold text-foreground-muted">{t('loading_vocab')}</p>
      </div>
    );
  }

  /** --- Empty / error state --- */
  if (fetchError || quizQueue.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
        <div
          className={cn(
            'flex flex-col items-center gap-4 rounded-bento border-2 border-brutal-black',
            'bg-surface p-8 shadow-brutal-md',
            'max-w-md text-center',
          )}
        >
          <Zap size={48} className="text-terracotta" />
          <p className="text-lg font-bold text-foreground">
            {fetchError || t('not_enough_vocab')}
          </p>
          <button
            id="empty-state-back-btn"
            onClick={handleBack}
            className={cn(
              'rounded-[var(--radius-md)] border-2 border-brutal-black px-6 py-3',
              'bg-lemon text-sm font-black text-brutal-black',
              'shadow-brutal-sm transition-all duration-200',
              'hover:bg-lemon-hover hover:shadow-brutal-md',
              'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            )}
          >
            {t('back_btn')}
          </button>
        </div>
      </div>
    );
  }

  /**
   * Focuses the answer input when the user performs a plain single
   * left-click anywhere on the game page.
   *
   * Ignored for: right-click, middle-click, modifier keys (Ctrl/Cmd/Shift),
   * and text-selection drags.
   */
  const handlePageTap = (e: React.MouseEvent) => {
    /** Only primary (left) button, no modifiers */
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;

    /** Ignore if the user is selecting text */
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    const input = document.getElementById('answer-input') as HTMLInputElement | null;
    if (input && !input.disabled) {
      input.focus();
    }
  };

  /** --- Main game layout --- */
  return (
    <div
      className="flex flex-col bg-background"
      onClick={handlePageTap}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4">
        {/*
         * Sticky block: header + prompt + timer.
         *
         * On iOS Safari the keyboard pushes the page upward. This sticky
         * container pins itself to the top of the visible area so the
         * question is always readable while the user types.
         */}
        <div className="sticky top-0 z-10 flex flex-col gap-3 bg-background pt-3 pb-2">
          {/* Header */}
          <GameHeader
            t={t}
            resolvedTheme={resolvedTheme}
            onToggleTheme={toggleTheme}
            onEndGame={handleEndGame}
            onBack={handleBack}
          />

          {/* Prompt */}
          {currentItem && (
            <PromptCard
              currentItem={currentItem}
              answerStatus={answerStatus}
              t={t}
              currentIndex={currentIndex}
              totalQuestions={quizQueue.length}
              correctAnswers={correctAnswers}
            />
          )}

          {/* Timer */}
          <TimerBar timeLeft={timeLeft} />

          {/* Input — directly below the progress bar */}
          <AnswerInput
            value={userInput}
            onChange={setUserInput}
            onSubmit={handleSubmit}
            answerStatus={answerStatus}
            t={t}
          />
        </div>
      </div>

      {/* Modals */}
      <ConfirmExitModal
        isOpen={modalState === 'CONFIRM_EXIT'}
        t={t}
        onResume={handleResume}
        onConfirm={handleConfirmExit}
      />

      <SummaryModal
        isOpen={modalState === 'SUMMARY'}
        t={t}
        totalAnswered={totalAnswered}
        correctAnswers={correctAnswers}
        onReplay={handleReplay}
        onReturnDashboard={handleBack}
      />
    </div>
  );
}
