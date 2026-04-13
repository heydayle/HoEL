import { renderHook, act } from '@testing-library/react';
import { useGenerateVocab } from './useGenerateVocab';
import { executeGenerateVocab } from '../../core/usecases';
import { parseTextResult } from '@/shared/hooks';
import type { ILesson, IVocabulary } from '../../core/models';

/** Mock the API call layer */
jest.mock('../../core/usecases', () => ({
  executeGenerateVocab: jest.fn(),
}));

/** Mock the parse utility */
jest.mock('@/shared/hooks', () => ({
  parseTextResult: jest.fn(),
}));

const mockedExecute = executeGenerateVocab as jest.MockedFunction<typeof executeGenerateVocab>;
const mockedParse = parseTextResult as jest.MockedFunction<typeof parseTextResult>;

/** Helper: create a resolved Dify-shaped response */
const makeDifyResponse = (textResult: string) => ({
  data: { outputs: { text_result: textResult } },
});

/** Helper: create a parsed IVocabulary fixture */
const makeParsedVocab = (word: string): IVocabulary => ({
  id: `parsed-${word}`,
  word,
  ipa: `/ˈ${word}/`,
  partOfSpeech: 'noun',
  meaning: `Meaning of ${word}`,
  translation: `Dịch của ${word}`,
  pronunciation: word,
  example: `This is ${word}.`,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useGenerateVocab — initialisation', () => {
  it('returns empty vocabularies when no initialLesson is provided', () => {
    const { result } = renderHook(() => useGenerateVocab());

    expect(result.current.vocabularies).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.newVocab).toBe('');
  });

  it('seeds vocabularies from initialLesson', () => {
    const existingVocab: IVocabulary = {
      id: 'v1',
      word: 'existing',
      ipa: '',
      partOfSpeech: '',
      meaning: '',
      translation: '',
      pronunciation: '',
      example: '',
    };
    const lesson: ILesson = {
      id: 'lesson-1',
      date: '2026-01-01',
      topic: 'test',
      participantName: 'user',
      isPinned: false,
      isFavorite: false,
      priority: 'Medium',
      notes: '',
      vocabularies: [existingVocab],
    };

    const { result } = renderHook(() => useGenerateVocab(lesson));

    expect(result.current.vocabularies).toHaveLength(1);
    expect(result.current.vocabularies[0].word).toBe('existing');
  });

  it('handles null initialLesson gracefully', () => {
    const { result } = renderHook(() => useGenerateVocab(null));

    expect(result.current.vocabularies).toEqual([]);
  });
});

describe('useGenerateVocab — generate (success path)', () => {
  it('immediately adds a skeleton placeholder when generate is called', async () => {
    /** Create a deferred promise so we can inspect intermediate state */
    let resolveApi!: (value: ReturnType<typeof makeDifyResponse>) => void;
    const apiPromise = new Promise<ReturnType<typeof makeDifyResponse>>((resolve) => {
      resolveApi = resolve;
    });
    mockedExecute.mockReturnValue(apiPromise as ReturnType<typeof mockedExecute>);

    const { result } = renderHook(() => useGenerateVocab());

    act(() => {
      result.current.generate('happy');
    });

    // A skeleton placeholder should appear immediately
    expect(result.current.vocabularies).toHaveLength(1);
    expect(result.current.vocabularies[0]._loading).toBe(true);
    expect(result.current.vocabularies[0]._loadingWord).toBe('happy');
    expect(result.current.vocabularies[0].word).toBe('');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.newVocab).toBe('');

    // Now resolve so the pending promise doesn't leak
    const parsed = makeParsedVocab('happy');
    mockedParse.mockReturnValue(parsed);
    await act(async () => {
      resolveApi(makeDifyResponse('json'));
    });
  });

  it('replaces the skeleton placeholder with real data when API resolves', async () => {
    const parsed = makeParsedVocab('happy');
    mockedExecute.mockResolvedValue(makeDifyResponse('json') as ReturnType<typeof mockedExecute>);
    mockedParse.mockReturnValue(parsed);

    const { result } = renderHook(() => useGenerateVocab());

    await act(async () => {
      result.current.generate('happy');
    });

    // Placeholder should now be resolved
    expect(result.current.vocabularies).toHaveLength(1);
    expect(result.current.vocabularies[0]._loading).toBe(false);
    expect(result.current.vocabularies[0].word).toBe('happy');
    expect(result.current.vocabularies[0].meaning).toBe('Meaning of happy');
    expect(result.current.isLoading).toBe(false);
  });

  it('clears newVocab to empty string after calling generate', async () => {
    mockedExecute.mockResolvedValue(makeDifyResponse('json') as ReturnType<typeof mockedExecute>);
    mockedParse.mockReturnValue(makeParsedVocab('test'));

    const { result } = renderHook(() => useGenerateVocab());

    act(() => {
      result.current.setNewVocab('test');
    });
    expect(result.current.newVocab).toBe('test');

    await act(async () => {
      result.current.generate('test');
    });

    expect(result.current.newVocab).toBe('');
  });

  it('preserves the placeholder id on the resolved vocabulary entry', async () => {
    const parsed = makeParsedVocab('happy');
    mockedExecute.mockResolvedValue(makeDifyResponse('json') as ReturnType<typeof mockedExecute>);
    mockedParse.mockReturnValue(parsed);

    const { result } = renderHook(() => useGenerateVocab());

    await act(async () => {
      result.current.generate('happy');
    });

    // The id should start with "vocab-loading-" (the placeholder id), NOT "parsed-happy"
    expect(result.current.vocabularies[0].id).toMatch(/^vocab-loading-/);
  });
});

describe('useGenerateVocab — generate (failure path)', () => {
  it('removes the skeleton placeholder when the API call fails', async () => {
    mockedExecute.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGenerateVocab());

    await act(async () => {
      result.current.generate('broken');
    });

    // The placeholder should have been removed
    expect(result.current.vocabularies).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not remove previously loaded vocabularies on failure', async () => {
    const parsed = makeParsedVocab('first');
    mockedExecute.mockResolvedValueOnce(makeDifyResponse('json') as ReturnType<typeof mockedExecute>);
    mockedParse.mockReturnValueOnce(parsed);

    const { result } = renderHook(() => useGenerateVocab());

    // Successfully generate a first word
    await act(async () => {
      result.current.generate('first');
    });
    expect(result.current.vocabularies).toHaveLength(1);

    // Now fail on a second word
    mockedExecute.mockRejectedValueOnce(new Error('fail'));
    await act(async () => {
      result.current.generate('broken');
    });

    // Only the first (successful) vocab should remain
    expect(result.current.vocabularies).toHaveLength(1);
    expect(result.current.vocabularies[0].word).toBe('first');
  });
});

describe('useGenerateVocab — concurrent generation', () => {
  it('supports multiple concurrent skeleton placeholders', async () => {
    let resolveFirst!: (v: ReturnType<typeof makeDifyResponse>) => void;
    let resolveSecond!: (v: ReturnType<typeof makeDifyResponse>) => void;

    const firstPromise = new Promise<ReturnType<typeof makeDifyResponse>>((r) => {
      resolveFirst = r;
    });
    const secondPromise = new Promise<ReturnType<typeof makeDifyResponse>>((r) => {
      resolveSecond = r;
    });

    mockedExecute
      .mockReturnValueOnce(firstPromise as ReturnType<typeof mockedExecute>)
      .mockReturnValueOnce(secondPromise as ReturnType<typeof mockedExecute>);

    const { result } = renderHook(() => useGenerateVocab());

    // Fire two concurrent generation calls
    act(() => {
      result.current.generate('happy');
    });
    act(() => {
      result.current.generate('sad');
    });

    // Both placeholders should be loading
    expect(result.current.vocabularies).toHaveLength(2);
    expect(result.current.vocabularies[0]._loading).toBe(true);
    expect(result.current.vocabularies[0]._loadingWord).toBe('happy');
    expect(result.current.vocabularies[1]._loading).toBe(true);
    expect(result.current.vocabularies[1]._loadingWord).toBe('sad');
    expect(result.current.isLoading).toBe(true);

    // Resolve the second one first (out of order)
    const parsedSad = makeParsedVocab('sad');
    mockedParse.mockReturnValueOnce(parsedSad);
    await act(async () => {
      resolveSecond(makeDifyResponse('json'));
    });

    // Second should be resolved, first still loading
    expect(result.current.vocabularies).toHaveLength(2);
    expect(result.current.vocabularies[0]._loading).toBe(true);
    expect(result.current.vocabularies[1]._loading).toBe(false);
    expect(result.current.vocabularies[1].word).toBe('sad');
    expect(result.current.isLoading).toBe(true); // first still pending

    // Now resolve the first
    const parsedHappy = makeParsedVocab('happy');
    mockedParse.mockReturnValueOnce(parsedHappy);
    await act(async () => {
      resolveFirst(makeDifyResponse('json'));
    });

    expect(result.current.vocabularies).toHaveLength(2);
    expect(result.current.vocabularies[0]._loading).toBe(false);
    expect(result.current.vocabularies[0].word).toBe('happy');
    expect(result.current.isLoading).toBe(false); // all done
  });

  it('isLoading remains true until all concurrent requests finish', async () => {
    let resolveFirst!: (v: ReturnType<typeof makeDifyResponse>) => void;
    let resolveSecond!: (v: ReturnType<typeof makeDifyResponse>) => void;

    const firstPromise = new Promise<ReturnType<typeof makeDifyResponse>>((r) => {
      resolveFirst = r;
    });
    const secondPromise = new Promise<ReturnType<typeof makeDifyResponse>>((r) => {
      resolveSecond = r;
    });

    mockedExecute
      .mockReturnValueOnce(firstPromise as ReturnType<typeof mockedExecute>)
      .mockReturnValueOnce(secondPromise as ReturnType<typeof mockedExecute>);

    const { result } = renderHook(() => useGenerateVocab());

    act(() => {
      result.current.generate('a');
    });
    act(() => {
      result.current.generate('b');
    });

    expect(result.current.isLoading).toBe(true);

    mockedParse.mockReturnValueOnce(makeParsedVocab('a'));
    await act(async () => {
      resolveFirst(makeDifyResponse('json'));
    });
    // Still loading because second request is pending
    expect(result.current.isLoading).toBe(true);

    mockedParse.mockReturnValueOnce(makeParsedVocab('b'));
    await act(async () => {
      resolveSecond(makeDifyResponse('json'));
    });
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useGenerateVocab — setVocabularies (direct manipulation)', () => {
  it('allows external mutation of vocabularies via setVocabularies', () => {
    const { result } = renderHook(() => useGenerateVocab());

    const manualVocab: IVocabulary = {
      id: 'manual-1',
      word: 'manual',
      ipa: '',
      partOfSpeech: '',
      meaning: '',
      translation: '',
      pronunciation: '',
      example: '',
    };

    act(() => {
      result.current.setVocabularies([manualVocab]);
    });

    expect(result.current.vocabularies).toHaveLength(1);
    expect(result.current.vocabularies[0].word).toBe('manual');
  });
});
