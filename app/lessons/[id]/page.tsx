'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useMemo, useState } from 'react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { SummaryLesson } from '@/modules/lesson/ui/components/SummaryLesson';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { AppHeader } from '@/shared/components';
import { Button } from '@/shared/components/Styled';

import { useLessonDetail } from '@/modules/lesson/ui/hooks/useLessonDetail';
import { useSummaryLesson } from '@/modules/lesson/ui/hooks/useSummaryLesson';
import { FullPageLoading } from '@/shared/components';
import { Error as ErrorComponent } from '@/shared/components/ui/error';
import { Spinner } from '@/shared/components/ui/spinner';

interface IEditLessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

/** Minimum vocab count required for summary generation */
const MIN_VOCAB_FOR_SUMMARY = 5;

/** Polling interval (ms) to check for summary after background generation */
const SUMMARY_POLL_INTERVAL_MS = 5000;

/** Maximum number of polling attempts before giving up */
const SUMMARY_POLL_MAX_ATTEMPTS = 12;

/**
 * Page route for editing a lesson at /lessons/[id].
 * Loads the lesson detail including summary and vocabularies.
 * Summary is displayed above the lesson form.
 *
 * After saving with ≥5 vocab, the page polls for the summary
 * until it appears (Case 2: user stays on screen).
 *
 * @param props - Route params including lesson ID
 * @returns Edit lesson page UI
 */
export default function EditLessonPage({
  params: paramsPromise,
}: IEditLessonPageProps): React.JSX.Element {
  const params = use(paramsPromise);
  const router = useRouter();

  const { updateLesson, resolvedTheme, locale, setLocale, t, toggleTheme, isUpdating } =
    useLessonPage();
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

  /**
   * Tracks whether a summary generation was just triggered by saving.
   * Controls the "processing" state in the SummaryLesson component.
   */
  const [isSummaryPending, setIsSummaryPending] = useState(false);

  useEffect(() => {
    fetchLessonDetail();
    fetchSummary(params.id);
  }, [params.id]);

  /**
   * Polls for summary after background generation.
   * Stops when the summary is found or max attempts are reached.
   * (Case 2: user stays on the edit screen)
   */
  useEffect(() => {
    if (!isSummaryPending) {
      return;
    }

    let attempt = 0;
    const intervalId = setInterval(async () => {
      attempt += 1;
      await fetchSummary(params.id);

      /** Stop polling — summary was fetched or max attempts reached */
      if (attempt >= SUMMARY_POLL_MAX_ATTEMPTS) {
        clearInterval(intervalId);
        setIsSummaryPending(false);
      }
    }, SUMMARY_POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isSummaryPending, params.id, fetchSummary]);

  /** Stop polling once the summary has arrived */
  useEffect(() => {
    if (summary && isSummaryPending) {
      setIsSummaryPending(false);
    }
  }, [summary, isSummaryPending]);

  /**
   * Handles lesson update, passing the existing summary_id so the
   * summary is regenerated (updated) rather than duplicated.
   * After saving, enables the polling state if ≥5 vocab.
   */
  const handleUpdateLesson = useCallback(
    async (updatedLesson: Omit<ILesson, 'id'>) => {
      if (!lesson) {
        return;
      }

      await updateLesson(lesson.id, updatedLesson, summary?.id);

      /** Refresh the lesson detail to get updated vocab count */
      await fetchLessonDetail();

      /** If ≥5 vocab, start polling for the background-generated summary */
      const vocabCount = (updatedLesson.vocabularies ?? []).filter(
        (v) => v.word.trim() !== '',
      ).length;

      if (vocabCount >= MIN_VOCAB_FOR_SUMMARY) {
        setIsSummaryPending(true);
      }
    },
    [lesson, summary?.id, updateLesson, fetchLessonDetail],
  );

  /**
   * Triggers summary (re)generation for the current lesson
   * using its existing vocabulary words.
   */
  const handleRegenerateSummary = () => {
    if (!lesson) {
      return;
    }

    const wordList = (lesson.vocabularies ?? []).map((v) => v.word).filter((w) => w.trim() !== '');

    if (wordList.length === 0) {
      return;
    }

    handleGenerateSummary(lesson.id, wordList, summary?.id);
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
            showProcessingState={isSummaryPending || isSummaryGenerating}
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
