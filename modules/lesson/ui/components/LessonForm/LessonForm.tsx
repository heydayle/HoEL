'use client';

import React, { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';

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

import {
  FormCard,
  FormGroup,
  FormLabel,
  FormRow,
  FormSection,
  FooterActions,
  VocabHeader,
  VocabIndex,
  VocabItem,
  VocabItemHeader,
  VocabSection,
  VocabTitle,
} from './styled';
import { useGenerateVocab } from '../../hooks/useGenerateVocab';

interface ILessonFormProps {
  t: (key: string) => string;
  title: string;
  description: string;
  submitLabel: string;
  initialLesson?: ILesson | null;
  onSubmitLesson: (lesson: Omit<ILesson, 'id'>) => void;
  onCancel: () => void;
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
}: ILessonFormProps): React.JSX.Element {
  const { generate, isLoading, newVocab, setNewVocab, setVocabularies, vocabularies } = useGenerateVocab(initialLesson);
  const isEditing = !!initialLesson;

  const defaultDate = useMemo(() => {
    if (initialLesson) {
      return new Date(initialLesson.date).toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }, [initialLesson]);

  const onChangeNewVocab = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVocab(event.target.value);
  }
  const handleLoadVocab = () => {
    if (newVocab.trim() === '') return;

    generate(newVocab);
  };

  const handleAddVocab = () => {
    setVocabularies([
      ...vocabularies,
      {
        id: `vocab-${Date.now()}`,
        word: '',
        ipa: '',
        partOfSpeech: '',
        meaning: '',
        translation: '',
        pronunciation: '',
        example: '',
      },
    ]);
  };

  const handleRemoveVocab = (id: string) => {
    setVocabularies(vocabularies.filter((vocab) => vocab.id !== id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      links: isEditing ? initialLesson!.links : [],
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
      questions: isEditing ? initialLesson!.questions : [],
    };

    onSubmitLesson(lesson);
  };

  return (
    <FormCard>
      <FormSection onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="topic">{t('form_topic')}</FormLabel>
          <Input id="topic" name="topic" required defaultValue={initialLesson?.topic ?? ''} />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="participantName">{t('form_participant')}</FormLabel>
            <Input
              id="participantName"
              name="participantName"
              required
              defaultValue={initialLesson?.participantName ?? ''}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="date">{t('form_date')}</FormLabel>
            <Input id="date" name="date" type="date" required defaultValue={defaultDate} />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <FormLabel htmlFor="priority">{t('form_priority')}</FormLabel>
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
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="notes">{t('form_notes')}</FormLabel>
          <Textarea id="notes" name="notes" defaultValue={initialLesson?.notes ?? ''} />
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
                  <Input name={`vocab_${index}_word`} required defaultValue={vocabularies[index]?.word ?? ''} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_ipa')}</FormLabel>
                  <Input name={`vocab_${index}_ipa`} defaultValue={vocabularies[index]?.ipa ?? ''} />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel>{t('vocab_pos')}</FormLabel>
                  <Input
                    name={`vocab_${index}_partOfSpeech`}
                    defaultValue={vocabularies[index]?.partOfSpeech ?? ''}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_meaning')}*</FormLabel>
                  <Input name={`vocab_${index}_meaning`} required defaultValue={vocabularies[index]?.meaning ?? ''} />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel>{t('vocab_translation')}*</FormLabel>
                  <Input
                    name={`vocab_${index}_translation`}
                    required
                    defaultValue={vocabularies[index]?.translation ?? ''}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_pronunciation')}</FormLabel>
                  <Input
                    name={`vocab_${index}_pronunciation`}
                    defaultValue={vocabularies[index]?.pronunciation ?? ''}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>{t('vocab_example')}</FormLabel>
                <Input name={`vocab_${index}_example`} defaultValue={vocabularies[index]?.example ?? ''} />
              </FormGroup>
            </VocabItem>
          ))}

          {/** input add new vocabulary*/}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', padding: '0 1rem' }}>
            <Input id="new-vocab" name="new-vocab" type="text" value={newVocab} onChange={onChangeNewVocab} />
            <Button type="button" variant="outline" onClick={handleLoadVocab} disabled={isLoading}>
              {t('load_vocab_btn')}
            </Button>
          </div>
        </VocabSection>

        <FooterActions>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </FooterActions>
      </FormSection>
    </FormCard>
  );
}
