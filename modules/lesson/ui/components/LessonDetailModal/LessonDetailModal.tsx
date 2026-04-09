'use client';

import { cn } from '@/lib/utils';
import type { ILesson } from '@/modules/lesson/core/models';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/Styled';

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
 * Each vocabulary entry is rendered in a minimal layout:
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
      <DialogContent className="flex! flex-col! max-h-[80vh]! overflow-hidden! p-0! gap-0! sm:max-w-[44rem]!">
        <DialogHeader className="shrink-0! p-4! border-b border-border/50!">
          <DialogTitle>{lesson.topic}</DialogTitle>
          <DialogDescription>{t('form_participant')}: {lesson.participantName}</DialogDescription>

          {/* Meta Strip */}
          <div className="flex flex-wrap items-center gap-[0.3rem] pb-3 border-b border-border/40">
            <span
              className="text-xs whitespace-nowrap max-w-[18ch] overflow-hidden text-ellipsis rounded py-[0.05rem] px-[0.35rem]"
              style={{
                color: 'var(--background)',
                background: lesson.priority === 'High' ? 'var(--accent-primary)' : lesson.priority === 'Medium' ? 'var(--accent-secondary)' : 'var(--green)',
              }}
            >
              {lesson.priority}
            </span>
            {lesson.notes && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
                <span className="text-xs text-muted-foreground/55 whitespace-nowrap max-w-[18ch] overflow-hidden text-ellipsis">{lesson.notes}</span>
              </>
            )}
            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(lesson.date).toLocaleDateString()}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{lesson?.vocabularies?.length}&nbsp;{t('vocab_count')}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">0&nbsp;{t('question_count')}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4">
          {/* Vocabulary list */}
          {lesson?.vocabularies?.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-[0.06em]">
                {t('vocab_section_title')}
              </h3>

              <div className="flex flex-col gap-4 pb-4">
                {lesson.vocabularies.map((vocab, index) => (
                  <div key={vocab.id} className="p-3.5 border border-border rounded-lg bg-background">
                    {/* Row 1: index · word · IPA · PoS · pronunciation */}
                    <div className="flex items-baseline flex-wrap gap-2 mb-1.5">
                      <span className="text-[0.85rem] font-medium text-muted-foreground/60 min-w-4 shrink-0">
                        #{index + 1}
                      </span>

                      <span className="inline-flex items-baseline gap-1.5 shrink-0">
                        <span className="text-[0.975rem] font-semibold text-foreground break-words bg-[var(--highlight)] px-1">
                          {vocab.word}
                        </span>
                        {vocab.ipa && (
                          <span className="text-base text-muted-foreground font-medium tracking-[0.025em] border-l border-border pl-2">
                            {vocab.ipa}
                          </span>
                        )}
                      </span>

                      {vocab.partOfSpeech && (
                        <span className="text-[0.65rem] font-medium text-muted-foreground/70 uppercase tracking-[0.04em] border border-border/50 rounded py-[0.05rem] px-[0.35rem] shrink-0 bg-accent-primary-light">
                          {vocab.partOfSpeech}
                        </span>
                      )}

                      {vocab.pronunciation && (
                        <span className="text-[0.775rem] text-muted-foreground/65">
                          🔊 {vocab.pronunciation}
                        </span>
                      )}
                    </div>

                    {/* Row 2: meaning */}
                    {vocab.meaning && (
                      <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                        <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                          {t('vocab_meaning_label')}:<br />
                        </span>
                        - <span className="text-foreground/85 text-[0.875rem] leading-relaxed">{vocab.meaning}</span>
                      </div>
                    )}

                    {/* Row 3: example */}
                    {vocab.example && (
                      <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                        <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                          {t('vocab_example_label')}:<br />
                        </span>
                        - <span className="inline text-muted-foreground text-[0.85rem] italic leading-relaxed [&_b]:bg-[var(--highlight)] [&_b]:px-1" dangerouslySetInnerHTML={{ __html: vocab.example }} />
                      </div>
                    )}

                    {/* Row 4: translation */}
                    {vocab.translation && (
                      <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                        <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                          {t('vocab_translation_label')}:<br />
                        </span>
                        - <span className="text-muted-foreground/75 text-[0.825rem] leading-relaxed">{vocab.translation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
