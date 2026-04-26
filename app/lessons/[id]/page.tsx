'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useMemo } from 'react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { SummaryLesson } from '@/modules/lesson/ui/components/SummaryLesson';
import enMessages from '@/modules/lesson/messages/en.json';
import viMessages from '@/modules/lesson/messages/vi.json';
import { AppHeader } from '@/shared/components';
import { Button } from '@/shared/components/Styled';

import { useLessonDetail } from '@/modules/lesson/ui/hooks/useLessonDetail';
import { useLessonMutations } from '@/modules/lesson/ui/hooks';
import { useSummaryLesson } from '@/modules/lesson/ui/hooks/useSummaryLesson';
import { FullPageLoading } from '@/shared/components';
import { useLocale, useTheme } from '@/shared/hooks';
import type { Locale, TranslationMessages } from '@/shared/types';
import { Error as ErrorComponent } from '@/shared/components/ui/error';
import { Spinner } from '@/shared/components/ui/spinner';

interface IEditLessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

/** Minimum vocab count required for summary generation */
const MIN_VOCAB_FOR_SUMMARY = 5;

/** Locale messages map for the lesson module */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Page route for editing a lesson at /lessons/[id].
 * Loads the lesson detail including summary and vocabularies.
 * Summary is displayed above the lesson form.
 *
 * After saving with ≥5 vocab, the page triggers summary generation
 * through the `useSummaryLesson` hook, which tracks `isGenerating`
 * state and updates `summary` on completion.
 *
 * Uses `useLessonMutations` instead of `useLessonPage` to avoid
 * fetching the entire lessons list when only mutation functions are needed.
 *
 * @param props - Route params including lesson ID
 * @returns Edit lesson page UI
 */
export default function EditLessonPage({
  params: paramsPromise,
}: IEditLessonPageProps): React.JSX.Element {
  const params = use(paramsPromise);
  const router = useRouter();

  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);
  const { updateLesson, isUpdating } = useLessonMutations(t);
  const {
    fetchLessonDetail,
    lesson: detailedLesson,
    isLoading,
    error,
  } = useLessonDetail(params.id);
  const {
    summary,
    isLoading: isSummaryLoading,
    isGenerating: isSummaryGenerating,
    fetchSummary,
    handleGenerateSummary,
  } = useSummaryLesson(t);

  const lesson = useMemo(() => detailedLesson, [detailedLesson]);

  useEffect(() => {
    fetchLessonDetail();
    fetchSummary(params.id);
  }, [params.id]);


  /**
   * Extracts the word list from a lesson's vocabularies.
   *
   * @param vocabularies - Array of vocabulary entries
   * @returns Filtered array of non-empty words
   */
  const extractWordList = (vocabularies: ILesson['vocabularies']): string[] =>
    (vocabularies ?? []).map((v) => v.word).filter((w) => w.trim() !== '');

  /**
   * Handles lesson update. After a successful save, triggers summary
   * generation through `useSummaryLesson` when the lesson has ≥5 vocab.
   * The hook manages `isGenerating` / `summary` state, giving the
   * SummaryLesson component real-time feedback.
   */
  const handleUpdateLesson = useCallback(
    async (updatedLesson: Omit<ILesson, 'id'>) => {
      if (!lesson) {
        return;
      }

      await updateLesson(lesson.id, updatedLesson);

      /** Refresh the lesson detail to get updated vocab count */
      await fetchLessonDetail();

      /** Trigger summary generation if ≥5 vocab */
      const wordList = (updatedLesson.vocabularies ?? [])
        .filter((v) => v.word.trim() !== '')
        .map((v) => v.word);

      if (wordList.length >= MIN_VOCAB_FOR_SUMMARY) {
        handleGenerateSummary(lesson.id, wordList, summary?.id);
      }
    },
    [lesson, summary?.id, updateLesson, fetchLessonDetail, handleGenerateSummary],
  );

  /**
   * Triggers summary (re)generation for the current lesson
   * using its existing vocabulary words.
   */
  const handleRegenerateSummary = () => {
    if (!lesson) {
      return;
    }

    const wordList = extractWordList(lesson.vocabularies);

    if (wordList.length === 0) {
      return;
    }

    handleGenerateSummary(lesson.id, wordList, summary?.id);
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

  /** Shared back-button element used in the header's left slot */
  const backButton = (
    <Button
      type="button"
      onClick={() => router.push(`/lessons`)}
      variant="outline"
      className="flex items-center gap-2 py-2 px-4 cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      {t('Back')}
    </Button>
  );

  /** Shared header props */
  const headerProps = {
    left: backButton,
    showLogout: false as const,
    locale,
    onLocaleChange: setLocale,
    resolvedTheme,
    onToggleTheme: toggleTheme,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-[56rem] mx-auto py-8 px-4 md:px-8">
          <AppHeader {...headerProps} />
          <h1 className="mt-6 mb-2 text-foreground text-3xl font-bold">{t('lesson_not_found')}</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error} onRetry={fetchLessonDetail} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isUpdating && (
        <FullPageLoading message={t('updating_lesson')} hint={t('updating_lesson_hint')} />
      )}
      <div className="max-w-[56rem] mx-auto py-8 px-4 md:px-8">
        <AppHeader {...headerProps} />

        {/* Summary section — displayed above the form */}
        <div className="mt-6 mb-4">
          <SummaryLesson
            summary={summary}
            isLoading={isSummaryLoading}
            isGenerating={isSummaryGenerating}
            t={t}
            onRegenerate={handleRegenerateSummary}
            onReload={() => fetchSummary(params.id)}
            showProcessingState={isSummaryGenerating}
            vocabCount={lesson?.vocabularies?.length ?? 0}
          />
        </div>

        <LessonForm
          t={t}
          title="Edit Lesson"
          description="Update lesson details"
          submitLabel={t('update_lesson_submit')}
          initialLesson={lesson}
          onSubmitLesson={handleUpdateLesson}
          onCancel={() => router.push(`/lessons`)}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
}
