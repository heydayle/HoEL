'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { ControlsGroup, LessonHeaderRow } from '@/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/shared/components';

import { BackButton, DetailPageContainer, DetailPageWrapper, LessonTitle } from './styled';

interface IEditLessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Page route for editing a lesson at /lessons/[id]/edit.
 * @param props - Route params including lesson ID
 * @returns Edit lesson page UI
 */
export default function EditLessonPage({ params: paramsPromise }: IEditLessonPageProps): React.JSX.Element {
  const params = use(paramsPromise);
  const router = useRouter();

  const { displayedLessons, updateLesson, resolvedTheme, locale, setLocale, t, toggleTheme } = useLessonPage();
  const lesson = useMemo(
    () => displayedLessons.find((item) => item.id === params.id) ?? null,
    [displayedLessons, params.id]
  );

  const handleUpdateLesson = async (updatedLesson: Omit<ILesson, 'id'>) => {
    if (!lesson) {
      return;
    }

    await updateLesson(lesson.id, updatedLesson);
    router.push(`/lessons`);
  };

  if (!lesson) {
    return (
      <DetailPageWrapper>
        <DetailPageContainer>
          <LessonHeaderRow>
            <BackButton type="button" onClick={() => router.push(`/lessons`)}>
              <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {t('Back')}
            </BackButton>

            <ControlsGroup>
              <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
              <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
            </ControlsGroup>
          </LessonHeaderRow>

          <LessonTitle>{t('lesson_not_found')}</LessonTitle>
        </DetailPageContainer>
      </DetailPageWrapper>
    );
  }

  return (
    <DetailPageWrapper>
      <DetailPageContainer>
        <LessonHeaderRow>
          <BackButton type="button" onClick={() => router.push(`/lessons`)}>
            <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            {t('Back')}
          </BackButton>

          <ControlsGroup>
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          </ControlsGroup>
        </LessonHeaderRow>

        <LessonForm
          t={t}
          title="Edit Lesson"
          description="Update lesson details"
          submitLabel={t('update_lesson_submit')}
          initialLesson={lesson}
          onSubmitLesson={handleUpdateLesson}
          onCancel={() => router.push(`/lessons`)}
        />
      </DetailPageContainer>
    </DetailPageWrapper>
  );
}
