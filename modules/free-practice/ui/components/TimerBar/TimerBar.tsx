'use client';

import { GAME_CONFIG } from '@/modules/free-practice/core/models';
import { cn } from '@/lib/utils';

/**
 * Props for the TimerBar component.
 */
interface ITimerBarProps {
  /** Seconds remaining for the current question */
  timeLeft: number;
}

/**
 * Thick horizontal progress bar representing the countdown timer.
 *
 * The inner fill shrinks from right to left as time elapses.
 * When `timeLeft` drops to {@link GAME_CONFIG.CRITICAL_TIME_THRESHOLD}
 * or below, the fill turns terracotta and pulses.
 *
 * @param props - Timer bar configuration
 * @returns The rendered timer bar element
 */
export default function TimerBar({ timeLeft }: ITimerBarProps): React.JSX.Element {
  const percentage = (timeLeft / GAME_CONFIG.TIME_PER_QUESTION) * 100;
  const isCritical = timeLeft <= GAME_CONFIG.CRITICAL_TIME_THRESHOLD && timeLeft > 0;

  return (
    <div
      id="timer-bar"
      className={cn(
        'h-2 w-full overflow-hidden',
        'rounded-full border border-brutal-black/30 bg-surface',
      )}
      role="progressbar"
      aria-valuenow={timeLeft}
      aria-valuemin={0}
      aria-valuemax={GAME_CONFIG.TIME_PER_QUESTION}
      aria-label={`${timeLeft} seconds remaining`}
    >
      <div
        data-testid="timer-fill"
        className={cn(
          'h-full rounded-full transition-all duration-1000 ease-linear',
          isCritical
            ? 'animate-pulse bg-terracotta'
            : 'bg-accent-primary',
          timeLeft === 0 && 'w-0',
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
