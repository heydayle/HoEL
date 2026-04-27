'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { AnswerStatus, IQuizItem } from '@/modules/free-practice/core/models';
import { cn } from '@/lib/utils';

/**
 * Props for the PromptCard component.
 */
interface IPromptCardProps {
  /** Current quiz item to display */
  currentItem: IQuizItem;
  /** Current answer evaluation status */
  answerStatus: AnswerStatus;
  /** i18n translation function */
  t: (key: string) => string;
  /** Current question index (zero-based) */
  currentIndex: number;
  /** Total number of questions in the queue */
  totalQuestions: number;
  /** Number of correct answers so far */
  correctAnswers: number;
}

/**
 * Spring animation configuration per the design spec.
 */
const SPRING_CONFIG = { stiffness: 300, damping: 20 };

/**
 * Strips all HTML tags from a string so raw markup from the database
 * (e.g. `<b>cat</b>`) is never rendered as visible text.
 *
 * @param raw - String potentially containing HTML tags
 * @returns Plain text with all HTML tags removed
 */
const stripHtml = (raw: string): string => raw.replace(/<[^>]*>/g, '');

/**
 * Replaces the target word inside the example sentence with a `____` blank.
 *
 * HTML is stripped first so tags like `<b>word</b>` don't leave empty
 * `<b></b>` artefacts after the word is blanked out.
 *
 * The match is case-insensitive so "Apple" in "I ate an Apple." becomes
 * "I ate an ____."
 *
 * @param example - Full example sentence (may contain HTML)
 * @param word - The word to blank out
 * @returns The plain-text sentence with the word replaced by `____`
 */
const createBlankSentence = (example: string, word: string): string => {
  const plain = stripHtml(example);
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

  return plain.replace(regex, '____');
};

/**
 * Hero prompt card that displays the question to the player.
 *
 * In **meaning** mode it shows the Vietnamese definition and the user must
 * type the English word. In **example** mode it shows a sentence with a
 * `____` blank that gets filled in with an animated reveal on correct answer.
 *
 * @param props - Prompt card configuration
 * @returns The rendered prompt card element
 */
export default function PromptCard({
  currentItem,
  answerStatus,
  t,
  currentIndex,
  totalQuestions,
  correctAnswers,
}: IPromptCardProps): React.JSX.Element {
  const isMeaningMode = currentItem.promptType === 'meaning';
  const blankedSentence = isMeaningMode
    ? null
    : createBlankSentence(currentItem.example, currentItem.word);

  const isRevealing = answerStatus === 'correct' || answerStatus === 'timeout';

  return (
    <div
      id="prompt-card"
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 md:gap-6',
        'rounded-bento border-2 border-brutal-black bg-surface p-4 md:p-8',
        'shadow-brutal-md',
        'min-h-[140px] md:min-h-[200px] text-center',
      )}
    >
      {/* Question counter + Score */}
      <div className="flex w-full items-center justify-between text-sm font-bold text-foreground-muted">
        <span>
          {t('question_progress')} {currentIndex + 1}/{totalQuestions}
        </span>
        <span className="text-accent-primary">
          {t('score_label')}: {correctAnswers}
        </span>
      </div>

      {/* Prompt type label */}
      <span
        className="text-xs font-bold uppercase tracking-widest text-foreground-muted"
        data-testid="prompt-label"
      >
        {isMeaningMode ? t('meaning_prompt_label') : t('example_prompt_label')}
      </span>

      {/* Prompt content */}
      <div className="flex min-h-[80px] flex-1 items-center justify-center">
        {isMeaningMode ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl font-black leading-relaxed text-foreground md:text-2xl lg:text-3xl">
              {currentItem.meaning}
            </p>

            {/* Reveal: show the English word next to the meaning */}
            <AnimatePresence>
              {isRevealing && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', ...SPRING_CONFIG }}
                  className={cn(
                    'text-xl font-black md:text-2xl lg:text-3xl',
                    answerStatus === 'correct'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-terracotta',
                  )}
                  data-testid="revealed-word"
                >
                  → {currentItem.word}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-lg font-bold leading-relaxed text-foreground md:text-xl lg:text-2xl">
            {isRevealing ? (
              <>
                {blankedSentence?.split('____').map((segment, idx, arr) => (
                  <span key={idx}>
                    {segment}
                    {idx < arr.length - 1 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', ...SPRING_CONFIG }}
                        className={cn(
                          'font-black',
                          answerStatus === 'correct'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-terracotta',
                        )}
                        data-testid="revealed-word"
                      >
                        {currentItem.word}
                      </motion.span>
                    )}
                  </span>
                ))}
              </>
            ) : (
              <>
                {blankedSentence?.split('____').map((segment, idx, arr) => (
                  <span key={idx}>
                    {segment}
                    {idx < arr.length - 1 && (
                      <span className="mx-1 inline-block min-w-[60px] border-b-4 border-brutal-black" />
                    )}
                  </span>
                ))}
              </>
            )}
          </p>
        )}
      </div>

      {/* Vocabulary hints — mini contextual details */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-foreground-muted"
        data-testid="vocab-hints"
      >
        {currentItem.ipa && (
          <span className="font-mono text-accent-primary">{currentItem.ipa}</span>
        )}
        {currentItem.partOfSpeech && (
          <span
            className={cn(
              'rounded-full border border-brutal-black/20 px-2 py-0.5',
              'bg-surface-hover font-semibold italic',
            )}
          >
            {currentItem.partOfSpeech}
          </span>
        )}
        {!isMeaningMode && currentItem.meaning && (
          <span className="font-medium">{currentItem.meaning}</span>
        )}
        {isMeaningMode && currentItem.translation && (
          <span className="font-medium">{currentItem.translation}</span>
        )}
      </div>

      {/* Timeout / Correct label */}
      <AnimatePresence>
        {answerStatus === 'timeout' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-bold text-terracotta"
          >
            {t('timeout_label')}
          </motion.div>
        )}
        {answerStatus === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-bold text-green-600 dark:text-green-400"
          >
            {t('correct_label')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
