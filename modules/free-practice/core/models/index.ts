/**
 * Prompt display type for a quiz item.
 * - `meaning`: Shows the Vietnamese meaning; user types the English word.
 * - `example`: Shows a sentence with a blank `____`; user types the missing word.
 */
export type PromptType = 'meaning' | 'example';

/**
 * A single quiz item built from an IVocabulary entry.
 * Contains the correct answer, contextual hints, and a randomly
 * assigned prompt type.
 */
export interface IQuizItem {
  /** Original vocabulary ID for traceability */
  vocabId: string;
  /** The correct English word (answer) */
  word: string;
  /** International Phonetic Alphabet notation */
  ipa: string;
  /** Grammar class of the word (e.g. noun, verb, adjective) */
  partOfSpeech: string;
  /** Vietnamese/target-language definition used as hint in 'meaning' mode */
  meaning: string;
  /** Translation in the native language */
  translation: string;
  /** Example sentence used as hint in 'example' mode (contains the word) */
  example: string;
  /** Which prompt style to display for this item */
  promptType: PromptType;
}

/**
 * All possible modal states during a game session.
 * - `NONE`: No modal is shown.
 * - `CONFIRM_EXIT`: "Are you sure?" exit confirmation is displayed.
 * - `SUMMARY`: End-of-session stats summary is displayed.
 */
export type ModalState = 'NONE' | 'CONFIRM_EXIT' | 'SUMMARY';

/**
 * Memory classification based on the player's correct-answer percentage.
 * - `needs_review`: < 50%
 * - `good_grasp`: 50–80%
 * - `excellent`: > 80%
 */
export type MemoryLevel = 'needs_review' | 'good_grasp' | 'excellent';

/**
 * Answer evaluation status driving UI feedback animations.
 * - `idle`: Waiting for user input.
 * - `correct`: Answer matched; triggers inline reveal.
 * - `wrong`: Answer did not match; triggers shake animation.
 * - `timeout`: Timer reached zero before a correct answer.
 */
export type AnswerStatus = 'idle' | 'correct' | 'wrong' | 'timeout';

/**
 * Configuration constants for the game session.
 */
export const GAME_CONFIG = {
  /** Seconds allowed per question */
  TIME_PER_QUESTION: 30,
  /** Seconds to display the correct answer before advancing */
  REVEAL_DURATION: 2,
  /** Minimum vocabulary count required to start a game */
  MIN_VOCAB_COUNT: 3,
  /** Timer threshold (seconds) at which the bar turns critical/pulsing */
  CRITICAL_TIME_THRESHOLD: 5,
} as const;
