'use client';

import React from 'react';

import { Skeleton } from '@/shared/components/Styled';

/**
 * Props for the {@link VocabCardSkeleton} component.
 */
interface IVocabCardSkeletonProps {
  /** The word currently being generated — displayed as a label on the skeleton. */
  loadingWord?: string;
  /** Translation function for i18n strings. */
  t: (key: string) => string;
}

/**
 * Animated skeleton placeholder that mirrors the layout of a vocabulary
 * card inside the {@link LessonForm}.  Displayed while the AI generates
 * data for a new word.
 *
 * @param props - Component props.
 * @returns Rendered skeleton card.
 */
export function VocabCardSkeleton({
  loadingWord,
  t,
}: IVocabCardSkeletonProps): React.JSX.Element {
  return (
    <div
      data-testid="vocab-card-skeleton"
      className="flex flex-col gap-3 border-2 border-brutal-black rounded-[calc(var(--rounded-bento)*0.6)] bg-card p-4 shadow-[var(--shadow-brutal-sm)] animate-pulse"
    >
      {/* Header row */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold border-2 border-brutal-black bg-lemon py-1 px-2 pr-8 text-brutal-black rounded-full">
          {loadingWord
            ? `${t('vocab_loading_word')}: ${loadingWord}`
            : t('vocab_loading')}
        </span>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

      {/* Row 1 — Word · IPA · PoS · Pronunciation */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      {/* Translation */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Meaning */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-[52px] w-full" />
      </div>

      {/* Example */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-[52px] w-full" />
      </div>
    </div>
  );
}
