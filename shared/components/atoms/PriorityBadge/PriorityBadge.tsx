import React from 'react';

import type { LessonPriority } from '@/modules/lesson/core/models';

/**
 * Colour variant key for priority and part-of-speech badges.
 */
export type PriorityVariant = 'low' | 'medium' | 'high' | 'pos';

/**
 * Foreground colour map for each priority variant.
 */
const PRIORITY_COLORS: Record<PriorityVariant, string> = {
  low: 'hsl(150, 60%, 40%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 72%, 51%)',
  pos: 'hsl(var(--primary))',
};

/**
 * Background colour map for each priority variant.
 */
const PRIORITY_BG_COLORS: Record<PriorityVariant, string> = {
  low: 'rgba(34,197,110,0.12)',
  medium: 'rgba(234,179,8,0.12)',
  high: 'rgba(239,68,68,0.12)',
  pos: 'hsl(var(--primary) / 0.12)',
};

/**
 * Resolves a `LessonPriority` value to its corresponding variant key.
 *
 * @param priority - Priority value from the lesson model
 * @returns Lowercased variant key
 */
export const resolvePriorityVariant = (priority: LessonPriority): PriorityVariant =>
  priority.toLowerCase() as PriorityVariant;

/**
 * Props for the PriorityBadge component.
 */
interface IPriorityBadgeProps {
  /** The display label inside the badge */
  label: string;
  /** Visual colour variant */
  variant: PriorityVariant;
  /** Optional additional CSS class names */
  className?: string;
}

/**
 * Reusable coloured badge for displaying lesson priority or part-of-speech.
 * Encapsulates the shared colour palette and consistent styling used
 * across LessonOverview, LessonDetailModal, and LessonShareView.
 *
 * @param props - Component props
 * @returns Styled priority badge element
 *
 * @example
 * ```tsx
 * <PriorityBadge label={lesson.priority} variant={resolvePriorityVariant(lesson.priority)} />
 * <PriorityBadge label={vocab.partOfSpeech} variant="pos" />
 * ```
 */
export function PriorityBadge({
  label,
  variant,
  className = '',
}: IPriorityBadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center py-[0.15rem] px-[0.55rem] rounded-full text-[0.72rem] font-semibold tracking-[0.04em] ${className}`}
      style={{
        color: PRIORITY_COLORS[variant],
        background: PRIORITY_BG_COLORS[variant],
        border: `1px solid ${PRIORITY_COLORS[variant]}33`,
      }}
    >
      {label}
    </span>
  );
}
