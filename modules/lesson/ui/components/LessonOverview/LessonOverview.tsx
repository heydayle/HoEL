import type { ILesson, ILessonStats, LessonPriority } from '@/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/modules/lesson/core/usecases';
import { Check, Pencil, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { PriorityBadge, resolvePriorityVariant } from '@/shared/components';
import { Card, Input } from '@/shared/components/Styled';
import Spinner from '@/shared/components/ui/spinner';

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
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 20 };

/**
 * Neo-Brutalism lesson overview with Bento grid layout.
 * Features thick bordered cards, solid shadows, and spring hover animations.
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
      {/* Stats Grid — Bento */}
      <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        <div className="p-4 px-5 rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-card shadow-[var(--shadow-brutal-sm)]">
          <p className="m-0 text-foreground-secondary text-sm font-bold">{t('stats_lessons')}</p>
          <p className="mt-1 text-foreground text-2xl font-extrabold">{stats.totalLessons}</p>
        </div>
        <div className="p-4 px-5 rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-lemon shadow-[var(--shadow-brutal-sm)]">
          <p className="m-0 text-black text-sm font-bold">{t('stats_vocab')}</p>
          <p className="mt-1 text-black text-2xl font-extrabold">{stats.totalVocabularies}</p>
        </div>
      </section>

      {/* Filter Panel — Neo-Brutalism */}
      <div className="p-4 flex flex-col gap-3 rounded-[var(--rounded-bento)] border-2 border-brutal-black bg-card shadow-[var(--shadow-brutal-sm)]">
        <Input
          value={filters.searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder={t('search_placeholder')}
          aria-label={t('search_aria_label')}
          className="w-full"
        />

        <Input
          value={filters.vocabSearchTerm}
          onChange={(event) => onVocabSearchTermChange(event.target.value)}
          placeholder={t('vocab_search_placeholder')}
          aria-label={t('vocab_search_placeholder')}
          className="w-full"
        />

        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          <select
            value={filters.priority}
            onChange={(event) =>
              onPriorityFilterChange(event.target.value as LessonPriority | 'all')
            }
            aria-label={t('priority_filter_aria_label')}
            className="w-full h-10 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground font-medium py-1.5 px-3 shadow-[var(--shadow-brutal-sm)] cursor-pointer outline-none"
          >
            <option value="all">{t('priority_all')}</option>
            <option value="Low">{t('priority_low')}</option>
            <option value="Medium">{t('priority_medium')}</option>
            <option value="High">{t('priority_high')}</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(event) => onSortChange(event.target.value as LessonSortOption)}
            aria-label={t('sort_aria_label')}
            className="w-full h-10 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground font-medium py-1.5 px-3 shadow-[var(--shadow-brutal-sm)] cursor-pointer outline-none"
          >
            <option value="date_desc">{t('sort_date_desc')}</option>
            <option value="date_asc">{t('sort_date_asc')}</option>
            <option value="priority_desc">{t('sort_priority_desc')}</option>
            <option value="topic_asc">{t('sort_topic_asc')}</option>
          </select>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            aria-label={t('start_date_aria_label')}
            className="w-full"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            aria-label={t('end_date_aria_label')}
            className="w-full"
          />
        </div>

        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          <label className="inline-flex items-center gap-2 text-foreground font-bold text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isPinned}
              onChange={(event) => onPinnedFilterChange(event.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {t('filter_pinned')}
          </label>

          <label className="inline-flex items-center gap-2 text-foreground font-bold text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isFavorite}
              onChange={(event) => onFavoriteFilterChange(event.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {t('filter_favorite')}
          </label>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="w-fit py-2 px-5 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground font-bold cursor-pointer shadow-[var(--shadow-brutal-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:translate-x-px active:shadow-none"
        >
          {t('reset_filters')}
        </button>
      </div>

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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-foreground text-lg font-extrabold">{lesson.topic}</h2>
                    <p className="mt-1.5 text-foreground-secondary text-[0.9rem] font-medium">
                      {t('participant_label')}: {lesson.participantName}
                    </p>
                    <p className="mt-1.5 text-foreground-secondary text-[0.9rem] font-medium">
                      {t('date_label')}: {new Date(lesson.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge
                      label={lesson.priority}
                      variant={resolvePriorityVariant(lesson.priority)}
                    />
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
