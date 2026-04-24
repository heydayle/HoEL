'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import type { ILesson, LessonPriority } from '@/modules/lesson/core/models';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/Styled';

/**
 * Props for CreateLessonModal component.
 */
interface ICreateLessonModalProps {
  /** Translation function */
  t: (key: string) => string;
  /** Callback when new lesson is created */
  onAddLesson: (lesson: Omit<ILesson, 'id'>) => void;
  /** Optional lesson to edit */
  editingLesson?: ILesson | null;
  /** Callback when lesson is edited */
  onEditLesson?: (lessonId: string, lesson: Omit<ILesson, 'id'>) => void;
  /** Callback when modal closes */
  onClose?: () => void;
  /** Whether the modal should start opened */
  defaultOpen?: boolean;
  /** Hides the trigger button when true */
  hideTrigger?: boolean;
}

/**
 * Modal dialog with form for creating or editing a lesson.
 * @param props - Component props
 * @returns Modal component
 */
export function CreateLessonModal({ 
  t, 
  onAddLesson, 
  editingLesson, 
  onEditLesson,
  onClose,
  defaultOpen = false,
  hideTrigger = false,
}: ICreateLessonModalProps): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen);
  const [vocabularies, setVocabularies] = useState<{ id: string }[]>([]);
  const isEditing = !!editingLesson;

  useEffect(() => {
    if (isEditing && editingLesson) {
      setVocabularies(editingLesson.vocabularies.map((v) => ({ id: v.id })));
    }
  }, [editingLesson, isEditing]);

  useEffect(() => {
    if (!isEditing && open) {
      setOpen(false);
    }
  }, [isEditing, open]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  /** Appends a new empty vocabulary entry to the list. */
  const handleAddVocab = () => {
    setVocabularies([...vocabularies, { id: `vocab-${Date.now()}` }]);
  };

  /** Removes a vocabulary entry by its id. */
  const handleRemoveVocab = (id: string) => {
    setVocabularies(vocabularies.filter((v) => v.id !== id));
  };

  /** Evaluates form submission and constructs the lesson object. */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let dateStr = formData.get('date') as string;
    if (dateStr && !dateStr.includes('T')) {
      dateStr = `${dateStr}T09:00:00.000Z`;
    }

    const lesson: Omit<ILesson, 'id'> = {
      topic: formData.get('topic') as string,
      participantName: formData.get('participantName') as string,
      date: dateStr,
      notes: formData.get('notes') as string,
      priority: formData.get('priority') as LessonPriority,
      isPinned: isEditing ? editingLesson!.isPinned : false,
      isFavorite: isEditing ? editingLesson!.isFavorite : false,
      vocabularies: vocabularies
        .map((v, index) => ({
          id: v.id,
          word: (formData.get(`vocab_${index}_word`) as string) || '',
          ipa: (formData.get(`vocab_${index}_ipa`) as string) || '',
          partOfSpeech: (formData.get(`vocab_${index}_partOfSpeech`) as string) || '',
          meaning: (formData.get(`vocab_${index}_meaning`) as string) || '',
          translation: (formData.get(`vocab_${index}_translation`) as string) || '',
          pronunciation: (formData.get(`vocab_${index}_pronunciation`) as string) || '',
          example: (formData.get(`vocab_${index}_example`) as string) || '',
        }))
        .filter((v) => v.word.trim() !== ''),
    };

    if (isEditing && editingLesson && onEditLesson) {
      onEditLesson(editingLesson.id, lesson);
    } else {
      onAddLesson(lesson);
    }

    setVocabularies([]);
    setOpen(false);
  };

  useEffect(() => {
    if (editingLesson) {
      setOpen(true);
    }
  }, [editingLesson]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditing && !hideTrigger && (
        <DialogTrigger render={<Button />}>
          {t('create_lesson_title')}
        </DialogTrigger>
      )}

      <DialogContent className="flex! flex-col! max-h-[80vh]! overflow-hidden! p-0! gap-0! sm:max-w-[42rem]! rounded-[var(--rounded-bento)]! border-2! border-brutal-black! shadow-[var(--shadow-brutal-md)]!">
        <DialogHeader className="shrink-0! p-6! border-b-2! border-brutal-black!">
          <DialogTitle>{isEditing ? 'Edit Lesson' : t('create_lesson_title')}</DialogTitle>
          <DialogDescription>{isEditing ? 'Update lesson details' : t('create_lesson_desc')}</DialogDescription>
        </DialogHeader>

        <form key={editingLesson?.id || 'create'} onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2 mb-1">
              <label htmlFor="topic" className="text-sm font-medium">{t('form_topic')}</label>
              <Input id="topic" name="topic" required defaultValue={isEditing ? editingLesson?.topic : ''} />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
              <div className="flex flex-col gap-2 mb-1">
                <label htmlFor="participantName" className="text-sm font-medium">{t('form_participant')}</label>
                <Input id="participantName" name="participantName" required defaultValue={isEditing ? editingLesson?.participantName : ''} />
              </div>
              <div className="flex flex-col gap-2 mb-1">
                <label htmlFor="date" className="text-sm font-medium">{t('form_date')}</label>
                <Input id="date" name="date" type="date" required defaultValue={isEditing ? editingLesson ? new Date(editingLesson.date).toISOString().split('T')[0] : '' : new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-1">
              <label htmlFor="priority" className="text-sm font-medium">{t('form_priority')}</label>
              <Select name="priority" defaultValue={isEditing ? editingLesson?.priority : 'Medium'}>
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

            <div className="flex flex-col gap-2 mb-1">
              <label htmlFor="notes" className="text-sm font-medium">{t('form_notes')}</label>
              <Input id="notes" name="notes" defaultValue={isEditing ? editingLesson?.notes : ''} />
            </div>

            {/* Vocabulary Section */}
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t-2 border-brutal-black">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">{t('vocab_section_title')}</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddVocab}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add_vocab_btn')}
                </Button>
              </div>

              {vocabularies.map((vocab, index) => (
                <div key={vocab.id} className="flex flex-col gap-2 p-4 border-2 border-brutal-black rounded-[calc(var(--rounded-bento)*0.6)] bg-card shadow-[var(--shadow-brutal-sm)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveVocab(vocab.id)} aria-label={t('remove_vocab_btn')}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_word')}*</label><Input name={`vocab_${index}_word`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.word ?? '' : ''} /></div>
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_ipa')}</label><Input name={`vocab_${index}_ipa`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.ipa ?? '' : ''} /></div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_pos')}</label><Input name={`vocab_${index}_partOfSpeech`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.partOfSpeech ?? '' : ''} /></div>
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_meaning')}*</label><Input name={`vocab_${index}_meaning`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.meaning ?? '' : ''} /></div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:[&>*]:flex-1">
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_translation')}*</label><Input name={`vocab_${index}_translation`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.translation ?? '' : ''} /></div>
                    <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_pronunciation')}</label><Input name={`vocab_${index}_pronunciation`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.pronunciation ?? '' : ''} /></div>
                  </div>

                  <div className="flex flex-col gap-2"><label className="text-sm font-medium">{t('vocab_example')}</label><Input name={`vocab_${index}_example`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.example ?? '' : ''} /></div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="shrink-0! m-0! py-4 px-6! flex! flex-row! justify-end! gap-2! border-t-2! border-brutal-black! rounded-b-[var(--rounded-bento)]!">
            <Button type="button" variant="outline" onClick={() => { setVocabularies([]); setOpen(false); }}>
              {t('cancel')}
            </Button>
            <Button type="submit">{isEditing ? t('update_lesson_submit') : t('create_lesson_submit')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
