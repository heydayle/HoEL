'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

/**
 * Props for the ConfirmExitModal component.
 */
interface IConfirmExitModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** i18n translation function */
  t: (key: string) => string;
  /** Callback when the user chooses to resume the game */
  onResume: () => void;
  /** Callback when the user confirms exit */
  onConfirm: () => void;
}

/**
 * Neo-Brutalist confirmation modal shown when the player clicks "End Game".
 *
 * Animates in with a scale transition (0.9 → 1) + fade, and renders a
 * backdrop with `backdrop-blur-sm`. Contains "Resume" and "Confirm" actions.
 *
 * @param props - Modal configuration
 * @returns The rendered confirm exit modal (or nothing if closed)
 */
export default function ConfirmExitModal({
  isOpen,
  t,
  onResume,
  onConfirm,
}: IConfirmExitModalProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="confirm-exit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <motion.div
            id="confirm-exit-modal"
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
            <p className="text-center text-lg font-bold text-foreground">
              {t('confirm_exit_text')}
            </p>

            <div className="flex w-full gap-3">
              {/* Resume (Cancel) */}
              <button
                id="confirm-exit-resume-btn"
                onClick={onResume}
                className={cn(
                  'flex-1 rounded-[var(--radius-md)] border-2 border-brutal-black px-4 py-3',
                  'bg-surface text-sm font-bold text-foreground',
                  'shadow-brutal-sm transition-all duration-200',
                  'hover:bg-surface-hover hover:shadow-brutal-md',
                  'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                )}
              >
                {t('resume_btn')}
              </button>

              {/* Confirm Exit */}
              <button
                id="confirm-exit-confirm-btn"
                onClick={onConfirm}
                className={cn(
                  'flex-1 rounded-[var(--radius-md)] border-2 border-brutal-black px-4 py-3',
                  'bg-terracotta text-sm font-bold text-white',
                  'shadow-brutal-sm transition-all duration-200',
                  'hover:bg-terracotta-hover hover:shadow-brutal-md',
                  'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                )}
              >
                {t('confirm_btn')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
