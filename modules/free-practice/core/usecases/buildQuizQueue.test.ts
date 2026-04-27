import { describe, expect, it, vi } from 'vitest';

import type { IVocabulary } from '@/modules/lesson/core/models';

import { GAME_CONFIG } from '@/modules/free-practice/core/models';
import { buildQuizQueue, pickPromptType, shuffle } from './buildQuizQueue';

/**
 * Factory helper to create a valid IVocabulary stub.
 *
 * @param overrides - Partial fields to customise
 * @returns A complete IVocabulary object
 */
const createVocab = (overrides: Partial<IVocabulary> = {}): IVocabulary => ({
  id: 'v-1',
  word: 'apple',
  ipa: '/ˈæp.əl/',
  partOfSpeech: 'noun',
  meaning: 'quả táo',
  translation: 'quả táo',
  pronunciation: 'AP-ul',
  example: 'I ate an apple.',
  ...overrides,
});

describe('pickPromptType', () => {
  it('returns "meaning" when the example is an empty string', () => {
    expect(pickPromptType('')).toBe('meaning');
  });

  it('returns "meaning" when the example is only whitespace', () => {
    expect(pickPromptType('   ')).toBe('meaning');
  });

  it('returns "meaning" when Math.random < 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.49);
    expect(pickPromptType('Some example sentence')).toBe('meaning');
    vi.restoreAllMocks();
  });

  it('returns "example" when Math.random >= 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(pickPromptType('Some example sentence')).toBe('example');
    vi.restoreAllMocks();
  });
});

describe('shuffle', () => {
  it('returns a new array with the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);

    expect(result).toHaveLength(input.length);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);

    expect(input).toEqual(copy);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);

    expect(result.sort()).toEqual(input.sort());
  });

  it('returns an empty array for empty input', () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe('buildQuizQueue', () => {
  it('returns an empty array when vocabulary count is below the minimum', () => {
    const vocabs = [createVocab(), createVocab({ id: 'v-2', word: 'banana' })];

    expect(vocabs.length).toBeLessThan(GAME_CONFIG.MIN_VOCAB_COUNT);
    expect(buildQuizQueue(vocabs)).toEqual([]);
  });

  it('returns an empty array when all vocabulary words are blank', () => {
    const vocabs = Array.from({ length: 5 }, (_, i) =>
      createVocab({ id: `v-${i}`, word: '   ' }),
    );

    expect(buildQuizQueue(vocabs)).toEqual([]);
  });

  it('filters out blank-word entries before counting', () => {
    const vocabs = [
      createVocab({ id: 'v-1', word: 'hello' }),
      createVocab({ id: 'v-2', word: '' }),
      createVocab({ id: 'v-3', word: 'world' }),
    ];

    // Only 2 valid words → below minimum of 3
    expect(buildQuizQueue(vocabs)).toEqual([]);
  });

  it('builds a quiz queue of the correct length when above minimum', () => {
    const vocabs = Array.from({ length: 5 }, (_, i) =>
      createVocab({ id: `v-${i}`, word: `word-${i}` }),
    );

    const queue = buildQuizQueue(vocabs);

    expect(queue).toHaveLength(5);
  });

  it('maps vocabulary fields correctly onto IQuizItem', () => {
    const vocabs = Array.from({ length: 3 }, (_, i) =>
      createVocab({
        id: `v-${i}`,
        word: `word-${i}`,
        meaning: `meaning-${i}`,
        example: `example-${i}`,
      }),
    );

    const queue = buildQuizQueue(vocabs);

    for (const item of queue) {
      expect(item).toHaveProperty('vocabId');
      expect(item).toHaveProperty('word');
      expect(item).toHaveProperty('meaning');
      expect(item).toHaveProperty('example');
      expect(['meaning', 'example']).toContain(item.promptType);
    }
  });

  it('assigns "meaning" promptType when example is empty', () => {
    const vocabs = Array.from({ length: 3 }, (_, i) =>
      createVocab({ id: `v-${i}`, word: `word-${i}`, example: '' }),
    );

    const queue = buildQuizQueue(vocabs);

    for (const item of queue) {
      expect(item.promptType).toBe('meaning');
    }
  });
});
