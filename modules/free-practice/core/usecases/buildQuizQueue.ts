import type { IVocabulary } from '@/modules/lesson/core/models';

import type { IQuizItem, PromptType } from '../models';
import { GAME_CONFIG } from '../models';

/**
 * Randomly selects a prompt type for a quiz item.
 * If the vocabulary entry has a usable example sentence, there is a 50/50
 * chance between 'meaning' and 'example'. Otherwise, defaults to 'meaning'.
 *
 * @param example - The example sentence from the vocabulary entry
 * @returns A randomly selected PromptType
 */
export const pickPromptType = (example: string): PromptType => {
  if (!example.trim()) {
    return 'meaning';
  }

  return Math.random() < 0.5 ? 'meaning' : 'example';
};

/**
 * Fisher–Yates shuffle producing a new array without mutating the original.
 *
 * @param items - Array to shuffle
 * @returns A new shuffled array
 */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

/**
 * Builds a randomised quiz queue from a list of vocabularies.
 *
 * Returns an empty array when the vocabulary count is below
 * {@link GAME_CONFIG.MIN_VOCAB_COUNT}.
 *
 * @param vocabularies - Source vocabulary entries from a lesson
 * @returns Shuffled quiz items ready for the game session
 */
export const buildQuizQueue = (vocabularies: IVocabulary[]): IQuizItem[] => {
  const validVocabs = vocabularies.filter((v) => v.word.trim() !== '');

  if (validVocabs.length < GAME_CONFIG.MIN_VOCAB_COUNT) {
    return [];
  }

  const shuffled = shuffle(validVocabs);

  return shuffled.map((v) => ({
    vocabId: v.id,
    word: v.word,
    ipa: v.ipa,
    partOfSpeech: v.partOfSpeech,
    meaning: v.meaning,
    translation: v.translation,
    example: v.example,
    promptType: pickPromptType(v.example),
  }));
};
