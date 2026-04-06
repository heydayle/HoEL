import { NextRequest, NextResponse } from 'next/server';

import type { ILesson, IVocabulary } from '@/modules/lesson/core/models';
import { supabasePublic } from '@/shared/utils/supabase/admin';

/**
 * Maps a raw Supabase vocabulary row into the app's IVocabulary shape.
 *
 * @param v - Raw vocabulary row from Supabase
 * @returns Typed IVocabulary object
 */
function mapVocabRow(v: Record<string, unknown>): IVocabulary {
  return {
    id: v.id as string,
    word: (v.word as string) ?? '',
    ipa: (v.ipa as string) ?? '',
    partOfSpeech: (v.partOfSpeech as string) ?? '',
    meaning: (v.meaning as string) ?? '',
    translation: (v.translation as string) ?? '',
    pronunciation: (v.pronunciation as string) ?? '',
    example: (v.example as string) ?? '',
  };
}

/**
 * GET /api/share/[id]
 *
 * Public, unauthenticated endpoint that returns a single lesson with its
 * vocabulary entries. Uses `createPublicClient` (anon key) server-side.
 *
 * Requires Supabase RLS policies that allow the `anon` role to SELECT
 * from `lessons` and `vocabularies` tables.
 *
 * @param _request - Incoming Next.js request (unused — ID comes from params)
 * @param context  - Route context containing the dynamic `id` param
 * @returns JSON response with the lesson data or an appropriate error
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
      .from('lessons')
      .select('*, vocabularies(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`[share-api] Supabase error for lesson ${id}:`, error);
      return NextResponse.json({ error: 'Failed to fetch lesson.' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
    }

    const vocabRows = (data.vocabularies ?? []) as Array<Record<string, unknown>>;

    const lesson: ILesson = {
      id: data.id as string,
      date: data.date as string,
      topic: data.topic as string,
      participantName: data.participantName as string,
      isPinned: data.isPinned as boolean,
      isFavorite: data.isFavorite as boolean,
      priority: data.priority as ILesson['priority'],
      notes: (data.notes as string) ?? '',
      createdBy: (data.createdBy as string) ?? undefined,
      vocabularies: vocabRows.map(mapVocabRow),
    };

    return NextResponse.json(lesson);
  } catch (err: unknown) {
    console.error('[share-api] Unexpected error:', err);
    return NextResponse.json(
      { error: (err as Error).message ?? 'Internal Server Error' },
      { status: 500 },
    );
  }
}
