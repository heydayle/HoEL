'use client';
import type { ILesson, IVocabulary } from '@/modules/lesson/core/models';
import { BookOpen, Calendar, Eye, Flag, User, Volume2 } from 'lucide-react';
import React from 'react';
import {
  EmptyVocabHint,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  NotesBlock,
  PageBadge,
  PageBanner,
  PageContainer,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PriorityChip,
  ReadonlyHint,
  SectionDivider,
  SectionHeading,
  VocabCard,
  VocabCardBody,
  VocabCardField,
  VocabCardFieldLabel,
  VocabCardFieldValue,
  VocabCardWord,
  VocabGrid,
  VocabIpa,
  VocabMeta,
} from './styled';
/** ──────────────────────────────────────────────────────────────────────────
 * Sub-component: VocabularyCard
 * ─────────────────────────────────────────────────────────────────────────── */
interface IVocabularyCardProps {
  /** Vocabulary entry to render */
  vocab: IVocabulary;
  /** Translation function */
  t: (key: string) => string;
}
/**
 * Renders a single vocabulary entry in the public share view.
 * Displays all available fields in a clean, read-only card layout.
 *
 * @param props - Component props
 * @returns Vocabulary card element
 */
function VocabularyCard({ vocab, t }: IVocabularyCardProps): React.JSX.Element {
  return (
    <VocabCard>
      <VocabMeta>
        <VocabCardWord>{vocab.word}</VocabCardWord>
        {vocab.ipa && <VocabIpa>{vocab.ipa}</VocabIpa>}
        {vocab.partOfSpeech && <PriorityChip $variant="pos">{vocab.partOfSpeech}</PriorityChip>}
      </VocabMeta>
      <VocabCardBody>
        {vocab.meaning && (
          <VocabCardField>
            <VocabCardFieldLabel>{t('share_view_meaning')}</VocabCardFieldLabel>
            <VocabCardFieldValue>{vocab.meaning}</VocabCardFieldValue>
          </VocabCardField>
        )}
        {vocab.translation && (
          <VocabCardField>
            <VocabCardFieldLabel>{t('share_view_translation')}</VocabCardFieldLabel>
            <VocabCardFieldValue>{vocab.translation}</VocabCardFieldValue>
          </VocabCardField>
        )}
        {vocab.pronunciation && (
          <VocabCardField>
            <VocabCardFieldLabel>
              <Volume2 aria-hidden="true" style={{ width: '0.85rem', height: '0.85rem' }} />
              {t('share_view_pronunciation')}
            </VocabCardFieldLabel>
            <VocabCardFieldValue>{vocab.pronunciation}</VocabCardFieldValue>
          </VocabCardField>
        )}
        {vocab.example && (
          <VocabCardField>
            <VocabCardFieldLabel>{t('share_view_example')}</VocabCardFieldLabel>
            <VocabCardFieldValue $italic>{vocab.example}</VocabCardFieldValue>
          </VocabCardField>
        )}
      </VocabCardBody>
    </VocabCard>
  );
}
/** ──────────────────────────────────────────────────────────────────────────
 * Main component: LessonShareView
 * ─────────────────────────────────────────────────────────────────────────── */
interface ILessonShareViewProps {
  /** Fully loaded lesson entity to display */
  lesson: ILesson;
  /** Translation function bound to the lesson module messages */
  t: (key: string) => string;
}
/**
 * Public, read-only view of a single lesson.
 * Rendered at `/s/[id]` — no authentication required, no editing allowed.
 *
 * @param props - Component props
 * @returns Full page read-only lesson detail UI
 */
export function LessonShareView({ lesson, t }: ILessonShareViewProps): React.JSX.Element {
  const formattedDate = new Date(lesson.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <PageWrapper>
      <PageContainer>
        {/* ── Hero banner ── */}
        <PageBanner>
          <PageBadge>
            <Eye aria-hidden="true" style={{ width: '0.85rem', height: '0.85rem' }} />
            {t('share_view_badge')}
          </PageBadge>
          <PageHeader>
            <PageTitle>{lesson.topic}</PageTitle>
            <PageSubtitle>{t('share_view_title')}</PageSubtitle>
          </PageHeader>
        </PageBanner>
        {/* ── Read-only hint ── */}
        <ReadonlyHint role="note">{t('share_view_readonly_hint')}</ReadonlyHint>
        {/* ── Lesson metadata ── */}
        <InfoGrid>
          <InfoItem>
            <InfoLabel>
              <User aria-hidden="true" style={{ width: '1rem', height: '1rem' }} />
              {t('share_view_participant')}
            </InfoLabel>
            <InfoValue>{lesson.participantName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>
              <Calendar aria-hidden="true" style={{ width: '1rem', height: '1rem' }} />
              {t('share_view_date')}
            </InfoLabel>
            <InfoValue>{formattedDate}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>
              <Flag aria-hidden="true" style={{ width: '1rem', height: '1rem' }} />
              {t('share_view_priority')}
            </InfoLabel>
            <InfoValue>
              <PriorityChip $variant={lesson.priority.toLowerCase() as 'low' | 'medium' | 'high'}>
                {lesson.priority}
              </PriorityChip>
            </InfoValue>
          </InfoItem>
        </InfoGrid>
        {/* ── Notes ── */}
        {lesson.notes && (
          <>
            <SectionDivider />
            <SectionHeading>
              <BookOpen aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />
              {t('share_view_notes')}
            </SectionHeading>
            <NotesBlock>{lesson.notes}</NotesBlock>
          </>
        )}
        {/* ── Vocabulary ── */}
        <SectionDivider />
        <SectionHeading>
          <BookOpen aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />
          {t('share_view_vocabulary')}
          {lesson.vocabularies.length > 0 && ` (${lesson.vocabularies.length})`}
        </SectionHeading>
        {lesson.vocabularies.length === 0 ? (
          <EmptyVocabHint>{t('share_view_no_vocab')}</EmptyVocabHint>
        ) : (
          <VocabGrid>
            {lesson.vocabularies.map((vocab) => (
              <VocabularyCard key={vocab.id} vocab={vocab} t={t} />
            ))}
          </VocabGrid>
        )}
      </PageContainer>
    </PageWrapper>
  );
}
