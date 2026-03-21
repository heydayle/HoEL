'use client';

import type { ILesson } from '@/modules/lesson/core/models';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/Styled';

import {
  DetailBadge,
  DetailContent,
  DetailGrid,
  DetailGroupLabel,
  DetailItem,
  DetailListContainer,
  DetailModalContent,
  DetailModalHeader,
  DetailRow,
  DetailSection,
  DetailSectionTitle,
  DetailValue,
  VocabDetailItem,
  VocabIndex,
  VocabWordHeader,
  VocabWord,
  VocabIPA,
  VocabMetadata,
  PoSBadge,
  PronunciationNote,
  MeaningSection,
  MeaningLabel,
  MeaningText,
  ExampleSection,
  ExampleLabel,
  ExampleText,
  TranslationSection,
  TranslationLabel,
  TranslationText,
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
          <DialogDescription>{lesson.participantName}</DialogDescription>
        </DetailModalHeader>

        <DetailContent>
          <DetailSection>
            <DetailRow>
              <DetailItem>
                <DetailGroupLabel>{t('date_label')}</DetailGroupLabel>
                <DetailValue>{new Date(lesson.date).toLocaleDateString()}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailGroupLabel>{t('priority_filter_aria_label')}</DetailGroupLabel>
                <DetailValue>
                  <DetailBadge>{lesson.priority}</DetailBadge>
                </DetailValue>
              </DetailItem>
            </DetailRow>
          </DetailSection>

          <DetailSection>
            <DetailSectionTitle>{t('form_notes')}</DetailSectionTitle>
            <DetailValue>{lesson.notes}</DetailValue>
          </DetailSection>

          <DetailGrid>
            <DetailItem>
              <DetailGroupLabel>{t('vocab_count')}</DetailGroupLabel>
              <DetailValue>{lesson.vocabularies.length}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailGroupLabel>{t('question_count')}</DetailGroupLabel>
              <DetailValue>{lesson.questions.length}</DetailValue>
            </DetailItem>
          </DetailGrid>

          {lesson.vocabularies.length > 0 && (
            <DetailSection>
              <DetailSectionTitle>{t('vocab_section_title')}</DetailSectionTitle>
              <DetailListContainer>
                {lesson.vocabularies.map((vocab, index) => (
                  <VocabDetailItem key={vocab.id}>
                    <VocabWordHeader>
                      <div>
                        <VocabIndex>#{index + 1}</VocabIndex>
                      </div>
                      <div style={{ flex: 1 }}>
                        <VocabWord>{vocab.word}</VocabWord>
                        {vocab.ipa && <VocabIPA>{vocab.ipa}</VocabIPA>}
                      </div>
                    </VocabWordHeader>

                    {(vocab.partOfSpeech || vocab.pronunciation) && (
                      <VocabMetadata>
                        {vocab.partOfSpeech && (
                          <PoSBadge>{vocab.partOfSpeech}</PoSBadge>
                        )}
                        {vocab.pronunciation && (
                          <PronunciationNote>
                            🔊 {vocab.pronunciation}
                          </PronunciationNote>
                        )}
                      </VocabMetadata>
                    )}

                    {vocab.meaning && (
                      <MeaningSection>
                        <MeaningLabel>📖 Definition</MeaningLabel>
                        <MeaningText>{vocab.meaning}</MeaningText>
                      </MeaningSection>
                    )}

                    {vocab.example && (
                      <ExampleSection>
                        <ExampleLabel>📝 Example</ExampleLabel>
                        <ExampleText dangerouslySetInnerHTML={{ __html: vocab.example }} />
                      </ExampleSection>
                    )}

                    {vocab.translation && (
                      <TranslationSection>
                        <TranslationLabel>🌐 Translation</TranslationLabel>
                        <TranslationText>{vocab.translation}</TranslationText>
                      </TranslationSection>
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
