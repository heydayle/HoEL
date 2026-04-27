'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';
import type { AnswerStatus } from '@/modules/free-practice/core/models';

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
   * Tracks whether the user has tapped the input at least once.
   *
   * On iOS, the very first focus opens the keyboard and Safari scrolls the
   * page upward before the viewport height changes — `scrollTo(0,0)` can't
   * counter-scroll because the page hasn't grown yet. By skipping the
   * programmatic auto-focus on mount and letting the user tap the input
   * themselves, the sticky header + prompt stays visible. Once the keyboard
   * is already open (hasInteracted = true), subsequent programmatic focuses
   * are safe — Safari won't scroll again.
   */
  const hasInteractedRef = useRef(false);

  /**
   * Pins the page scroll to the top for the duration of the iOS keyboard
   * opening animation (~500ms).
   *
   * Fired on every `onFocus` event (including the user's first tap).
   * Also marks the input as "interacted" so the `useEffect` can safely
   * call `.focus()` on subsequent question transitions.
   */
  const pinScrollToTop = () => {
    hasInteractedRef.current = true;

    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    const pin = () => window.scrollTo(0, 0);
    window.addEventListener('scroll', pin, { passive: false });
    setTimeout(() => {
      window.removeEventListener('scroll', pin);
    }, 600);
  };

  /**
   * Re-focuses the input whenever the answer status transitions to a
   * typeable state (`idle` / `wrong`).
   *
   * Skipped on the initial mount (hasInteractedRef is false) to avoid
   * triggering iOS Safari's keyboard scroll on page load. After the user
   * taps the input once, all subsequent focuses are safe.
   */
  useEffect(() => {
    if (!isLocked && inputRef.current && hasInteractedRef.current) {
      inputRef.current.focus({ preventScroll: true });
      pinScrollToTop();
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
        onFocus={pinScrollToTop}
        disabled={isLocked}
        placeholder={t('input_placeholder')}
        autoComplete="off"
        className={cn(
          'w-full rounded-bento border-4 border-brutal-black bg-surface p-3 md:p-4',
          'text-center text-xl font-black text-foreground md:text-2xl lg:text-3xl',
          'shadow-brutal-sm outline-none',
          'transition-all duration-200',
          'placeholder:text-foreground-muted placeholder:font-normal placeholder:text-base md:placeholder:text-lg',
          'focus:shadow-brutal-md',
          isLocked && 'cursor-not-allowed opacity-60',
          answerStatus === 'correct' && 'border-green-500 dark:border-green-400',
          answerStatus === 'timeout' && 'border-terracotta',
        )}
      />
    </motion.div>
  );
}
