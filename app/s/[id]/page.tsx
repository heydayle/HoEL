import type { Metadata } from 'next';

import { supabasePublic } from '@/shared/utils/supabase/admin';

import SharePageClient from './SharePageClient';

interface IPublicSharePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetches minimal lesson metadata for use in `generateMetadata`.
 * Uses the public Supabase client (anon key) — requires RLS SELECT policy for anon.
 *
 * @param id - Lesson UUID
 * @returns Partial lesson fields needed for meta tags, or null if not found
 */
async function fetchLessonMeta(
  id: string,
): Promise<{ topic: string; participantName: string; vocabulariesCount: number } | null> {
  const { data } = await supabasePublic
    .from('lessons')
    .select('topic, participantName, vocabularies(id)')
    .eq('id', id)
    .maybeSingle();

  if (!data) return null;

  const vocabRows = (data.vocabularies ?? []) as Array<{ id: string }>;

  return {
    topic: (data.topic as string) ?? 'Shared Lesson',
    participantName: (data.participantName as string) ?? '',
    vocabulariesCount: vocabRows.length,
  };
}

/**
 * Generates dynamic `<head>` metadata for the public share page.
 * Used by Next.js for SSR-rendered meta tags (title, description, Open Graph, Twitter).
 *
 * @param props - Route params including the lesson ID
 * @returns Next.js Metadata object with dynamic values from the lesson
 */
export async function generateMetadata({ params }: IPublicSharePageProps): Promise<Metadata> {
  const { id } = await params;
  const meta = await fetchLessonMeta(id);

  if (!meta) {
    return {
      title: 'Lesson Not Found | HoEL',
      description: 'The lesson you are looking for could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const { topic, participantName, vocabulariesCount } = meta;

  const title = `${topic} | HoEL`;
  const description = participantName
    ? `Shared lesson with ${participantName} — ${vocabulariesCount} vocabulary item${vocabulariesCount !== 1 ? 's' : ''}. View on History of English Learning.`
    : `${vocabulariesCount} vocabulary item${vocabulariesCount !== 1 ? 's' : ''} on "${topic}". View on History of English Learning.`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      siteName: 'HoEL – History of English Learning',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Public, unauthenticated share page for a single lesson.
 * Accessible at `/s/[id]`. Read-only — no editing allowed.
 *
 * This is a Server Component so it can export `generateMetadata`.
 * All interactive/stateful logic is delegated to `SharePageClient`.
 *
 * @param props - Route params including the lesson UUID
 * @returns The rendered share page
 */
export default function PublicLessonSharePage({ params }: IPublicSharePageProps): React.JSX.Element {
  return <SharePageClient params={params} />;
}
