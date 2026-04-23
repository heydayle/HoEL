import React from 'react';

import type { LessonPriority } from '@/modules/lesson/core/models';

/**
 * Colour variant key for priority and part-of-speech badges.
 */
export type PriorityVariant = 'low' | 'medium' | 'high' | 'pos';

/**
 * Foreground colour map for each priority variant (Neo-Brutalism high-contrast).
 */
const PRIORITY_COLORS: Record<PriorityVariant, string> = {
  low: '#166534',
  medium: '#92400E',
  high: '#991B1B',
  pos: '#0D0D0D',
};

/**
 * Background colour map for each priority variant (Neo-Brutalism solid fills).
 */
const PRIORITY_BG_COLORS: Record<PriorityVariant, string> = {
  low: '#BBF7D0',
  medium: '#FDE68A',
  high: '#FECACA',
  pos: '#F0EBE3',
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
 * Neo-Brutalism coloured badge for displaying lesson priority or part-of-speech.
 * Features thick black border, pill shape, and high-contrast solid fill colours.
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
      className={`inline-flex items-center py-[0.15rem] px-[0.55rem] rounded-full border-2 border-brutal-black text-[0.72rem] font-bold tracking-[0.04em] ${className}`}
      style={{
        color: PRIORITY_COLORS[variant],
        background: PRIORITY_BG_COLORS[variant],
      }}
    >
      {label}
    </span>
  );
}
