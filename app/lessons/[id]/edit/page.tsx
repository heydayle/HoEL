'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import type { ILesson } from '@/app/modules/lesson/core/models';
import { LessonForm } from '@/app/modules/lesson/ui/components/LessonForm';
import { ControlsGroup, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';

import { BackButton, DetailPageContainer, DetailPageWrapper, LessonTitle } from '../../[id]/styled';

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

  const handleUpdateLesson = (updatedLesson: Omit<ILesson, 'id'>) => {
    if (!lesson) {
      return;
    }

    updateLesson(lesson.id, updatedLesson);
    router.push(`/lessons/${lesson.id}`);
  };

  if (!lesson) {
    return (
      <DetailPageWrapper>
        <DetailPageContainer>
          <LessonHeaderRow>
            <BackButton type="button" onClick={() => router.push('/lessons')}>
              <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {t('back_to_lessons')}
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
          <BackButton type="button" onClick={() => router.push(`/lessons/${lesson.id}`)}>
            <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            {t('back_to_lessons')}
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
          onCancel={() => router.push(`/lessons/${lesson.id}`)}
        />
      </DetailPageContainer>
    </DetailPageWrapper>
  );
}
