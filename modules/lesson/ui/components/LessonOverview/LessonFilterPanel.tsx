import type { LessonPriority } from '@/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/modules/lesson/core/usecases';

import { Input } from '@/shared/components/Styled';

/**
 * Props for the LessonFilterPanel component.
 */
interface ILessonFilterPanelProps {
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
}

/**
 * Minimal filter bar for lessons.
 * Lays out search, selects, checkboxes, and reset in a compact flex row.
 *
 * @param props - Component props
 * @returns The rendered filter panel
 */
export function LessonFilterPanel({
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
}: ILessonFilterPanelProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={filters.searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder={t('search_placeholder')}
          aria-label={t('search_aria_label')}
          className="flex-1"
        />
        <Input
          value={filters.vocabSearchTerm}
          onChange={(event) => onVocabSearchTermChange(event.target.value)}
          placeholder={t('vocab_search_placeholder')}
          aria-label={t('vocab_search_placeholder')}
          className="flex-1"
        />
      </div>

      {/* Selects + dates row */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.priority}
          onChange={(event) =>
            onPriorityFilterChange(event.target.value as LessonPriority | 'all')
          }
          aria-label={t('priority_filter_aria_label')}
          className="h-10 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground text-sm font-medium px-3 shadow-[var(--shadow-brutal-sm)] cursor-pointer outline-none"
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
          className="h-10 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground text-sm font-medium px-3 shadow-[var(--shadow-brutal-sm)] cursor-pointer outline-none"
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
          className="w-auto"
        />

        <Input
          type="date"
          value={filters.endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          aria-label={t('end_date_aria_label')}
          className="w-auto"
        />
      </div>

      {/* Toggles + reset row */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-1.5 text-foreground font-medium text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isPinned}
            onChange={(event) => onPinnedFilterChange(event.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          {t('filter_pinned')}
        </label>

        <label className="inline-flex items-center gap-1.5 text-foreground font-medium text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isFavorite}
            onChange={(event) => onFavoriteFilterChange(event.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          {t('filter_favorite')}
        </label>

        <button
          type="button"
          onClick={onResetFilters}
          className="ml-auto py-1.5 px-4 rounded-full border-2 border-brutal-black bg-brutal-white text-foreground text-sm font-bold cursor-pointer shadow-[var(--shadow-brutal-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[var(--shadow-brutal-md)] active:translate-y-px active:translate-x-px active:shadow-none"
        >
          {t('reset_filters')}
        </button>
      </div>
    </div>
  );
}
