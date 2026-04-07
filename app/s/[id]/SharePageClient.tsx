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

import {
  ShareErrorContainer,
  ShareErrorHeading,
  ShareErrorSub,
  ShareLoadingContainer,
} from './styled';

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
 * Separated from the server page.tsx so that page.tsx can export
 * `generateMetadata` (a server-only feature) alongside this client component.
 *
 * @param props - Resolved lesson UUID
 * @returns The rendered share view, loading spinner, or error state
 */
export default function SharePageClient({
  params: paramsPromise,
}: ISharePageClientProps): React.JSX.Element {
  const params = use(paramsPromise);
  const { t } = useLocale(MESSAGES);
  const { lesson, isLoading, error, fetchPublicLesson } = usePublicLessonDetail(params.id);

  useEffect(() => {
    void fetchPublicLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (isLoading) {
    return (
      <ShareLoadingContainer aria-busy="true" aria-label="Loading lesson">
        <Spinner size={40} />
      </ShareLoadingContainer>
    );
  }

  if (error || !lesson) {
    return (
      <ShareErrorContainer role="alert">
        <BookOpen aria-hidden="true" style={{ width: '3rem', height: '3rem', opacity: 0.4 }} />
        <ShareErrorHeading>{t('lesson_not_found')}</ShareErrorHeading>
        <ShareErrorSub>{error ?? 'The lesson you requested could not be found.'}</ShareErrorSub>
      </ShareErrorContainer>
    );
  }

  return <LessonShareView lesson={lesson} t={t} />;
}
