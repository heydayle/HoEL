'use client';

import type { ILesson } from '@/modules/lesson/core/models';
import { Dialog, DialogDescription, DialogTitle } from '@/shared/components/Styled';

import {
  DetailContent,
  DetailListContainer,
  DetailModalContent,
  DetailModalHeader,
  DetailSection,
  DetailSectionTitle,
  ExampleText,
  MeaningText,
  MetaChip,
  MetaDot,
  MetaStrip,
  PoSBadge,
  PronunciationNote,
  RowLabel,
  TranslationText,
  VocabDataRow,
  VocabDetailItem,
  VocabIPA,
  VocabIndex,
  VocabRow1,
  VocabWord,
  VocabWordGroup,
} from './styled';

/**
 * Props for LessonDetailModal component.
 */
interface ILessonDetailModalProps {
  /** Lesson to display details for */
  lesson: ILesson | null;
  /** Translation function */
  t: (key: string) => string;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Modal dialog for displaying lesson details.
 * Each vocabulary entry is rendered in a minimal 4-row layout:
 *   Row 1 – index · word · IPA · part-of-speech · pronunciation
 *   Row 2 – meaning
 *   Row 3 – example
 *   Row 4 – translation
 * @param props - Component props
 * @returns Modal component
 */
export function LessonDetailModal({
  lesson,
  t,
  onClose,
}: ILessonDetailModalProps): React.JSX.Element {
  if (!lesson) return <></>;

  return (
    <Dialog open={!!lesson} onOpenChange={onClose}>
      <DetailModalContent>
        <DetailModalHeader>
          <DialogTitle>{lesson.topic}</DialogTitle>
          <DialogDescription>{t('form_participant')}: {lesson.participantName}</DialogDescription>
          <MetaStrip>
            <MetaChip style={{ 
              padding: '0.05rem 0.35rem',
              borderRadius: '0.25rem',
              color: 'var(--background)',
              background: `${lesson.priority === 'High' ? 'var(--accent-primary)' : lesson.priority === 'Medium' ? 'var(--accent-secondary)' : 'var(--green)'}` }}>{lesson.priority}</MetaChip>
            {lesson.notes && (
              <>
                <MetaDot />
                <MetaChip $dim>{lesson.notes}</MetaChip>
              </>
            )}
            <MetaDot />
            <MetaChip>{new Date(lesson.date).toLocaleDateString()}</MetaChip>
            <MetaDot />
            <MetaChip>
              {lesson?.vocabularies?.length}&nbsp;{t('vocab_count')}
            </MetaChip>
            <MetaDot />
            <MetaChip>
              0&nbsp;{t('question_count')}
            </MetaChip>
            <MetaDot />
          </MetaStrip>
        </DetailModalHeader>

        <DetailContent>
          
          {/* Vocabulary list */}
          {lesson?.vocabularies?.length > 0 && (
            <DetailSection>
              <DetailSectionTitle>{t('vocab_section_title')}</DetailSectionTitle>

              <DetailListContainer>
                {lesson.vocabularies.map((vocab, index) => (
                  <VocabDetailItem key={vocab.id}>
                    {/* ── Row 1: index · word · IPA · PoS · pronunciation ── */}
                    <VocabRow1>
                      <VocabIndex>#{index + 1}</VocabIndex>

                      <VocabWordGroup>
                        <VocabWord>{vocab.word}</VocabWord>
                        {vocab.ipa && <VocabIPA>{vocab.ipa}</VocabIPA>}
                      </VocabWordGroup>

                      {vocab.partOfSpeech && <PoSBadge>{vocab.partOfSpeech}</PoSBadge>}

                      {vocab.pronunciation && (
                        <PronunciationNote>🔊 {vocab.pronunciation}</PronunciationNote>
                      )}
                    </VocabRow1>

                    {/* ── Row 2: meaning ── */}
                    {vocab.meaning && (
                      <VocabDataRow>
                        <RowLabel>
                          {t('vocab_meaning_label')}:<br />
                        </RowLabel>
                        - <MeaningText>{vocab.meaning}</MeaningText>
                      </VocabDataRow>
                    )}

                    {/* ── Row 3: example ── */}
                    {vocab.example && (
                      <VocabDataRow>
                        <RowLabel>
                          {t('vocab_example_label')}:<br />
                        </RowLabel>
                        - <ExampleText dangerouslySetInnerHTML={{ __html: vocab.example }} />
                      </VocabDataRow>
                    )}

                    {/* ── Row 4: translation ── */}
                    {vocab.translation && (
                      <VocabDataRow>
                        <RowLabel>
                          {t('vocab_translation_label')}:<br />
                        </RowLabel>
                        - <TranslationText>{vocab.translation}</TranslationText>
                      </VocabDataRow>
                    )}
                  </VocabDetailItem>
                ))}
              </DetailListContainer>
            </DetailSection>
          )}
        </DetailContent>
      </DetailModalContent>
    </Dialog>
  );
}
