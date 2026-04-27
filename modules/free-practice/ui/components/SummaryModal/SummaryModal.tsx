'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Award, CheckCircle, Target } from 'lucide-react';

import type { MemoryLevel } from '@/modules/free-practice/core/models';
import { getMemoryLevel } from '@/modules/free-practice/core/usecases';
import { cn } from '@/lib/utils';

/**
 * Props for the SummaryModal component.
 */
interface ISummaryModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** i18n translation function */
  t: (key: string) => string;
  /** Total number of questions the user attempted */
  totalAnswered: number;
  /** Number of correct answers */
  correctAnswers: number;
  /** Callback when the user clicks "Return to Dashboard" */
  onReturnDashboard: () => void;
  /** Callback when the user clicks "Play Again" to replay the same queue */
  onReplay: () => void;
}

/**
 * Maps a memory level to its i18n key.
 */
const MEMORY_LEVEL_KEYS: Record<MemoryLevel, string> = {
  needs_review: 'memory_needs_review',
  good_grasp: 'memory_good_grasp',
  excellent: 'memory_excellent',
};

/**
 * Maps a memory level to a Tailwind text colour class.
 */
const MEMORY_LEVEL_COLOURS: Record<MemoryLevel, string> = {
  needs_review: 'text-terracotta',
  good_grasp: 'text-accent-primary',
  excellent: 'text-green-600 dark:text-green-400',
};

/**
 * Neo-Brutalist summary modal displayed after the game session ends.
 *
 * Shows total questions answered, correct count, and a calculated
 * "Memory Level" classification. Animates with spring scale transition.
 *
 * @param props - Summary modal configuration
 * @returns The rendered summary modal (or nothing if closed)
 */
export default function SummaryModal({
  isOpen,
  t,
  totalAnswered,
  correctAnswers,
  onReturnDashboard,
  onReplay,
}: ISummaryModalProps): React.JSX.Element {
  const memoryLevel = getMemoryLevel(correctAnswers, totalAnswered);
  const percentage = totalAnswered > 0
    ? Math.round((correctAnswers / totalAnswered) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="summary-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <motion.div
            id="summary-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              'mx-4 flex w-full max-w-md flex-col items-center gap-6',
              'rounded-bento border-4 border-brutal-black bg-cream p-8',
              'shadow-brutal-lg',
            )}
          >
            {/* Title */}
            <h2 className="text-2xl font-black text-foreground">
              {t('summary_title')}
            </h2>

            {/* Stats grid */}
            <div className="flex w-full flex-col gap-4">
              {/* Total answered */}
              <div
                className={cn(
                  'flex items-center gap-4 rounded-[var(--radius-md)]',
                  'border-2 border-brutal-black bg-surface p-4',
                  'shadow-brutal-sm',
                )}
              >
                <Target size={24} className="text-accent-primary" />
                <div className="flex flex-1 flex-col">
                  <span className="text-xs font-bold text-foreground-muted">
                    {t('total_answered_label')}
                  </span>
                  <span className="text-2xl font-black text-foreground" data-testid="total-answered">
                    {totalAnswered}
                  </span>
                </div>
              </div>

              {/* Correct answers */}
              <div
                className={cn(
                  'flex items-center gap-4 rounded-[var(--radius-md)]',
                  'border-2 border-brutal-black bg-surface p-4',
                  'shadow-brutal-sm',
                )}
              >
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                <div className="flex flex-1 flex-col">
                  <span className="text-xs font-bold text-foreground-muted">
                    {t('total_correct_label')}
                  </span>
                  <span className="text-2xl font-black text-foreground" data-testid="total-correct">
                    {correctAnswers}
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground-muted" data-testid="percentage">
                  {percentage}%
                </span>
              </div>

              {/* Memory level */}
              <div
                className={cn(
                  'flex items-center gap-4 rounded-[var(--radius-md)]',
                  'border-2 border-brutal-black bg-surface p-4',
                  'shadow-brutal-sm',
                )}
              >
                <Award size={24} className={MEMORY_LEVEL_COLOURS[memoryLevel]} />
                <div className="flex flex-1 flex-col">
                  <span className="text-xs font-bold text-foreground-muted">
                    {t('memory_level_label')}
                  </span>
                  <span
                    className={cn(
                      'text-xl font-black',
                      MEMORY_LEVEL_COLOURS[memoryLevel],
                    )}
                    data-testid="memory-level"
                  >
                    {t(MEMORY_LEVEL_KEYS[memoryLevel])}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-3">
              {/* Play Again */}
              <button
                id="summary-replay-btn"
                onClick={onReplay}
                className={cn(
                  'w-full rounded-[var(--radius-md)] border-2 border-brutal-black px-4 py-3',
                  'bg-accent-primary text-sm font-black text-white',
                  'shadow-brutal-sm transition-all duration-200',
                  'hover:opacity-90 hover:shadow-brutal-md',
                  'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                )}
              >
                {t('replay_btn')}
              </button>

              {/* Return to Dashboard */}
              <button
                id="summary-return-btn"
                onClick={onReturnDashboard}
                className={cn(
                  'w-full rounded-[var(--radius-md)] border-2 border-brutal-black px-4 py-3',
                  'bg-lemon text-sm font-black text-brutal-black',
                  'shadow-brutal-sm transition-all duration-200',
                  'hover:bg-lemon-hover hover:shadow-brutal-md',
                  'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                )}
              >
                {t('return_dashboard_btn')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
