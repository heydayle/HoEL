'use client';

import { motion } from 'framer-motion';
import { type KeyboardEvent, useEffect, useRef } from 'react';

import type { AnswerStatus } from '@/modules/free-practice/core/models';
import { cn } from '@/lib/utils';

/**
 * Props for the AnswerInput component.
 */
interface IAnswerInputProps {
  /** Current value of the input field */
  value: string;
  /** Callback when the input value changes */
  onChange: (value: string) => void;
  /** Callback to submit the answer (triggered on Enter) */
  onSubmit: () => void;
  /** Current answer status driving animation */
  answerStatus: AnswerStatus;
  /** i18n translation function */
  t: (key: string) => string;
}

/**
 * Shake animation keyframes for wrong answer feedback.
 * Horizontal displacement: [-10, 10, -10, 10, 0] px.
 */
const SHAKE_ANIMATION = {
  x: [-10, 10, -10, 10, 0],
};

/**
 * Tween transition used for the shake animation.
 * Spring does NOT support more than 2 keyframes in Framer Motion,
 * so we use a fast tween to drive the multi-keyframe shake sequence.
 */
const SHAKE_TRANSITION = {
  type: 'tween' as const,
  duration: 0.4,
  ease: 'easeInOut' as const,
};

/**
 * Massive centered input field for typing answers.
 *
 * Submits on `Enter` key. On wrong answer, triggers a horizontal shake
 * via Framer Motion spring physics. Input is locked (disabled) when the
 * answer is correct or when the timer has run out.
 *
 * The input is always focused when the player can type (`idle` or `wrong`
 * status) so they never need to click before typing.
 *
 * @param props - Input configuration
 * @returns The rendered answer input element
 */
export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  answerStatus,
  t,
}: IAnswerInputProps): React.JSX.Element {
  const isLocked = answerStatus === 'correct' || answerStatus === 'timeout';
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Re-focuses the input whenever the answer status transitions to
   * a typeable state (`idle` / `wrong`). This covers:
   * - Initial mount
   * - After a wrong-answer shake resets to `idle`
   * - After advancing to a new question (status resets to `idle`)
   */
  useEffect(() => {
    if (!isLocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [answerStatus, isLocked]);

  /**
   * Handles keydown events on the input.
   * Submits the answer when the Enter key is pressed.
   *
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      animate={answerStatus === 'wrong' ? SHAKE_ANIMATION : { x: 0 }}
      transition={SHAKE_TRANSITION}
      className="w-full"
    >
      <input
        ref={inputRef}
        id="answer-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLocked}
        placeholder={t('input_placeholder')}
        autoComplete="off"
        className={cn(
          'w-full rounded-bento border-4 border-brutal-black bg-surface p-4',
          'text-center text-2xl font-black text-foreground md:text-3xl',
          'shadow-brutal-sm outline-none',
          'transition-all duration-200',
          'placeholder:text-foreground-muted placeholder:font-normal placeholder:text-lg',
          'focus:shadow-brutal-md',
          isLocked && 'cursor-not-allowed opacity-60',
          answerStatus === 'correct' && 'border-green-500 dark:border-green-400',
          answerStatus === 'timeout' && 'border-terracotta',
        )}
      />
    </motion.div>
  );
}
