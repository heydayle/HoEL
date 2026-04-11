'use client';

import { BookOpen } from 'lucide-react';
import { use, useEffect } from 'react';

import { Spinner } from '@/shared/components/ui/spinner';
import enMessages from '@/modules/lesson/messages/en.json';
import viMessages from '@/modules/lesson/messages/vi.json';
import { usePublicLessonDetail } from '@/modules/lesson/ui/hooks/usePublicLessonDetail';
import { LessonShareView } from '@/modules/lesson/ui/pages/LessonShareView';
import { useLocale } from '@/shared/hooks';
import type { Locale, TranslationMessages } from '@/shared/types';

/** Locale messages map for the lesson module */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

interface ISharePageClientProps {
  /** Lesson UUID resolved from the URL params */
  params: Promise<{ id: string }>;
}

/**
 * Client component for the public share page.
 * Handles data fetching state, loading and error UI, and renders LessonShareView.
 *
 * @param props - Resolved lesson UUID
 * @returns The rendered share view, loading spinner, or error state
 */
export default function SharePageClient({
  params: paramsPromise,
}: ISharePageClientProps): React.JSX.Element {
  const params = use(paramsPromise);
  const { t } = useLocale(MESSAGES);
  const { lesson, summary, isLoading, error, fetchPublicLesson } = usePublicLessonDetail(params.id);

  useEffect(() => {
    void fetchPublicLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" aria-busy="true" aria-label="Loading lesson">
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen p-8 bg-background text-foreground text-center" role="alert">
        <BookOpen aria-hidden="true" className="w-12 h-12 opacity-40" />
        <h1 className="m-0 text-2xl font-bold text-foreground">{t('lesson_not_found')}</h1>
        <p className="m-0 text-[0.95rem] text-foreground-secondary max-w-[28rem] leading-relaxed">{error ?? 'The lesson you requested could not be found.'}</p>
      </div>
    );
  }

  return <LessonShareView lesson={lesson} summary={summary} t={t} />;
}
