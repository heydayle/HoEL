'use client';

import { useRouter } from 'next/navigation';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { ControlsGroup, LessonHeaderRow } from '@/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/shared/components';

import { LessonContainer, LessonPageWrapper, LessonSubtitle, LessonTitle } from '@/modules/lesson/ui/pages/styled';

/**
 * Page route for creating a new lesson at /lessons/new.
 * Reuses the existing lesson creation form modal and navigates back on close.
 * @returns Create lesson page UI
 */
export default function NewLessonPage(): React.JSX.Element {
  const router = useRouter();
  const {
    resolvedTheme,
    locale,
    setLocale,
    t,
    toggleTheme,
    addLesson,
  } = useLessonPage();

  const handleAddLesson = (lesson: Omit<ILesson, 'id'>) => {
    addLesson(lesson);
    router.push('/lessons');
  };

  return (
    <LessonPageWrapper>
      <LessonContainer>
        <LessonHeaderRow>
          <div>
            <LessonTitle>{t('create_lesson_title')}</LessonTitle>
            <LessonSubtitle>{t('create_lesson_desc')}</LessonSubtitle>
          </div>

          <ControlsGroup>
            <LocaleSwitcher locale={locale} onLocaleChange={setLocale} />
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          </ControlsGroup>
        </LessonHeaderRow>

        <LessonForm
          t={t}
          title={t('create_lesson_title')}
          description={t('create_lesson_desc')}
          submitLabel={t('create_lesson_submit')}
          onSubmitLesson={handleAddLesson}
          onCancel={() => router.push('/lessons')}
        />
      </LessonContainer>
    </LessonPageWrapper>
  );
}
