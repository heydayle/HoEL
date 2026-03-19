'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';

import type { ILesson } from '@/app/modules/lesson/core/models';
import { LessonDetailModal } from '@/app/modules/lesson/ui/components/LessonDetailModal';
import { ControlsGroup, EditLessonButton, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import enMessages from '@/app/modules/lesson/messages/en.json';
import viMessages from '@/app/modules/lesson/messages/vi.json';
import { useLocale, useTheme } from '@/app/shared/hooks';
import type { Locale, TranslationMessages } from '@/app/shared/types';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';
import { useRouter } from 'next/navigation';

import { BackButton, DetailPageContainer, DetailPageWrapper, LessonTitle } from './styled';

/**
 * Locale messages map for the lesson module.
 */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

interface ILessonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Lesson detail page component.
 * Displays full details of a single lesson from route params.
 * @param props - Component props with lesson ID from route params
 * @returns Lesson detail page UI
 */
export default function LessonDetailPage({ params: paramsPromise }: ILessonDetailPageProps): React.JSX.Element {
  const params = use(paramsPromise);
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);
  const { displayedLessons } = useLessonPage();

  const router = useRouter();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Find lesson from displayedLessons by ID
        const foundLesson = displayedLessons.find((l) => l.id === params.id);
        if (foundLesson) {
          setLesson(foundLesson);
          setError(null);
        } else {
          setError('Lesson not found');
          setLesson(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params.id, displayedLessons]);

  const handleGoBack = () => {
    router.push('/lessons');
  };

  if (loading) {
    return (
      <DetailPageWrapper>
        <DetailPageContainer>
          <p>{t('loading')}</p>
        </DetailPageContainer>
      </DetailPageWrapper>
    );
  }

  if (error || !lesson) {
    return (
      <DetailPageWrapper>
        <DetailPageContainer>
          <LessonHeaderRow>
            <BackButton type="button" onClick={handleGoBack}>
              <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {t('back_to_lessons')}
            </BackButton>

            <ControlsGroup>
              <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
              <ThemeToggle resolvedTheme={resolvedTheme} onToggle={() => setThemeMode(resolvedTheme === 'light' ? 'dark' : 'light')} />
            </ControlsGroup>
          </LessonHeaderRow>

          <div>
            <LessonTitle>{t(error ? 'error' : 'lesson_not_found')}</LessonTitle>
          </div>
        </DetailPageContainer>
      </DetailPageWrapper>
    );
  }

  return (
    <DetailPageWrapper>
      <DetailPageContainer>
        <LessonHeaderRow>
          <BackButton type="button" onClick={handleGoBack}>
            <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            {t('back_to_lessons')}
          </BackButton>

          <ControlsGroup>
            <EditLessonButton
              onClick={() => router.push(`/lessons/${lesson.id}/edit`)}
              title="Edit lesson"
              aria-label="Edit lesson"
            >
              <Pencil style={{ width: '1rem', height: '1rem' }} />
            </EditLessonButton>
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={() => setThemeMode(resolvedTheme === 'light' ? 'dark' : 'light')} />
          </ControlsGroup>
        </LessonHeaderRow>

        <LessonDetailModal lesson={lesson} t={t} onClose={() => {}} />
      </DetailPageContainer>
    </DetailPageWrapper>
  );
}
