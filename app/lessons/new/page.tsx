'use client';

import { useRouter } from 'next/navigation';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { AppHeader, FullPageLoading } from '@/shared/components';

/**
 * Page route for creating a new lesson at /lessons/new.
 * Reuses the existing lesson creation form and navigates back on close.
 * Shows a full-page loading overlay while the lesson is being persisted.
 * @returns Create lesson page UI
 */
export default function NewLessonPage(): React.JSX.Element {
  const router = useRouter();
  const { resolvedTheme, locale, setLocale, t, toggleTheme, addLesson, isAdding } = useLessonPage();

  const handleAddLesson = async (lesson: Omit<ILesson, 'id'>) => {
    const lessonId = await addLesson(lesson);

    if (lessonId) {
      router.push(`/lessons/${lessonId}`);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-background text-foreground md:py-10 md:px-8">
      {isAdding && (
        <FullPageLoading
          message={t('creating_lesson')}
          hint={t('creating_lesson_hint')}
        />
      )}

      <div className="w-full max-w-[60rem] !mx-auto flex flex-col gap-4">
        <AppHeader
          left={
            <div>
              <h1 className="m-0 text-3xl leading-tight">{t('create_lesson_title')}</h1>
              <p className="m-0 text-foreground-secondary leading-relaxed">
                {t('create_lesson_desc')}
              </p>
            </div>
          }
          showLogout={false}
          locale={locale}
          onLocaleChange={setLocale}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
        />

        <LessonForm
          t={t}
          title={t('create_lesson_title')}
          description={t('create_lesson_desc')}
          submitLabel={t('create_lesson_submit')}
          onSubmitLesson={handleAddLesson}
          onCancel={() => router.push('/lessons')}
        />
      </div>
    </main>
  );
}
