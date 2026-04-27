import { NextRequest, NextResponse } from 'next/server';

import type { IVocabulary } from '@/modules/lesson/core/models';
import { supabasePublic } from '@/shared/utils/supabase/admin';

/**
 * GET /api/share/[id]/vocab
 *
 * Public, unauthenticated endpoint that returns only the vocabulary list
 * for a given lesson. Used by the public Vocabulary Sprint practice game
 * at `/s/[id]/play` so anonymous users can play without logging in.
 *
 * Requires RLS SELECT policies that grant the `anon` role access to the
 * `vocabularies` table filtered by `lesson_id`.
 *
 * @param _request - Incoming Next.js request (unused)
 * @param context  - Route context containing the dynamic `id` param
 * @returns JSON array of IVocabulary objects, or an appropriate error response
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabasePublic
      .from('vocabularies')
      .select('*')
      .eq('lesson_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`[public-vocab-api] Supabase error for lesson ${id}:`, error);
      return NextResponse.json({ error: 'Failed to fetch vocabulary.' }, { status: 500 });
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;

    const vocabularies: IVocabulary[] = rows.map((v) => ({
      id: v.id as string,
      word: (v.word as string) ?? '',
      ipa: (v.ipa as string) ?? '',
      partOfSpeech: (v.partOfSpeech as string) ?? '',
      meaning: (v.meaning as string) ?? '',
      translation: (v.translation as string) ?? '',
      pronunciation: (v.pronunciation as string) ?? '',
      example: (v.example as string) ?? '',
    }));

    return NextResponse.json({ vocabularies });
  } catch (err: unknown) {
    console.error('[public-vocab-api] Unexpected error:', err);
    return NextResponse.json(
      { error: (err as Error).message ?? 'Internal Server Error' },
      { status: 500 },
    );
  }
}
