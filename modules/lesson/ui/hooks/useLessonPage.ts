'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ILesson, IVocabularyCreatePayload } from '@/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/modules/lesson/core/usecases';
import {
  getFilteredLessons,
  getLessonStats
} from '@/modules/lesson/core/usecases';
import { generateAndSaveSummary } from '@/modules/lesson/core/usecases/summaryUseCase';
import { getLessonsFromLocalStorage, saveLessonsToLocalStorage, updateLessonInSupabase } from '@/modules/lesson/infras';
import { bulkAddVocabs, syncVocabularies } from '@/modules/lesson/infras/vocabularyApi';
import enMessages from '@/modules/lesson/messages/en.json';
import viMessages from '@/modules/lesson/messages/vi.json';
import { useLocale, useTheme } from '@/shared/hooks';
import type { Locale, TranslationMessages } from '@/shared/types';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

/**
 * Locale messages map for the lesson module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Initial filter state for lessons list UI.
 */
const INITIAL_FILTERS: ILessonFilterInput = {
  searchTerm: '',
  vocabSearchTerm: '',
  isPinned: false,
  isFavorite: false,
  priority: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date_desc',
};

/**
 * Hook providing state and handlers for the lessons list page.
 * @returns View model for rendering lessons list UI
 */
export const useLessonPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);
  const [filters, setFilters] = useState<ILessonFilterInput>(INITIAL_FILTERS);
  const [loading, setLoading] = useState(false);

  /**
   * Reads lessons from local storage and falls back to sample data.
   */
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const loadLessons = async () => {
    const storedLessons = await getLessonsFromLocalStorage();
    return storedLessons.length > 0 ? storedLessons : [];
  };

  useEffect(() => {
    let mounted = true;
    const fetchLessons = async () => {
      setLoading(true);
      const lessons = await loadLessons();
      if (mounted) {
        setLessons(lessons);
      }
      setLoading(false);
    };
    void fetchLessons();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Adds a new lesson to the list and persists it.
   * Saves the lesson first, then bulk-inserts associated vocabularies.
   *
   * @param lesson - Built lesson (without id)
   */
  const addLesson = async (lesson: Omit<ILesson, 'id'>): Promise<void> => {
    setIsAdding(true);
    const uuid = uuidv4();
    const user = localStorage.getItem('sb-hpnokwlodebafzgebopj-auth-token');
    const userID = JSON.parse(user || '{}')?.user?.id;
    const newLesson: ILesson = {
      ...lesson,
      id: uuid,
      createdBy: userID || 'unknown',
    };

    try {
      const result = await saveLessonsToLocalStorage(newLesson);

      if (!result.success) {
        toast.error(t('lesson_save_error_toast'));
        return;
      }

      /** Save vocabularies into the separate `vocabularies` table */
      if (lesson.vocabularies && lesson.vocabularies.length > 0) {
        const vocabPayloads: IVocabularyCreatePayload[] = lesson.vocabularies
          .filter((v) => v.word.trim() !== '')
          .map((v) => ({
            word: v.word,
            ipa: v.ipa,
            partOfSpeech: v.partOfSpeech,
            meaning: v.meaning,
            translation: v.translation,
            pronunciation: v.pronunciation,
            example: v.example,
            lesson_id: uuid,
          }));

        const savedVocabs = await bulkAddVocabs(vocabPayloads);

        if (savedVocabs.length === 0 && vocabPayloads.length > 0) {
          console.error('Failed to save vocabularies for lesson:', uuid);
          toast.error(t('vocab_save_error_toast') || 'Failed to save vocabularies');
        }

        /** Generate summary from vocabulary word list */
        const wordList = vocabPayloads.map((v) => v.word);

        try {
          await generateAndSaveSummary(uuid, wordList);
        } catch (summaryErr: unknown) {
          console.error('Summary generation failed:', (summaryErr as Error).message);
          /** Non-blocking: lesson saved successfully even if summary fails */
        }
      }

      const updatedLessons = [newLesson, ...lessons];
      setLessons(updatedLessons);
      toast.success(t('lesson_created_toast'));
    } catch (err: unknown) {
      const message = (err as Error).message || 'Failed to create lesson';
      console.error('addLesson error:', message);
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Updates an existing lesson and persists both metadata and vocabulary
   * changes to Supabase.
   *
   * @param lessonId - ID of lesson to update
   * @param lesson - Updated lesson data
   */
  const updateLesson = async (lessonId: string, lesson: Omit<ILesson, 'id'>, existingSummaryId?: string): Promise<void> => {
    setIsUpdating(true);
    try {
      /** Persist lesson metadata */
      const result = await updateLessonInSupabase(lessonId, lesson);

      if (!result.success) {
        toast.error(t('lesson_save_error_toast'));
        return;
      }

      /** Sync vocabularies — delete old + insert new */
      if (lesson.vocabularies && lesson.vocabularies.length > 0) {
        const vocabPayloads: IVocabularyCreatePayload[] = lesson.vocabularies
          .filter((v) => v.word.trim() !== '')
          .map((v) => ({
            word: v.word,
            ipa: v.ipa,
            partOfSpeech: v.partOfSpeech,
            meaning: v.meaning,
            translation: v.translation,
            pronunciation: v.pronunciation,
            example: v.example,
            lesson_id: lessonId,
          }));

        await syncVocabularies(lessonId, vocabPayloads);
      } else {
        /** No vocabularies submitted — clear existing ones */
        await syncVocabularies(lessonId, []);
      }

      /** Update local state */
      const updatedLessons = lessons.map((l) =>
        l.id === lessonId ? { ...lesson, id: lessonId } : l,
      );
      setLessons(updatedLessons);
      toast.success(t('lesson_updated_toast'));
    } catch (err: unknown) {
      const message = (err as Error).message || 'Failed to update lesson';
      console.error('updateLesson error:', message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Computes the filtered and sorted lessons list.
   */
  const displayedLessons = useMemo(() => getFilteredLessons(lessons, filters), [lessons, filters]);

  /**
   * Computes summary numbers for currently displayed lessons.
   */
  const stats = useMemo(() => getLessonStats(displayedLessons), [displayedLessons]);

  /**
   * Updates the search input state.
   * @param searchTerm - New search term
   */
  const updateSearchTerm = (searchTerm: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      searchTerm,
    }));
  };

  /**
   * Updates the vocabulary keyword filter.
   * @param vocabSearchTerm - New vocabulary search term
   */
  const updateVocabSearchTerm = (vocabSearchTerm: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      vocabSearchTerm,
    }));
  };

  /**
   * Updates pinned filter toggle.
   * @param isPinned - New pinned state
   */
  const updatePinnedFilter = (isPinned: boolean): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      isPinned,
    }));
  };

  /**
   * Updates favorite filter toggle.
   * @param isFavorite - New favorite state
   */
  const updateFavoriteFilter = (isFavorite: boolean): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      isFavorite,
    }));
  };

  /**
   * Updates priority filter option.
   * @param priority - Selected priority value
   */
  const updatePriorityFilter = (priority: ILessonFilterInput['priority']): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      priority,
    }));
  };

  /**
   * Updates start date filter.
   * @param startDate - ISO date string
   */
  const updateStartDate = (startDate: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      startDate,
    }));
  };

  /**
   * Updates end date filter.
   * @param endDate - ISO date string
   */
  const updateEndDate = (endDate: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      endDate,
    }));
  };

  /**
   * Updates sorting option.
   * @param sortBy - Selected sorting strategy
   */
  const updateSortBy = (sortBy: LessonSortOption): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      sortBy,
    }));
  };

  /**
   * Resets all list filters to defaults.
   */
  const resetFilters = (): void => {
    setFilters(INITIAL_FILTERS);
  };

  /**
   * Toggles light/dark mode with system-mode awareness.
   */
  const toggleTheme = (): void => {
    if (mode === 'system') {
      setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
      return;
    }

    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  };

  return {
    loading,
    resolvedTheme,
    locale,
    setLocale,
    t,
    toggleTheme,
    filters,
    displayedLessons,
    stats,
    updateSearchTerm,
    updateVocabSearchTerm,
    updatePinnedFilter,
    updateFavoriteFilter,
    updatePriorityFilter,
    updateStartDate,
    updateEndDate,
    updateSortBy,
    resetFilters,
    addLesson,
    updateLesson,
    isAdding,
    isUpdating,
  };
};
