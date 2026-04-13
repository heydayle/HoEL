import { useCallback, useState } from 'react';

import type { ILesson, IVocabulary } from '../../core/models';
import { executeGenerateVocab } from '../../core/usecases';
import { parseTextResult } from '@/shared/hooks';

/**
 * Return type for the {@link useGenerateVocab} hook.
 */
export interface IUseGenerateVocabReturn {
  /** Triggers vocabulary generation for a given word. */
  generate: (word: string) => void;
  /** Whether *any* generation request is currently in-flight. */
  isLoading: boolean;
  /** The current new-vocab input value. */
  newVocab: string;
  /** Setter for the new-vocab input value. */
  setNewVocab: React.Dispatch<React.SetStateAction<string>>;
  /** Full vocabulary list including skeleton placeholders. */
  vocabularies: IVocabulary[];
  /** Direct setter for the vocabulary list. */
  setVocabularies: React.Dispatch<React.SetStateAction<IVocabulary[]>>;
}

/**
 * Custom hook that manages AI-powered vocabulary generation with per-item
 * skeleton loading states.  Each call to {@link generate} immediately
 * appends a placeholder (with `_loading: true`) to the vocabulary list
 * so the UI can render a skeleton card, and once the API responds the
 * placeholder is replaced with the real data.
 *
 * Multiple words can be generated concurrently — the input is *not*
 * blocked while a previous generation is still in progress.
 *
 * @param initialLesson - Optional lesson whose vocabularies seed the list.
 * @returns Hook state and controls.
 */
export const useGenerateVocab = (
  initialLesson?: ILesson | null,
): IUseGenerateVocabReturn => {
  /** Tracks the number of in-flight generation requests. */
  const [pendingCount, setPendingCount] = useState<number>(0);

  /** New-vocab text input value. */
  const [newVocab, setNewVocab] = useState('');

  /** The full vocabulary list (including skeleton placeholders). */
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>(
    initialLesson?.vocabularies ?? [],
  );

  /** Derived boolean: true when at least one request is pending. */
  const isLoading = pendingCount > 0;

  /**
   * Triggers vocabulary generation for a given word.
   *
   * 1. Creates a unique placeholder ID.
   * 2. Appends a skeleton placeholder (`_loading: true`) to the list.
   * 3. Fires the API call.
   * 4. On success, replaces the placeholder with the real entry.
   * 5. On failure, removes the placeholder.
   *
   * @param word - The vocabulary word to generate.
   */
  const generate = useCallback((word: string): void => {
    const placeholderId = `vocab-loading-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    /** Skeleton placeholder inserted into the list immediately. */
    const placeholder: IVocabulary = {
      id: placeholderId,
      word: '',
      ipa: '',
      partOfSpeech: '',
      meaning: '',
      translation: '',
      pronunciation: '',
      example: '',
      _loading: true,
      _loadingWord: word,
    };

    setVocabularies((prev) => [...prev, placeholder]);
    setPendingCount((c) => c + 1);
    setNewVocab('');

    executeGenerateVocab(word)
      .then((result) => {
        const newVocabEntry: IVocabulary = parseTextResult(
          result?.data?.outputs?.text_result,
        ) as IVocabulary;

        setVocabularies((prev) =>
          prev.map((v) =>
            v.id === placeholderId
              ? { ...newVocabEntry, id: placeholderId, _loading: false }
              : v,
          ),
        );
      })
      .catch(() => {
        /** Remove the broken placeholder on failure. */
        setVocabularies((prev) => prev.filter((v) => v.id !== placeholderId));
      })
      .finally(() => {
        setPendingCount((c) => c - 1);
      });
  }, []);

  return {
    generate,
    isLoading,
    newVocab,
    setNewVocab,
    vocabularies,
    setVocabularies,
  };
};