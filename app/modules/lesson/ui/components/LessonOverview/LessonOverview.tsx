import type { ILesson, ILessonStats } from '@/app/modules/lesson/core/models';

import {
  LatestLessonCard,
  LessonMeta,
  LessonTopic,
  LinkItem,
  LinkList,
  NotesContent,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
} from '../styled';

/**
 * Props for LessonOverview component.
 */
interface ILessonOverviewProps {
  /** Summary statistics for all lessons */
  stats: ILessonStats;
  /** Latest lesson to preview */
  latestLesson: ILesson;
  /** Translation function */
  t: (key: string) => string;
}

/**
 * Displays lesson statistics and latest lesson details.
 * @param props - Component props
 * @returns Overview section for lesson data
 */
export function LessonOverview({
  stats,
  latestLesson,
  t,
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

      <LatestLessonCard>
        <LessonTopic>{latestLesson.topic}</LessonTopic>
        <LessonMeta>
          {t('participant_label')}: {latestLesson.participantName}
        </LessonMeta>
        <LessonMeta>
          {t('priority_label')}: {latestLesson.priority}
        </LessonMeta>
        <NotesContent>
          {t('notes_label')}: {latestLesson.notes}
        </NotesContent>
        <LessonMeta>{t('links_label')}:</LessonMeta>
        <LinkList>
          {latestLesson.links.map((link) => (
            <li key={link}>
              <LinkItem href={link} target="_blank" rel="noreferrer noopener">
                {link}
              </LinkItem>
            </li>
          ))}
        </LinkList>
      </LatestLessonCard>
    </>
  );
}
