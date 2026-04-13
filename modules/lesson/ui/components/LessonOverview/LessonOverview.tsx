import type { ILesson, ILessonStats, LessonPriority } from '@/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/modules/lesson/core/usecases';
import { Check, Pencil, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

/**
 * Displays filter controls and lessons list view.
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
      {/* Stats Grid */}
      <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        <Card className="bg-surface p-2.5 px-5">
          <p className="m-0 text-foreground-secondary text-sm">{t('stats_lessons')}</p>
          <p className="mt-1 text-foreground text-2xl font-bold">{stats.totalLessons}</p>
        </Card>
        <Card className="bg-surface p-2.5 px-5">
          <p className="m-0 text-foreground-secondary text-sm">{t('stats_vocab')}</p>
          <p className="mt-1 text-foreground text-2xl font-bold">{stats.totalVocabularies}</p>
        </Card>
      </section>

      {/* Filter Panel */}
      <Card className="bg-surface p-4 flex flex-col gap-3">
        <Input
          value={filters.searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder={t('search_placeholder')}
          aria-label={t('search_aria_label')}
          className="w-full py-1.5 px-2.5 md:py-2.5 md:px-4"
        />

        <Input
          value={filters.vocabSearchTerm}
          onChange={(event) => onVocabSearchTermChange(event.target.value)}
          placeholder={t('vocab_search_placeholder')}
          aria-label={t('vocab_search_placeholder')}
          className="w-full py-1.5 px-2.5 md:py-2.5 md:px-4"
        />

        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          <select
            value={filters.priority}
            onChange={(event) =>
              onPriorityFilterChange(event.target.value as LessonPriority | 'all')
            }
            aria-label={t('priority_filter_aria_label')}
            className="w-full h-10 rounded-[var(--radius-md)] border border-surface-border bg-surface text-foreground py-1.5 px-2.5"
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
            className="w-full h-10 rounded-[var(--radius-md)] border border-surface-border bg-surface text-foreground py-1.5 px-2.5"
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
            className="w-full py-1.5 px-2.5 md:py-2.5 md:px-4"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            aria-label={t('end_date_aria_label')}
            className="w-full py-1.5 px-2.5 md:py-2.5 md:px-4"
          />
        </div>

        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          <label className="inline-flex items-center gap-1.5 text-foreground-secondary text-sm">
            <input
              type="checkbox"
              checked={filters.isPinned}
              onChange={(event) => onPinnedFilterChange(event.target.checked)}
            />
            {t('filter_pinned')}
          </label>

          <label className="inline-flex items-center gap-1.5 text-foreground-secondary text-sm">
            <input
              type="checkbox"
              checked={filters.isFavorite}
              onChange={(event) => onFavoriteFilterChange(event.target.checked)}
            />
            {t('filter_favorite')}
          </label>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="w-fit py-1.5 px-2.5 md:py-2.5 md:px-4 rounded-[var(--radius-md)] border border-surface-border bg-surface-hover text-foreground cursor-pointer"
        >
          {t('reset_filters')}
        </button>
      </Card>

      {/* Lessons List */}
      <div className="">
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner className="mx-auto mt-4" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="m-0 py-2.5 px-5 rounded-[var(--radius-md)] border border-dashed border-surface-border text-foreground-secondary">
            {t('empty_state')}
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className="bg-surface p-4 cursor-pointer transition-all duration-200 ease-in-out hover:border-accent-primary hover:bg-surface-hover hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-foreground text-lg">{lesson.topic}</h2>
                    <p className="mt-1.5 text-foreground-secondary text-[0.9rem]">
                      {t('participant_label')}: {lesson.participantName}
                    </p>
                    <p className="mt-1.5 text-foreground-secondary text-[0.9rem]">
                      {t('date_label')}: {new Date(lesson.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
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
                      className="flex items-center justify-center rounded-md bg-transparent text-foreground-secondary cursor-pointer transition-all duration-200 shrink-0 hover:bg-surface-hover hover:text-accent-primary active:scale-95"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => void handleShareLesson(e, lesson)}
                      title={t('share_link_label')}
                      aria-label={t('share_link_label')}
                      className="flex items-center justify-center rounded-md bg-transparent text-foreground-secondary cursor-pointer transition-all duration-200 shrink-0 hover:bg-[hsl(180,60%,90%,0.15)] hover:text-[hsl(180,60%,45%)] active:scale-95"
                    >
                      {copiedId === lesson.id ? (
                        <Check className="w-4 h-4 text-[hsl(150,60%,45%)]" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-foreground leading-relaxed">{lesson.notes}</p>
                <p className="mt-1.5 text-foreground-secondary text-[0.9rem]">
                  {t('vocab_count')}: {lesson?.vocabularies?.length}
                </p>
              </Card>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
