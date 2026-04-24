import type { ILesson, ILessonStats, LessonPriority } from '@/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/modules/lesson/core/usecases';
import { motion } from 'framer-motion';
import { Check, Pencil, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { PriorityBadge, resolvePriorityVariant } from '@/shared/components';
import Spinner from '@/shared/components/ui/spinner';

import { LessonFilterPanel } from './LessonFilterPanel';
import { LessonStatsGrid } from './LessonStatsGrid';

/**
 * Props for LessonOverview component.
 */
interface ILessonOverviewProps {
  /** Loading state */
  loading: boolean;
  /** Summary statistics for filtered lessons */
  stats: ILessonStats;
  /** Lessons to render in list */
  lessons: ILesson[];
  /** Active filters */
  filters: ILessonFilterInput;
  /** Translation function */
  t: (key: string) => string;
  /** Search updater */
  onSearchTermChange: (value: string) => void;
  /** Vocabulary keyword filter updater */
  onVocabSearchTermChange: (value: string) => void;
  /** Pinned filter updater */
  onPinnedFilterChange: (checked: boolean) => void;
  /** Favorite filter updater */
  onFavoriteFilterChange: (checked: boolean) => void;
  /** Priority filter updater */
  onPriorityFilterChange: (value: LessonPriority | 'all') => void;
  /** Start date filter updater */
  onStartDateChange: (value: string) => void;
  /** End date filter updater */
  onEndDateChange: (value: string) => void;
  /** Sort updater */
  onSortChange: (value: LessonSortOption) => void;
  /** Reset filters handler */
  onResetFilters: () => void;
  /** Lesson selection handler */
  onSelectLesson: (lesson: ILesson) => void;
  /** Edit lesson handler */
  onEditLesson: (lesson: ILesson) => void;
}

/** Spring physics config */
const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 300, damping: 20 };

/**
 * Neo-Brutalism lesson overview with Bento grid layout.
 * Composes {@link LessonStatsGrid}, {@link LessonFilterPanel},
 * and the lesson card list with spring hover animations.
 *
 * @param props - Component props
 * @returns Lessons list section with stats, filters, and cards
 */
export function LessonOverview({
  loading,
  stats,
  lessons,
  filters,
  t,
  onSearchTermChange,
  onVocabSearchTermChange,
  onPinnedFilterChange,
  onFavoriteFilterChange,
  onPriorityFilterChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onResetFilters,
  onSelectLesson,
  onEditLesson,
}: ILessonOverviewProps): React.JSX.Element {
  /** Tracks which lesson ID (if any) just had its share link copied */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /**
   * Copies the public share URL for `lesson` to the clipboard.
   * Shows a brief copied indicator, then resets after 2 s.
   *
   * @param e - Click event (stopped to prevent card navigation)
   * @param lesson - The lesson whose share link is being copied
   */
  const handleShareLesson = async (e: React.MouseEvent, lesson: ILesson): Promise<void> => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/s/${lesson.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedId(lesson.id);
    toast.success(t('share_link_copied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <LessonStatsGrid stats={stats} t={t} />

      <LessonFilterPanel
        filters={filters}
        t={t}
        onSearchTermChange={onSearchTermChange}
        onVocabSearchTermChange={onVocabSearchTermChange}
        onPinnedFilterChange={onPinnedFilterChange}
        onFavoriteFilterChange={onFavoriteFilterChange}
        onPriorityFilterChange={onPriorityFilterChange}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
      />

      {/* Lessons List — Bento Grid with stagger */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner className="mx-auto mt-4" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="m-0 py-4 px-5 rounded-[var(--rounded-bento)] border-2 border-dashed border-brutal-black text-foreground-secondary font-medium">
            {t('empty_state')}
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_TRANSITION, delay: index * 0.06 }}
                whileHover={{ y: -4, x: -4, boxShadow: 'var(--shadow-brutal-md)' }}
                whileTap={{ y: 1, x: 1, boxShadow: 'none' }}
                onClick={() => onSelectLesson(lesson)}
                className="p-5 cursor-pointer rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-card shadow-[var(--shadow-brutal-sm)] transition-colors"
              >
                <div className="flex items-start justify-end gap-3 pb-2">
                  <div className="flex items-center justify-between w-full gap-2">
                    <PriorityBadge
                      label={lesson.priority}
                      variant={resolvePriorityVariant(lesson.priority)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditLesson(lesson);
                        }}
                        title="Edit lesson"
                        aria-label="Edit lesson"
                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground cursor-pointer shadow-[var(--shadow-brutal-sm)] transition-all duration-200 shrink-0 hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:shadow-none"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => void handleShareLesson(e, lesson)}
                        title={t('share_link_label')}
                        aria-label={t('share_link_label')}
                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground cursor-pointer shadow-[var(--shadow-brutal-sm)] transition-all duration-200 shrink-0 hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:shadow-none"
                      >
                        {copiedId === lesson.id ? (
                          <Check className="w-3.5 h-3.5 text-green" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="m-0 text-foreground text-lg font-extrabold line-clamp-2">
                    {lesson.topic}
                  </h2>
                  <p className="mt-1.5 text-foreground-secondary text-[0.9rem] font-medium">
                    {t('participant_label')}: {lesson.participantName}
                  </p>
                  <p className="mt-1.5 text-foreground-secondary text-[0.9rem] font-medium">
                    {t('date_label')}: {new Date(lesson.date).toLocaleDateString()}
                  </p>
                </div>

                <p className="mt-3 text-foreground leading-relaxed font-medium">{lesson.notes}</p>
                <p className="mt-1.5 text-foreground-secondary text-[0.9rem] font-medium">
                  {t('vocab_count')}: {lesson?.vocabularies?.length}
                </p>
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
