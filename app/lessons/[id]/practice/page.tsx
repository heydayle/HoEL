'use client';

import { use } from 'react';

import FreePracticeGamePage from '@/modules/free-practice/ui/pages';

/**
 * Route params for the practice page.
 */
interface IPracticePageProps {
  /** Async route params containing the lesson ID */
  params: Promise<{
    id: string;
  }>;
}

/**
 * Next.js App Router page at `/lessons/[id]/practice`.
 *
 * Thin entry point that extracts the lesson `id` from the URL params
 * and delegates rendering to the module-level `FreePracticeGamePage`.
 *
 * @param props - Route params including lesson ID
 * @returns The free-practice game page for the specified lesson
 */
export default function PracticePage({
  params: paramsPromise,
}: IPracticePageProps): React.JSX.Element {
  const params = use(paramsPromise);

  return <FreePracticeGamePage lessonId={params.id} />;
}
