'use client';

import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';

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

import { useGenerateVocab } from '../../hooks/useGenerateVocab';
import {
  FooterActions,
  FormCard,
  FormGroup,
  FormLabel,
  FormRow,
  FormSection,
  NewVocabRow,
  VocabHeader,
  VocabIndex,
  VocabItem,
  VocabItemHeader,
  VocabRow4,
  VocabSection,
  VocabTitle,
} from './styled';

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
  const { generate, isLoading, newVocab, setNewVocab, setVocabularies, vocabularies } =
    useGenerateVocab(initialLesson);
  const isEditing = !!initialLesson;

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
   * Auto-scroll to the bottom of the vocab list whenever a new entry is added
   * (i.e. after a successful generate or manual add).
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
   * Called on button click or Enter keypress in the new-vocab input.
   */
  const handleLoadVocab = () => {
    if (newVocab.trim() === '') return;

    generate(newVocab);
  };

  /**
   * Intercepts Enter key on the new-vocab input to trigger vocab loading
   * without submitting the outer form.
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

  /**
   * Removes a vocabulary entry by its id.
   * @param id - Vocabulary entry id
   */
  const handleRemoveVocab = (id: string) => {
    setVocabularies(vocabularies.filter((vocab) => vocab.id !== id));
  };

  /** Reads form data and calls the submit callback. */
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

    onSubmitLesson(lesson);
  };

  return (
    <FormCard>
      <FormSection onSubmit={handleSubmit}>
        {/* ── Lesson info ── */}
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

        <FormRow>
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
            <Input id="notes" name="notes" defaultValue={initialLesson?.notes ?? ''} />
          </FormGroup>
        </FormRow>

        {/* ── Vocabulary ── */}
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
              {/* Header: index + remove */}
              <VocabItemHeader>
                <VocabIndex>#{index + 1}</VocabIndex>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveVocab(vocab.id)}
                  aria-label={t('remove_vocab_btn')}
                >
                  <Trash2
                    style={{ width: '1rem', height: '1rem', color: 'hsl(var(--destructive))' }}
                  />
                </Button>
              </VocabItemHeader>

              {/* Row 1: Word · IPA · PoS · Pronunciation — 4 cols on laptop */}
              <VocabRow4>
                <FormGroup>
                  <FormLabel>{t('vocab_word')}*</FormLabel>
                  <Input
                    name={`vocab_${index}_word`}
                    required
                    defaultValue={vocabularies[index]?.word ?? ''}
                    placeholder="ex: happy"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_ipa')}</FormLabel>
                  <Input
                    name={`vocab_${index}_ipa`}
                    defaultValue={vocabularies[index]?.ipa ?? ''}
                    placeholder="ex: /ˈhæpi/"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_pos')}</FormLabel>
                  <Input
                    name={`vocab_${index}_partOfSpeech`}
                    defaultValue={vocabularies[index]?.partOfSpeech ?? ''}
                    placeholder="ex: adjective"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('vocab_pronunciation')}</FormLabel>
                  <Input
                    name={`vocab_${index}_pronunciation`}
                    defaultValue={vocabularies[index]?.pronunciation ?? ''}
                    placeholder="ex: /ˈhæpi/"
                  />
                </FormGroup>
              </VocabRow4>

              {/* Row 3: Translation */}
              <FormGroup>
                <FormLabel>{t('vocab_translation')}*</FormLabel>
                <Input
                  name={`vocab_${index}_translation`}
                  required
                  defaultValue={vocabularies[index]?.translation ?? ''}
                  placeholder="ex: vui vẻ"
                />
              </FormGroup>

              {/* Meaning — textarea */}
              <FormGroup>
                <FormLabel>{t('vocab_meaning')}*</FormLabel>
                <Textarea
                  name={`vocab_${index}_meaning`}
                  required
                  defaultValue={vocabularies[index]?.meaning ?? ''}
                  rows={2}
                  placeholder="ex: Feeling or showing pleasure or contentment."
                />
              </FormGroup>
              {/* Example — textarea */}
              <FormGroup>
                <FormLabel>{t('vocab_example')}</FormLabel>
                <Textarea
                  name={`vocab_${index}_example`}
                  defaultValue={vocabularies[index]?.example ?? ''}
                  rows={2}
                  placeholder="ex: She was happy to see her friends."
                />
              </FormGroup>
            </VocabItem>
          ))}

          {/* Scroll anchor — placed after the last vocab item */}
          <div ref={vocabBottomRef} />

          {/* Load vocabulary from AI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <NewVocabRow>
              <Input
                id="new-vocab"
                name="new-vocab"
                type="text"
                value={newVocab}
                onChange={onChangeNewVocab}
                onKeyDown={handleNewVocabKeyDown}
                placeholder="ex: happy"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLoadVocab}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : t('load_vocab_btn')}
              </Button>
            </NewVocabRow>
            <p
              style={{
                marginTop: '0',
                paddingLeft: '0.25rem',
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))',
              }}
            >
              {t('load_vocab_description')}
            </p>
          </div>
        </VocabSection>

        {/* ── Sticky footer ── */}
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
