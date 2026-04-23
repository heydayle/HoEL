import type { ILessonStats } from '@/modules/lesson/core/models';

/**
 * Props for the LessonStatsGrid component.
 */
interface ILessonStatsGridProps {
  /** Summary statistics for filtered lessons */
  stats: ILessonStats;
  /** Translation function */
  t: (key: string) => string;
}

/**
 * Minimal stats bar displaying lesson and vocabulary counts as inline badges.
 *
 * @param props - Component props
 * @returns The rendered stats bar
 */
export function LessonStatsGrid({ stats, t }: ILessonStatsGridProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border-2 border-brutal-black bg-card text-sm font-bold shadow-[var(--shadow-brutal-sm)]">
        <span className="text-foreground-secondary">{t('stats_lessons')}</span>
        <span className="text-foreground">{stats.totalLessons}</span>
      </span>
      <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border-2 border-brutal-black bg-lemon text-sm font-bold shadow-[var(--shadow-brutal-sm)]">
        <span className="text-black">{t('stats_vocab')}</span>
        <span className="text-black">{stats.totalVocabularies}</span>
      </span>
    </div>
  );
}
