'use client';

import { use, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import type { ILesson } from '@/modules/lesson/core/models';
import { LessonForm } from '@/modules/lesson/ui/components/LessonForm';
import { useLessonPage } from '@/modules/lesson/ui/hooks';
import { AppHeader } from '@/shared/components';
import { Button } from '@/shared/components/Styled';

import { useLessonDetail } from '@/modules/lesson/ui/hooks/useLessonDetail';
import { Spinner } from '@/shared/components/ui/spinner';
import { Error as ErrorComponent } from '@/shared/components/ui/error';

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

  const { updateLesson, resolvedTheme, locale, setLocale, t, toggleTheme, isUpdating } = useLessonPage();
  const { fetchLessonDetail, lesson: detailedLesson, isLoading, error } = useLessonDetail(params.id);
  const lesson = useMemo(
    () => detailedLesson,
    [detailedLesson]
  );
  useEffect(() => {
    fetchLessonDetail();
  }, [params.id]);

  const handleUpdateLesson = async (updatedLesson: Omit<ILesson, 'id'>) => {
    if (!lesson) {
      return;
    }

    await updateLesson(lesson.id, updatedLesson);
    router.push(`/lessons`);
  };

  /** Shared back-button element used in the header's left slot */
  const backButton = (
    <Button
      type="button"
      onClick={() => router.push(`/lessons`)}
      variant="outline"
      className="flex items-center gap-2 py-2 px-4 cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      {t('Back')}
    </Button>
  );

  /** Shared header props */
  const headerProps = {
    left: backButton,
    showLogout: false as const,
    locale,
    onLocaleChange: setLocale,
    resolvedTheme,
    onToggleTheme: toggleTheme,
  };

  if (isLoading || isUpdating) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-[56rem] mx-auto py-8 px-4 md:px-8">
          <AppHeader {...headerProps} />
          <h1 className="mt-6 mb-2 text-foreground text-3xl font-bold">{t('lesson_not_found')}</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error} onRetry={fetchLessonDetail} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[56rem] mx-auto py-8 px-4 md:px-8">
        <AppHeader {...headerProps} />

        <LessonForm
          t={t}
          title="Edit Lesson"
          description="Update lesson details"
          submitLabel={t('update_lesson_submit')}
          initialLesson={lesson}
          onSubmitLesson={handleUpdateLesson}
          onCancel={() => router.push(`/lessons`)}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
}
