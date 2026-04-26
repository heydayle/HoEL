'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type {
  IVocabularyCreatePayload,
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';
import {
  createVocabulary,
  editVocabulary,
  fetchVocabulariesByLesson,
  removeVocabulary,
} from '@/modules/lesson/core/usecases/vocabularyUseCase';
import { executeGenerateVocab } from '@/modules/lesson/core/usecases';
import { parseTextResult } from '@/shared/hooks';

/**
 * Return shape of the {@link useVocabulary} hook.
 */
export interface IUseVocabularyReturn {
  /** Persisted vocabulary list */
  vocabularies: IVocabularyRow[];
  /** Whether a network request is in progress */
  isLoading: boolean;
  /** Human-readable error message, or `null` */
  error: string | null;
  /** Temporary AI-generated vocab data awaiting user review */
  draftVocab: Omit<IVocabularyCreatePayload, 'lesson_id'> | null;
  /** Word currently typed in the AI generation input */
  aiWord: string;
  /** Setter for the AI word input */
  setAiWord: (word: string) => void;
  /** Loads the vocabulary list from Supabase */
  fetchList: () => Promise<void>;
  /** Generates vocab via Dify AI — result stored in `draftVocab` */
  handleGenerate: (word: string) => Promise<void>;
  /** Clears the current `draftVocab` */
  clearDraft: () => void;
  /** Saves a new vocabulary record after user review */
  handleCreate: (payload: Omit<IVocabularyCreatePayload, 'lesson_id'>) => Promise<void>;
  /** Updates an existing vocabulary record */
  handleUpdate: (id: string, payload: IVocabularyUpdatePayload) => Promise<void>;
  /** Removes a vocabulary record with confirmation */
  handleDelete: (id: string) => Promise<void>;
}

/**
 * Hook that manages vocabulary CRUD state for a specific lesson.
 * Provides optimistic UI updates for smooth user experience.
 *
 * @param lessonId - UUID of the parent lesson
 * @param t - Translation function for i18n messages
 * @returns Vocabulary state and action handlers
 */
export const useVocabulary = (
  lessonId: string,
  t: (key: string) => string,
): IUseVocabularyReturn => {
  const [vocabularies, setVocabularies] = useState<IVocabularyRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [draftVocab, setDraftVocab] = useState<Omit<IVocabularyCreatePayload, 'lesson_id'> | null>(null);
  const [aiWord, setAiWord] = useState<string>('');

  /**
   * Fetches vocabulary list from Supabase for the current lesson.
   */
  const fetchList = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchVocabulariesByLesson(lessonId);
      setVocabularies(data);
    } catch (err: unknown) {
      const message = (err as Error).message || t('vocab_fetch_error');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, t]);

  /**
   * Calls the Dify AI workflow to generate vocabulary data.
   * The generated data is stored in `draftVocab` for user review
   * before being officially saved.
   *
   * @param word - The English word to generate vocabulary for
   */
  const handleGenerate = useCallback(async (word: string): Promise<void> => {
    if (!word.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await executeGenerateVocab(word.trim());
      const parsed = parseTextResult(result?.data?.outputs?.text_result) as Record<string, string> | null;

      if (parsed) {
        setDraftVocab({
          word: parsed.word ?? word.trim(),
          ipa: parsed.ipa ?? '',
          partOfSpeech: parsed.partOfSpeech ?? '',
          meaning: parsed.meaning ?? '',
          translation: parsed.translation ?? '',
          pronunciation: parsed.pronunciation ?? '',
          example: parsed.example ?? '',
        });
        setAiWord('');
        toast.success(t('vocab_ai_generated'));
      } else {
        toast.error(t('vocab_ai_parse_error'));
      }
    } catch (err: unknown) {
      const message = (err as Error).message || t('vocab_ai_error');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  /**
   * Clears the current AI-generated draft vocabulary.
   */
  const clearDraft = useCallback((): void => {
    setDraftVocab(null);
  }, []);

  /**
   * Creates a new vocabulary record with optimistic UI update.
   *
   * @param payload - Vocabulary data without lesson_id
   */
  const handleCreate = useCallback(async (
    payload: Omit<IVocabularyCreatePayload, 'lesson_id'>,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    /** Optimistic placeholder row */
    const optimisticRow: IVocabularyRow = {
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      lesson_id: lessonId,
      ...payload,
    };

    setVocabularies((prev) => [...prev, optimisticRow]);

    try {
      const created = await createVocabulary(lessonId, payload);

      if (created) {
        /** Replace the optimistic row with the real server row */
        setVocabularies((prev) =>
          prev.map((v) => (v.id === optimisticRow.id ? created : v)),
        );
        setDraftVocab(null);
        toast.success(t('vocab_created'));
      } else {
        /** Rollback optimistic insert on failure */
        setVocabularies((prev) => prev.filter((v) => v.id !== optimisticRow.id));
        toast.error(t('vocab_create_error'));
      }
    } catch (err: unknown) {
      /** Rollback optimistic insert on error */
      setVocabularies((prev) => prev.filter((v) => v.id !== optimisticRow.id));
      const message = (err as Error).message || t('vocab_create_error');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, t]);

  /**
   * Updates an existing vocabulary record with optimistic UI update.
   *
   * @param id - UUID of the vocabulary to update
   * @param payload - Partial data to apply
   */
  const handleUpdate = useCallback(async (
    id: string,
    payload: IVocabularyUpdatePayload,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    /** Snapshot before optimistic update for rollback */
    const previousVocabularies = [...vocabularies];

    /** Optimistic update */
    setVocabularies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...payload } : v)),
    );

    try {
      const updated = await editVocabulary(id, payload);

      if (updated) {
        setVocabularies((prev) =>
          prev.map((v) => (v.id === id ? updated : v)),
        );
        toast.success(t('vocab_updated'));
      } else {
        setVocabularies(previousVocabularies);
        toast.error(t('vocab_update_error'));
      }
    } catch (err: unknown) {
      setVocabularies(previousVocabularies);
      const message = (err as Error).message || t('vocab_update_error');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [vocabularies, t]);

  /**
   * Deletes a vocabulary record with optimistic UI removal.
   *
   * @param id - UUID of the vocabulary to delete
   */
  const handleDelete = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    /** Snapshot for rollback */
    const previousVocabularies = [...vocabularies];

    /** Optimistic removal */
    setVocabularies((prev) => prev.filter((v) => v.id !== id));

    try {
      const success = await removeVocabulary(id);

      if (success) {
        toast.success(t('vocab_deleted'));
      } else {
        setVocabularies(previousVocabularies);
        toast.error(t('vocab_delete_error'));
      }
    } catch (err: unknown) {
      setVocabularies(previousVocabularies);
      const message = (err as Error).message || t('vocab_delete_error');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [vocabularies, t]);

  return {
    vocabularies,
    isLoading,
    error,
    draftVocab,
    aiWord,
    setAiWord,
    fetchList,
    handleGenerate,
    clearDraft,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
