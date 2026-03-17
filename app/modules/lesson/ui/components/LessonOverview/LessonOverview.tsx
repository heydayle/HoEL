import type { ILesson, ILessonStats, LessonPriority } from '@/app/modules/lesson/core/models';
import type { ILessonFilterInput, LessonSortOption } from '@/app/modules/lesson/core/usecases';
import { ExternalLink, Pencil } from 'lucide-react';

import {
  EmptyState,
  EditLessonButton,
  FilterCheckboxLabel,
  FilterGrid,
  FilterInput,
  FilterPanel,
  FilterResetButton,
  FilterSelect,
  LessonCard,
  LessonCardHeader,
  LessonMeta,
  LessonsList,
  LessonTopic,
  NotesContent,
  OpenLessonButton,
  PriorityBadge,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
} from '../styled';

/**
 * Props for LessonOverview component.
 */
interface ILessonOverviewProps {
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
  stats,
  lessons,
  filters,
  t,
  onSearchTermChange,
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
  return (
    <>
      <StatsGrid>
        <StatCard>
          <StatLabel>{t('stats_lessons')}</StatLabel>
          <StatValue>{stats.totalLessons}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>{t('stats_vocab')}</StatLabel>
          <StatValue>{stats.totalVocabularies}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>{t('stats_questions')}</StatLabel>
          <StatValue>{stats.totalQuestions}</StatValue>
        </StatCard>
      </StatsGrid>

      <FilterPanel>
        <FilterInput
          value={filters.searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder={t('search_placeholder')}
          aria-label={t('search_aria_label')}
        />

        <FilterGrid>
          <FilterSelect
            value={filters.priority}
            onChange={(event) =>
              onPriorityFilterChange(event.target.value as LessonPriority | 'all')
            }
            aria-label={t('priority_filter_aria_label')}
          >
            <option value="all">{t('priority_all')}</option>
            <option value="Low">{t('priority_low')}</option>
            <option value="Medium">{t('priority_medium')}</option>
            <option value="High">{t('priority_high')}</option>
          </FilterSelect>

          <FilterSelect
            value={filters.sortBy}
            onChange={(event) => onSortChange(event.target.value as LessonSortOption)}
            aria-label={t('sort_aria_label')}
          >
            <option value="date_desc">{t('sort_date_desc')}</option>
            <option value="date_asc">{t('sort_date_asc')}</option>
            <option value="priority_desc">{t('sort_priority_desc')}</option>
            <option value="topic_asc">{t('sort_topic_asc')}</option>
          </FilterSelect>

          <FilterInput
            type="date"
            value={filters.startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            aria-label={t('start_date_aria_label')}
          />

          <FilterInput
            type="date"
            value={filters.endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            aria-label={t('end_date_aria_label')}
          />
        </FilterGrid>

        <FilterGrid>
          <FilterCheckboxLabel>
            <input
              type="checkbox"
              checked={filters.isPinned}
              onChange={(event) => onPinnedFilterChange(event.target.checked)}
            />
            {t('filter_pinned')}
          </FilterCheckboxLabel>

          <FilterCheckboxLabel>
            <input
              type="checkbox"
              checked={filters.isFavorite}
              onChange={(event) => onFavoriteFilterChange(event.target.checked)}
            />
            {t('filter_favorite')}
          </FilterCheckboxLabel>
        </FilterGrid>

        <FilterResetButton type="button" onClick={onResetFilters}>
          {t('reset_filters')}
        </FilterResetButton>
      </FilterPanel>

      <LessonsList>
        {lessons.length === 0 ? (
          <EmptyState>{t('empty_state')}</EmptyState>
        ) : (
          lessons.map((lesson) => (
            <LessonCard key={lesson.id} onClick={() => onSelectLesson(lesson)}>
              <LessonCardHeader>
                <div>
                  <LessonTopic>{lesson.topic}</LessonTopic>
                  <LessonMeta>
                    {t('participant_label')}: {lesson.participantName}
                  </LessonMeta>
                  <LessonMeta>
                    {t('date_label')}: {new Date(lesson.date).toLocaleDateString()}
                  </LessonMeta>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <EditLessonButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditLesson(lesson);
                    }}
                    title="Edit lesson"
                    aria-label="Edit lesson"
                  >
                    <Pencil style={{ width: '1rem', height: '1rem' }} />
                  </EditLessonButton>
                  <OpenLessonButton
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/lessons/${lesson.id}`, '_blank');
                    }}
                    title="Open in new tab"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink style={{ width: '1rem', height: '1rem' }} />
                  </OpenLessonButton>
                  <PriorityBadge>{lesson.priority}</PriorityBadge>
                </div>
              </LessonCardHeader>

              <NotesContent>{lesson.notes}</NotesContent>
              <LessonMeta>
                {t('vocab_count')}: {lesson.vocabularies.length} · {t('question_count')}:{' '}
                {lesson.questions.length}
              </LessonMeta>
            </LessonCard>
          ))
        )}
      </LessonsList>
    </>
  );
}
