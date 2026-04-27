'use client';

import { use } from 'react';

import FreePracticeGamePage from '@/modules/free-practice/ui/pages';

/**
 * Route params for the public practice page.
 */
interface IPublicPracticePageProps {
  /** Async route params containing the lesson ID */
  params: Promise<{
    id: string;
  }>;
}

/**
 * Public, unauthenticated Vocabulary Sprint practice page at `/s/[id]/play`.
 *
 * Accessible by anyone without logging in. Vocabulary is fetched via the
 * public share API endpoint using the Supabase anon key.
 *
 * Thin entry point — delegates all rendering to the module-level
 * `FreePracticeGamePage` with `isPublic` set to `true`.
 *
 * @param props - Route params including lesson ID
 * @returns The free-practice game page in public mode
 */
export default function PublicPracticePage({
  params: paramsPromise,
}: IPublicPracticePageProps): React.JSX.Element {
  const params = use(paramsPromise);

  return <FreePracticeGamePage lessonId={params.id} isPublic />;
}
