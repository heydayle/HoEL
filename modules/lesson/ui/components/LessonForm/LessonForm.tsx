'use client';

import { LoaderCircleIcon, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { ILesson, LessonPriority } from '@/modules/lesson/core/models';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/components/Styled';

import Spinner from '@/shared/components/ui/spinner';
import { useGenerateVocab } from '../../hooks/useGenerateVocab';

interface ILessonFormProps {
  t: (key: string) => string;
  title: string;
  description: string;
  submitLabel: string;
  initialLesson?: ILesson | null;
  onSubmitLesson: (lesson: Omit<ILesson, 'id'>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Flat, page-level lesson form used by create and edit routes.
 * @param props - Component props
 * @returns Rendered lesson form
 */
export function LessonForm({
  t,
  submitLabel,
  initialLesson,
  onSubmitLesson,
  onCancel,
  isLoading,
}: ILessonFormProps): React.JSX.Element {
  const {
    generate,
    isLoading: isGenerating,
    newVocab,
    setNewVocab,
    setVocabularies,
    vocabularies,
  } = useGenerateVocab(initialLesson);
  const isEditing = !!initialLesson;

  /** Tracks whether the form is being submitted (awaiting onSubmitLesson). */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Ref pointing to the bottom of the vocab list — used for auto-scroll. */
  const vocabBottomRef = useRef<HTMLDivElement>(null);

  /** Previous vocab length — used to detect a newly loaded vocab entry. */
  const prevVocabLengthRef = useRef(vocabularies.length);

  const defaultDate = useMemo(() => {
    if (initialLesson) {
      return new Date(initialLesson.date).toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }, [initialLesson]);

  /**
   * Auto-scroll to the bottom of the vocab list whenever a new entry is added.
   */
  useEffect(() => {
    if (vocabularies.length > prevVocabLengthRef.current) {
      vocabBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    prevVocabLengthRef.current = vocabularies.length;
  }, [vocabularies.length]);

  /** Updates the new-vocab input state. */
  const onChangeNewVocab = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVocab(event.target.value);
  };

  /**
   * Triggers vocab generation.
   */
  const handleLoadVocab = () => {
    if (newVocab.trim() === '') return;
    generate(newVocab);
  };

  /**
   * Intercepts Enter key on the new-vocab input to trigger vocab loading.
   */
  const handleNewVocabKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLoadVocab();
    }
  };

  /** Appends a new empty vocabulary entry to the list. */
  const handleAddVocab = () => {
    setVocabularies([
      ...vocabularies,
      {
        id: `vocab-${Date.now()}`,
        word: newVocab ?? '',
        ipa: '',
        partOfSpeech: '',
        meaning: '',
        translation: '',
        pronunciation: '',
        example: '',
      },
    ]);
  };

  /**
   * Removes a vocabulary entry by its id.
   * @param id - Vocabulary entry id
   */
  const handleRemoveVocab = (id: string) => {
    setVocabularies(vocabularies.filter((vocab) => vocab.id !== id));
  };

  /** Reads form data and calls the submit callback. */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);

    let date = formData.get('date') as string;
    if (date && !date.includes('T')) {
      date = `${date}T09:00:00.000Z`;
    }

    const lesson: Omit<ILesson, 'id'> = {
      topic: formData.get('topic') as string,
      participantName: formData.get('participantName') as string,
      date,
      notes: formData.get('notes') as string,
      priority: formData.get('priority') as LessonPriority,
      isPinned: isEditing ? initialLesson!.isPinned : false,
      isFavorite: isEditing ? initialLesson!.isFavorite : false,
      vocabularies: vocabularies
        .map((vocab, index) => ({
          id: vocab.id,
          word: (formData.get(`vocab_${index}_word`) as string) || '',
          ipa: (formData.get(`vocab_${index}_ipa`) as string) || '',
          partOfSpeech: (formData.get(`vocab_${index}_partOfSpeech`) as string) || '',
          meaning: (formData.get(`vocab_${index}_meaning`) as string) || '',
          translation: (formData.get(`vocab_${index}_translation`) as string) || '',
          pronunciation: (formData.get(`vocab_${index}_pronunciation`) as string) || '',
          example: (formData.get(`vocab_${index}_example`) as string) || '',
        }))
        .filter((vocab) => vocab.word.trim() !== ''),
    };

    setIsSubmitting(true);

    try {
      await onSubmitLesson(lesson);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-0 border border-border rounded-xl bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 border border-border rounded-xl bg-background">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 pb-24">
        {/* ── Lesson info ── */}
        <div className="flex flex-col gap-2">
          <label htmlFor="topic" className="text-sm font-medium">
            {t('form_topic')}
          </label>
          <Input id="topic" name="topic" required defaultValue={initialLesson?.topic ?? ''} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="participantName" className="text-sm font-medium">
              {t('form_participant')}
            </label>
            <Input
              id="participantName"
              name="participantName"
              required
              defaultValue={initialLesson?.participantName ?? ''}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              {t('form_date')}
            </label>
            <Input id="date" name="date" type="date" required defaultValue={defaultDate} />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              {t('form_priority')}
            </label>
            <Select name="priority" defaultValue={initialLesson?.priority ?? 'Medium'}>
              <SelectTrigger id="priority">
                <SelectValue placeholder={t('priority_medium')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">{t('priority_low')}</SelectItem>
                <SelectItem value="Medium">{t('priority_medium')}</SelectItem>
                <SelectItem value="High">{t('priority_high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              {t('form_notes')}
            </label>
            <Input id="notes" name="notes" defaultValue={initialLesson?.notes ?? ''} />
          </div>
        </div>

        {/* ── Vocabulary ── */}
        <div className="mt-2 pt-4 border-t border-border flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="m-0 text-base">{t('vocab_section_title')}</h3>
          </div>
          {vocabularies.length === 0 && (
            <p className="block w-fit ml-4! p-1 italic bg-primary/40">{t('no_vocabularies')}</p>
          )}
          {vocabularies.map((vocab, index) => (
            <div
              key={vocab.id}
              className="flex flex-col gap-3 border border-border rounded-lg bg-muted/20 p-4"
            >
              {/* Header: index + remove */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium bg-primary py-1 px-2 pr-8 text-primary-foreground">
                  #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveVocab(vocab.id)}
                  aria-label={t('remove_vocab_btn')}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              {/* Row 1: Word · IPA · PoS · Pronunciation — 4 cols on laptop */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">{t('vocab_word')}*</label>
                  <Input
                    name={`vocab_${index}_word`}
                    required
                    defaultValue={vocabularies[index]?.word ?? ''}
                    placeholder="ex: happy"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">{t('vocab_ipa')}</label>
                  <Input
                    name={`vocab_${index}_ipa`}
                    defaultValue={vocabularies[index]?.ipa ?? ''}
                    placeholder="ex: /ˈhæpi/"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">{t('vocab_pos')}</label>
                  <Input
                    name={`vocab_${index}_partOfSpeech`}
                    defaultValue={vocabularies[index]?.partOfSpeech ?? ''}
                    placeholder="ex: adjective"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">{t('vocab_pronunciation')}</label>
                  <Input
                    name={`vocab_${index}_pronunciation`}
                    defaultValue={vocabularies[index]?.pronunciation ?? ''}
                    placeholder="ex: /ˈhæpi/"
                  />
                </div>
              </div>

              {/* Translation */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('vocab_translation')}*</label>
                <Input
                  name={`vocab_${index}_translation`}
                  required
                  defaultValue={vocabularies[index]?.translation ?? ''}
                  placeholder="ex: vui vẻ"
                />
              </div>

              {/* Meaning — textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('vocab_meaning')}*</label>
                <Textarea
                  name={`vocab_${index}_meaning`}
                  required
                  defaultValue={vocabularies[index]?.meaning ?? ''}
                  rows={2}
                  placeholder="ex: Feeling or showing pleasure or contentment."
                />
              </div>

              {/* Example — textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t('vocab_example')}</label>
                <Textarea
                  name={`vocab_${index}_example`}
                  defaultValue={vocabularies[index]?.example ?? ''}
                  rows={2}
                  placeholder="ex: She was happy to see her friends."
                />
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={vocabBottomRef} />
        </div>

        {/* ── Sticky footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/94 backdrop-blur-[10px]">
          <div className="w-full max-w-[60rem] !mx-auto px-4 md:px-8 py-3 flex flex-col gap-3">
            {/* Load vocabulary from AI */}
            <div className="flex flex-col md:flex-row gap-2 items-start">
              <div className="flex-1">
                <Input
                  id="new-vocab"
                  className="w-full"
                  name="new-vocab"
                  type="text"
                  value={newVocab}
                  onChange={onChangeNewVocab}
                  onKeyDown={handleNewVocabKeyDown}
                  placeholder="ex: happy"
                  disabled={isGenerating}
                />
                <p className="mt-0 pl-1 text-sm italic text-muted-foreground">
                  {t('load_vocab_description')}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button type="button" onClick={handleLoadVocab} disabled={isGenerating}>
                  {isGenerating && <LoaderCircleIcon className="animate-spin" />}
                  {isGenerating ? 'Loading...' : t('load_vocab_btn')}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleAddVocab}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add_vocab_btn')}
                </Button>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-3 justify-end items-center flex-wrap">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />}
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
