'use client';

import { useRouter } from 'next/navigation';

import type { ILesson } from '@/app/modules/lesson/core/models';
import { CreateLessonModal } from '@/app/modules/lesson/ui/components/CreateLessonModal';
import { ControlsGroup, LessonHeaderRow } from '@/app/modules/lesson/ui/components/styled';
import { useLessonPage } from '@/app/modules/lesson/ui/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/app/shared/components';

import { LessonContainer, LessonPageWrapper, LessonSubtitle, LessonTitle } from '@/app/modules/lesson/ui/pages/styled';

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

        <CreateLessonModal
          t={t}
          onAddLesson={handleAddLesson}
          onClose={() => router.push('/lessons')}
          defaultOpen
          hideTrigger
        />
      </LessonContainer>
    </LessonPageWrapper>
  );
}
