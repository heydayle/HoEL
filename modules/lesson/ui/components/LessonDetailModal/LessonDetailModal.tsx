'use client';

import { Check, Pencil, Share2, Trash2, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { ILesson } from '@/modules/lesson/core/models';
import { SummaryLesson } from '@/modules/lesson/ui/components/SummaryLesson';
import { useSummaryLesson } from '@/modules/lesson/ui/hooks/useSummaryLesson';
import { PriorityBadge, resolvePriorityVariant } from '@/shared/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/Styled';
import { useTextToSpeech } from '@/shared/hooks';

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
  /** Callback to navigate to the edit page for this lesson */
  onEditLesson?: (lesson: ILesson) => void;
  /** Callback to delete the lesson */
  onDeleteLesson?: (lessonId: string) => Promise<boolean>;
}

/**
 * Modal dialog for displaying lesson details.
 * Summary is rendered above vocabularies.
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
  onEditLesson,
  onDeleteLesson,
}: ILessonDetailModalProps): React.JSX.Element {
  const {
    summary,
    isLoading: isSummaryLoading,
    isGenerating: isSummaryGenerating,
    fetchSummary,
    handleGenerateSummary,
  } = useSummaryLesson(t);

  const { speak, isSpeaking, currentWord } = useTextToSpeech();

  /** Tracks whether the share link was just copied */
  const [isCopied, setIsCopied] = useState(false);

  /** Whether the delete confirmation dialog is shown */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Speaks the given word using the Web Speech API.
   * Wrapped in useCallback to avoid unnecessary re-renders.
   * @param word - The vocabulary word to pronounce
   */
  const handleSpeak = useCallback(
    (word: string) => {
      speak(word);
    },
    [speak],
  );

  /** Reset copied state when the modal lesson changes */
  useEffect(() => {
    setIsCopied(false);
  }, [lesson?.id]);

  /** Fetch summary when the modal opens with a lesson */
  useEffect(() => {
    if (lesson?.id) {
      fetchSummary(lesson.id);
    }
  }, [lesson?.id, fetchSummary]);

  /**
   * Triggers summary (re)generation for the selected lesson
   * using its existing vocabulary words.
   */
  const handleRegenerateSummary = () => {
    if (!lesson) {
      return;
    }

    const wordList = (lesson.vocabularies ?? []).map((v) => v.word).filter((w) => w.trim() !== '');

    if (wordList.length === 0) {
      return;
    }

    handleGenerateSummary(lesson.id, wordList, summary?.id);
  };

  /**
   * Re-fetches the summary from the database.
   * Used when the summary is still being processed in the background.
   */
  const handleReloadSummary = () => {
    if (lesson?.id) {
      fetchSummary(lesson.id);
    }
  };

  /**
   * Copies the public share URL for the current lesson to the clipboard.
   * Shows a brief checkmark indicator, then resets after 2s.
   */
  const handleShare = async () => {
    if (!lesson) {
      return;
    }

    const shareUrl = `${window.location.origin}/s/${lesson.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success(t('share_link_copied'));
    setTimeout(() => setIsCopied(false), 2000);
  };

  /**
   * Navigates to the edit page and closes the modal.
   */
  const handleEdit = () => {
    if (!lesson || !onEditLesson) {
      return;
    }

    onEditLesson(lesson);
    onClose();
  };

  /** Whether the lesson has vocabularies (i.e. a summary may be processing) */
  const hasVocabularies = (lesson?.vocabularies?.length ?? 0) > 0;

  if (!lesson) return <></>;

  return (
    <>
      <Dialog open={!!lesson} onOpenChange={onClose}>
        <DialogContent className="flex! flex-col! max-h-[80vh]! overflow-hidden! p-0! gap-0! sm:max-w-[44rem]! rounded-[var(--rounded-bento)]! border-2! border-brutal-black! shadow-[var(--shadow-brutal-md)]!">
          <DialogHeader className="shrink-0! p-4! border-b-2! border-brutal-black!">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <DialogTitle>{lesson.topic}</DialogTitle>
                <DialogDescription className="mt-2!">
                  {t('form_participant')}: {lesson.participantName}
                </DialogDescription>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 mt-4">
                {onEditLesson && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    aria-label={t('modal_edit_btn')}
                    className="gap-1.5 h-8 px-2.5 cursor-pointer text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">{t('modal_edit_btn')}</span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleShare()}
                  aria-label={t('share_link_label')}
                  className="gap-1.5 h-8 px-2.5 cursor-pointer text-muted-foreground hover:text-primary"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-green" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline text-xs">
                    {isCopied ? t('share_link_copied') : t('modal_share_btn')}
                  </span>
                </Button>
                {onDeleteLesson && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    aria-label={t('modal_delete_btn')}
                    className="gap-1.5 h-8 px-2.5 cursor-pointer text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">{t('modal_delete_btn')}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Meta Strip */}
            <div className="flex flex-wrap items-center gap-[0.3rem] pb-2">
              <PriorityBadge
                label={lesson.priority}
                variant={resolvePriorityVariant(lesson.priority)}
              />
              {lesson.notes && (
                <>
                  <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
                  <span className="text-xs text-muted-foreground/55 whitespace-nowrap max-w-[18ch] overflow-hidden text-ellipsis">
                    {lesson.notes}
                  </span>
                </>
              )}
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(lesson.date).toLocaleDateString()}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {lesson?.vocabularies?.length}&nbsp;{t('vocab_count')}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {summary?.id ? 3 : 0}&nbsp;{t('question_count')}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30 shrink-0" />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4">
            {/* Summary section — displayed above vocabularies */}
            <div className="mt-3">
              <SummaryLesson
                summary={summary}
                isLoading={isSummaryLoading}
                isGenerating={isSummaryGenerating}
                t={t}
                onRegenerate={handleRegenerateSummary}
                onReload={handleReloadSummary}
                showProcessingState={isSummaryGenerating}
                vocabCount={lesson?.vocabularies?.length ?? 0}
              />
            </div>

            {/* Vocabulary list */}
            {lesson?.vocabularies?.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-[0.06em]">
                  {t('vocab_section_title')}
                </h3>

                <div className="flex flex-col gap-4 pb-4">
                  {lesson.vocabularies.map((vocab, index) => (
                    <div
                      key={vocab.id}
                      className="p-4 border-2 border-brutal-black rounded-[calc(var(--rounded-bento)*0.6)] bg-card shadow-[var(--shadow-brutal-sm)]"
                    >
                      {/* Row 1: index · word · IPA · PoS · pronunciation */}
                      <div className="flex flex-col items-baseline flex-wrap gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.85rem] font-medium text-muted-foreground/60 min-w-4 shrink-0">
                            #{index + 1}
                          </span>

                          <span className="inline-flex items-baseline gap-1.5 shrink-0">
                            <span className="text-[0.975rem] font-semibold break-words text-[var(--highlight)]">
                              {vocab.word}
                            </span>
                            {vocab.ipa && (
                              <span className="text-base text-muted-foreground font-medium tracking-[0.025em] border-l border-border pl-2">
                                {vocab.ipa}
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          {vocab.partOfSpeech && (
                            <PriorityBadge label={vocab.partOfSpeech} variant="pos" />
                          )}

                          {vocab.pronunciation && (
                            <button
                              type="button"
                              onClick={() => handleSpeak(vocab.word)}
                              aria-label={`${t('tts_speak_label')}: ${vocab.word}`}
                              className={[
                                'inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded-md',
                                'text-[0.775rem] cursor-pointer border-none bg-transparent',
                                'transition-all duration-200',
                                'hover:bg-primary/10 hover:text-primary',
                                'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1',
                                isSpeaking && currentWord === vocab.word
                                  ? 'text-primary animate-pulse'
                                  : 'text-muted-foreground/65',
                              ].join(' ')}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{vocab.pronunciation}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Row 2: meaning */}
                      {vocab.meaning && (
                        <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                          <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                            {t('vocab_meaning_label')}:<br />
                          </span>
                          -{' '}
                          <span className="text-foreground/85 text-[0.875rem] leading-relaxed">
                            {vocab.meaning}
                          </span>
                        </div>
                      )}

                      {/* Row 3: example */}
                      {vocab.example && (
                        <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                          <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                            {t('vocab_example_label')}:<br />
                          </span>
                          -{' '}
                          <span
                            className="inline text-muted-foreground text-[0.85rem] italic leading-relaxed [&_b]:text-[var(--highlight)]"
                            dangerouslySetInnerHTML={{ __html: vocab.example }}
                          />
                        </div>
                      )}

                      {/* Row 4: translation */}
                      {vocab.translation && (
                        <div className="text-[0.85rem] leading-relaxed text-muted-foreground mt-0.5">
                          <span className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-muted-foreground/50 mr-1.5">
                            {t('vocab_translation_label')}:<br />
                          </span>
                          -{' '}
                          <span className="text-muted-foreground text-[0.825rem] leading-relaxed">
                            {vocab.translation}
                          </span>
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete_confirm_description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              onClick={async () => {
                if (lesson && onDeleteLesson) {
                  const deleted = await onDeleteLesson(lesson.id);

                  if (deleted) {
                    setShowDeleteConfirm(false);
                    onClose();
                  }
                }
              }}
            >
              {t('delete_confirm_action')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
