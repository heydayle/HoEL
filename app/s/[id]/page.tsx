'use client';

import { BookOpen } from 'lucide-react';
import { use, useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';
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

interface IPublicSharePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Public, unauthenticated share view for a single lesson.
 * Accessible at `/s/[id]`. Read-only — no editing allowed.
 *
 * @param props - Route params including the lesson UUID
 * @returns The public lesson share view UI
 */
export default function PublicLessonSharePage({
  params: paramsPromise,
}: IPublicSharePageProps): React.JSX.Element {
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
