'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import type { ILesson, LessonPriority } from '@/app/modules/lesson/core/models';
import {
  Button,
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/Styled';

import {
  FormGroup,
  FormLabel,
  FormRow,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalForm,
  ModalHeader,
  VocabHeader,
  VocabIndex,
  VocabItem,
  VocabItemHeader,
  VocabSection,
  VocabTitle,
} from './styled';

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

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && editingLesson) {
      setVocabularies(editingLesson.vocabularies.map((v) => ({ id: v.id })));
    }
  }, [editingLesson, isEditing]);

  // Close modal when editingLesson changes to null
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

  /**
   * Appends a new empty vocabulary entry to the list.
   */
  const handleAddVocab = () => {
    setVocabularies([...vocabularies, { id: `vocab-${Date.now()}` }]);
  };

  /**
   * Removes a vocabulary entry by its id.
   * @param id - Vocabulary entry id
   */
  const handleRemoveVocab = (id: string) => {
    setVocabularies(vocabularies.filter((v) => v.id !== id));
  };

  /**
   * Evaluates form submission and constructs the lesson object.
   * @param e - React form event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // We get ISO string of selected date and append a mock time to match expected ISO format
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
      links: isEditing ? editingLesson!.links : [],
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
      questions: isEditing ? editingLesson!.questions : [],
    };

    if (isEditing && editingLesson && onEditLesson) {
      onEditLesson(editingLesson.id, lesson);
    } else {
      onAddLesson(lesson);
    }

    setVocabularies([]);
    setOpen(false);
  };

  // Set open state when editingLesson changes
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

      <ModalContent>
        <ModalHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : t('create_lesson_title')}</DialogTitle>
          <DialogDescription>{isEditing ? 'Update lesson details' : t('create_lesson_desc')}</DialogDescription>
        </ModalHeader>

        <ModalForm key={editingLesson?.id || 'create'} onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <FormLabel htmlFor="topic">{t('form_topic')}</FormLabel>
              <Input id="topic" name="topic" required defaultValue={isEditing ? editingLesson?.topic : ''} />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="participantName">{t('form_participant')}</FormLabel>
                <Input id="participantName" name="participantName" required defaultValue={isEditing ? editingLesson?.participantName : ''} />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="date">{t('form_date')}</FormLabel>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={isEditing ? editingLesson ? new Date(editingLesson.date).toISOString().split('T')[0] : '' : new Date().toISOString().split('T')[0]}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <FormLabel htmlFor="priority">{t('form_priority')}</FormLabel>
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
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="notes">{t('form_notes')}</FormLabel>
              <Input id="notes" name="notes" defaultValue={isEditing ? editingLesson?.notes : ''} />
            </FormGroup>

            <VocabSection>
              <VocabHeader>
                <VocabTitle>{t('vocab_section_title')}</VocabTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleAddVocab}>
                  <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  {t('add_vocab_btn')}
                </Button>
              </VocabHeader>

              {vocabularies.map((vocab, index) => (
                <VocabItem key={vocab.id}>
                  <VocabItemHeader>
                    <VocabIndex>#{index + 1}</VocabIndex>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVocab(vocab.id)}
                      aria-label={t('remove_vocab_btn')}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem', color: 'hsl(var(--destructive))' }} />
                    </Button>
                  </VocabItemHeader>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>{t('vocab_word')}*</FormLabel>
                      <Input name={`vocab_${index}_word`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.word ?? '' : ''} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>{t('vocab_ipa')}</FormLabel>
                      <Input name={`vocab_${index}_ipa`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.ipa ?? '' : ''} />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>{t('vocab_pos')}</FormLabel>
                      <Input name={`vocab_${index}_partOfSpeech`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.partOfSpeech ?? '' : ''} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>{t('vocab_meaning')}*</FormLabel>
                      <Input name={`vocab_${index}_meaning`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.meaning ?? '' : ''} />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <FormLabel>{t('vocab_translation')}*</FormLabel>
                      <Input name={`vocab_${index}_translation`} required defaultValue={isEditing ? editingLesson?.vocabularies[index]?.translation ?? '' : ''} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>{t('vocab_pronunciation')}</FormLabel>
                      <Input name={`vocab_${index}_pronunciation`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.pronunciation ?? '' : ''} />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <FormLabel>{t('vocab_example')}</FormLabel>
                    <Input name={`vocab_${index}_example`} defaultValue={isEditing ? editingLesson?.vocabularies[index]?.example ?? '' : ''} />
                  </FormGroup>
                </VocabItem>
              ))}
            </VocabSection>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setVocabularies([]);
                setOpen(false);
              }}
            >
              {t('cancel')}
            </Button>
            <Button type="submit">{isEditing ? t('update_lesson_submit') : t('create_lesson_submit')}</Button>
          </ModalFooter>
        </ModalForm>
      </ModalContent>
    </Dialog>
  );
}
