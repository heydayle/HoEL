'use client';

import { useRouter } from 'next/navigation';

import type { ILesson } from '@/modules/lesson/core/models';
import enMessages from '@/modules/lesson/messages/en.json';
import viMessages from '@/modules/lesson/messages/vi.json';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { useLessonMutations } from '@/modules/lesson/ui/hooks';
import { AppHeader, FullPageLoading } from '@/shared/components';
import { useLocale, useTheme } from '@/shared/hooks';
import type { Locale, TranslationMessages } from '@/shared/types';

/** Locale messages map for the lesson module */
const MESSAGES: Record<Locale, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  vi: viMessages as TranslationMessages,
};

/**
 * Page route for creating a new lesson at /lessons/new.
 * Reuses the existing lesson creation form and navigates back on close.
 * Shows a full-page loading overlay while the lesson is being persisted.
 *
 * Uses `useLessonMutations` instead of `useLessonPage` to avoid
 * fetching the entire lessons list when only the `addLesson` mutation
 * is needed.
 *
 * @returns Create lesson page UI
 */
export default function NewLessonPage(): React.JSX.Element {
  const router = useRouter();
  const { mode, resolvedTheme, setThemeMode } = useTheme();
  const { locale, setLocale, t } = useLocale(MESSAGES);
  const { addLesson, isAdding } = useLessonMutations(t);

  /**
   * Toggles light/dark mode with system-mode awareness.
   */
  const toggleTheme = (): void => {
    if (mode === 'system') {
      setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
      return;
    }
    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  };

  /**
   * Handles lesson creation and navigates to the edit page on success.
   * @param lesson - The lesson data to persist (without `id`)
   */
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

