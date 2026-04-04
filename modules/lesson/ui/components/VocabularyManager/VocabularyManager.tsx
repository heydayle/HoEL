'use client';

import { Edit2, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import type {
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/components/Styled';
import { useVocabulary } from '../../hooks/useVocabulary';

import {
  AiGenerateRow,
  AiHelperText,
  DeleteConfirmText,
  DeleteHighlight,
  DraftActions,
  DraftCard,
  DraftCardHeader,
  DraftField,
  DraftFieldFull,
  DraftFieldGrid,
  DraftFieldLabel,
  DraftLabel,
  EditDialogGrid,
  EditDialogInput,
  EditFieldLabel,
  EditFormGroup,
  EditFormGroupFull,
  VocabCard,
  VocabCardActions,
  VocabCardHeader,
  VocabCardInfo,
  VocabCountBadge,
  VocabDetailLabel,
  VocabDetailRow,
  VocabDetailValue,
  VocabEmptyState,
  VocabExample,
  VocabIpa,
  VocabList,
  VocabManagerHeader,
  VocabManagerRoot,
  VocabManagerTitle,
  VocabPosBadge,
  VocabWord,
} from './styled';

/**
 * Props for the VocabularyManager component.
 */
interface IVocabularyManagerProps {
  /** UUID of the parent lesson */
  lessonId: string;
  /** Translation function for i18n */
  t: (key: string) => string;
}

/**
 * Manages the full vocabulary lifecycle for a given lesson:
 * - AI-powered generation via Dify with draft review
 * - CRUD operations against Supabase
 * - Edit dialog and delete confirmation
 *
 * @param props - Component props
 * @returns Rendered vocabulary management panel
 */
export function VocabularyManager({
  lessonId,
  t,
}: IVocabularyManagerProps): React.JSX.Element {
  const {
    vocabularies,
    isLoading,
    draftVocab,
    aiWord,
    setAiWord,
    fetchList,
    handleGenerate,
    clearDraft,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useVocabulary(lessonId, t);

  /** Vocabulary selected for editing in the dialog */
  const [editingVocab, setEditingVocab] = useState<IVocabularyRow | null>(null);

  /** Vocabulary selected for delete confirmation */
  const [deletingVocab, setDeletingVocab] = useState<IVocabularyRow | null>(null);

  /** Local state for draft form editing before save */
  const [draftForm, setDraftForm] = useState({
    word: '',
    ipa: '',
    partOfSpeech: '',
    meaning: '',
    translation: '',
    pronunciation: '',
    example: '',
  });

  /**
   * Fetch vocabulary list on mount.
   */
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /**
   * Sync draft form with AI-generated draft data.
   */
  useEffect(() => {
    if (draftVocab) {
      setDraftForm({
        word: draftVocab.word ?? '',
        ipa: draftVocab.ipa ?? '',
        partOfSpeech: draftVocab.partOfSpeech ?? '',
        meaning: draftVocab.meaning ?? '',
        translation: draftVocab.translation ?? '',
        pronunciation: draftVocab.pronunciation ?? '',
        example: draftVocab.example ?? '',
      });
    }
  }, [draftVocab]);

  /**
   * Handles the AI generation trigger.
   */
  const onGenerate = useCallback(() => {
    if (aiWord.trim()) {
      handleGenerate(aiWord);
    }
  }, [aiWord, handleGenerate]);

  /**
   * Intercepts Enter key to trigger AI generation.
   */
  const onAiKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onGenerate();
      }
    },
    [onGenerate],
  );

  /**
   * Updates a single field in the draft form.
   */
  const updateDraftField = useCallback(
    (field: string, value: string) => {
      setDraftForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /**
   * Saves the reviewed draft as a new vocabulary record.
   */
  const onSaveDraft = useCallback(() => {
    handleCreate(draftForm);
  }, [draftForm, handleCreate]);

  /**
   * Opens the edit dialog for a specific vocabulary row.
   */
  const onEditClick = useCallback((vocab: IVocabularyRow) => {
    setEditingVocab({ ...vocab });
  }, []);

  /**
   * Submits the edit dialog changes.
   */
  const onEditSubmit = useCallback(() => {
    if (!editingVocab) {
      return;
    }

    const payload: IVocabularyUpdatePayload = {
      word: editingVocab.word,
      ipa: editingVocab.ipa,
      partOfSpeech: editingVocab.partOfSpeech,
      meaning: editingVocab.meaning,
      translation: editingVocab.translation,
      pronunciation: editingVocab.pronunciation,
      example: editingVocab.example,
    };

    handleUpdate(editingVocab.id, payload);
    setEditingVocab(null);
  }, [editingVocab, handleUpdate]);

  /**
   * Confirms deletion of the selected vocabulary.
   */
  const onDeleteConfirm = useCallback(() => {
    if (deletingVocab) {
      handleDelete(deletingVocab.id);
      setDeletingVocab(null);
    }
  }, [deletingVocab, handleDelete]);

  /**
   * Adds a blank vocabulary entry for manual input.
   */
  const onAddManual = useCallback(() => {
    handleCreate({
      word: '',
      ipa: '',
      partOfSpeech: '',
      meaning: '',
      translation: '',
      pronunciation: '',
      example: '',
    });
  }, [handleCreate]);

  return (
    <VocabManagerRoot>
      {/* ── Section header ── */}
      <VocabManagerHeader>
        <VocabManagerTitle>
          {t('vocab_mgr_title')}{' '}
          <VocabCountBadge>{vocabularies.length}</VocabCountBadge>
        </VocabManagerTitle>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddManual}
          disabled={isLoading}
          id="btn-add-vocab-manual"
        >
          <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} />
          {t('vocab_mgr_add_manual')}
        </Button>
      </VocabManagerHeader>

      {/* ── AI generation input ── */}
      <div>
        <AiGenerateRow>
          <Input
            id="ai-vocab-input"
            type="text"
            value={aiWord}
            onChange={(e) => setAiWord(e.target.value)}
            onKeyDown={onAiKeyDown}
            placeholder={t('vocab_mgr_ai_placeholder')}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="default"
            onClick={onGenerate}
            disabled={isLoading || !aiWord.trim()}
            id="btn-generate-ai"
          >
            {isLoading ? (
              <Loader2
                style={{
                  width: '1rem',
                  height: '1rem',
                  marginRight: '0.375rem',
                  animation: 'spin 1s linear infinite',
                }}
              />
            ) : (
              <Sparkles
                style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}
              />
            )}
            {isLoading ? t('vocab_mgr_generating') : t('vocab_mgr_generate_ai')}
          </Button>
        </AiGenerateRow>
        <AiHelperText>{t('vocab_mgr_ai_helper')}</AiHelperText>
      </div>

      {/* ── Draft review card ── */}
      {draftVocab && (
        <DraftCard id="draft-review-card">
          <DraftCardHeader>
            <DraftLabel>{t('vocab_mgr_draft_title')}</DraftLabel>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearDraft}
              aria-label={t('cancel')}
            >
              <X style={{ width: '1rem', height: '1rem' }} />
            </Button>
          </DraftCardHeader>

          <DraftFieldGrid>
            <DraftField>
              <DraftFieldLabel>{t('vocab_word')}*</DraftFieldLabel>
              <Input
                value={draftForm.word}
                onChange={(e) => updateDraftField('word', e.target.value)}
                placeholder="ex: happy"
              />
            </DraftField>
            <DraftField>
              <DraftFieldLabel>{t('vocab_ipa')}</DraftFieldLabel>
              <Input
                value={draftForm.ipa}
                onChange={(e) => updateDraftField('ipa', e.target.value)}
                placeholder="ex: /ˈhæpi/"
              />
            </DraftField>
            <DraftField>
              <DraftFieldLabel>{t('vocab_pos')}</DraftFieldLabel>
              <Input
                value={draftForm.partOfSpeech}
                onChange={(e) => updateDraftField('partOfSpeech', e.target.value)}
                placeholder="ex: adjective"
              />
            </DraftField>
            <DraftField>
              <DraftFieldLabel>{t('vocab_pronunciation')}</DraftFieldLabel>
              <Input
                value={draftForm.pronunciation}
                onChange={(e) => updateDraftField('pronunciation', e.target.value)}
                placeholder="ex: hap-ee"
              />
            </DraftField>
          </DraftFieldGrid>

          <DraftFieldFull>
            <DraftFieldLabel>{t('vocab_translation')}*</DraftFieldLabel>
            <Input
              value={draftForm.translation}
              onChange={(e) => updateDraftField('translation', e.target.value)}
              placeholder="ex: vui vẻ"
            />
          </DraftFieldFull>

          <DraftFieldFull>
            <DraftFieldLabel>{t('vocab_meaning')}*</DraftFieldLabel>
            <Textarea
              value={draftForm.meaning}
              onChange={(e) => updateDraftField('meaning', e.target.value)}
              rows={2}
              placeholder="ex: Feeling or showing pleasure."
            />
          </DraftFieldFull>

          <DraftFieldFull>
            <DraftFieldLabel>{t('vocab_example')}</DraftFieldLabel>
            <Textarea
              value={draftForm.example}
              onChange={(e) => updateDraftField('example', e.target.value)}
              rows={2}
              placeholder="ex: She was happy to see her friends."
            />
          </DraftFieldFull>

          <DraftActions>
            <Button type="button" variant="outline" size="sm" onClick={clearDraft}>
              {t('vocab_mgr_discard')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSaveDraft}
              disabled={!draftForm.word.trim()}
              id="btn-save-draft"
            >
              {t('vocab_mgr_save')}
            </Button>
          </DraftActions>
        </DraftCard>
      )}

      {/* ── Vocabulary list ── */}
      {vocabularies.length === 0 && !isLoading ? (
        <VocabEmptyState>{t('vocab_mgr_empty')}</VocabEmptyState>
      ) : (
        <VocabList>
          {vocabularies.map((vocab) => (
            <VocabCard key={vocab.id} id={`vocab-card-${vocab.id}`}>
              <VocabCardHeader>
                <VocabCardInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <VocabWord>{vocab.word}</VocabWord>
                    {vocab.partOfSpeech && (
                      <VocabPosBadge variant="secondary">{vocab.partOfSpeech}</VocabPosBadge>
                    )}
                  </div>
                  {vocab.ipa && <VocabIpa>{vocab.ipa}</VocabIpa>}
                </VocabCardInfo>

                <VocabCardActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(vocab)}
                    aria-label={t('vocab_mgr_edit')}
                    id={`btn-edit-${vocab.id}`}
                  >
                    <Edit2 style={{ width: '0.875rem', height: '0.875rem' }} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingVocab(vocab)}
                    aria-label={t('vocab_mgr_delete')}
                    id={`btn-delete-${vocab.id}`}
                  >
                    <Trash2
                      style={{
                        width: '0.875rem',
                        height: '0.875rem',
                        color: 'hsl(var(--destructive))',
                      }}
                    />
                  </Button>
                </VocabCardActions>
              </VocabCardHeader>

              {vocab.meaning && (
                <VocabDetailRow>
                  <VocabDetailLabel>{t('vocab_meaning')}</VocabDetailLabel>
                  <VocabDetailValue>{vocab.meaning}</VocabDetailValue>
                </VocabDetailRow>
              )}

              {vocab.translation && (
                <VocabDetailRow>
                  <VocabDetailLabel>{t('vocab_translation')}</VocabDetailLabel>
                  <VocabDetailValue>{vocab.translation}</VocabDetailValue>
                </VocabDetailRow>
              )}

              {vocab.example && (
                <VocabDetailRow>
                  <VocabDetailLabel>{t('vocab_example')}</VocabDetailLabel>
                  <VocabExample>{vocab.example}</VocabExample>
                </VocabDetailRow>
              )}
            </VocabCard>
          ))}
        </VocabList>
      )}

      {/* ── Edit dialog ── */}
      <Dialog
        open={!!editingVocab}
        onOpenChange={(open) => { if (!open) setEditingVocab(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vocab_mgr_edit_title')}</DialogTitle>
            <DialogDescription>{t('vocab_mgr_edit_desc')}</DialogDescription>
          </DialogHeader>

          {editingVocab && (
            <EditDialogGrid>
              <EditFormGroup>
                <EditFieldLabel>{t('vocab_word')}*</EditFieldLabel>
                <EditDialogInput
                  value={editingVocab.word}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, word: e.target.value })
                  }
                />
              </EditFormGroup>

              <EditFormGroup>
                <EditFieldLabel>{t('vocab_ipa')}</EditFieldLabel>
                <EditDialogInput
                  value={editingVocab.ipa}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, ipa: e.target.value })
                  }
                />
              </EditFormGroup>

              <EditFormGroup>
                <EditFieldLabel>{t('vocab_pos')}</EditFieldLabel>
                <EditDialogInput
                  value={editingVocab.partOfSpeech}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, partOfSpeech: e.target.value })
                  }
                />
              </EditFormGroup>

              <EditFormGroup>
                <EditFieldLabel>{t('vocab_pronunciation')}</EditFieldLabel>
                <EditDialogInput
                  value={editingVocab.pronunciation}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, pronunciation: e.target.value })
                  }
                />
              </EditFormGroup>

              <EditFormGroupFull>
                <EditFieldLabel>{t('vocab_translation')}*</EditFieldLabel>
                <EditDialogInput
                  value={editingVocab.translation}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, translation: e.target.value })
                  }
                />
              </EditFormGroupFull>

              <EditFormGroupFull>
                <EditFieldLabel>{t('vocab_meaning')}*</EditFieldLabel>
                <Textarea
                  value={editingVocab.meaning}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, meaning: e.target.value })
                  }
                  rows={2}
                />
              </EditFormGroupFull>

              <EditFormGroupFull>
                <EditFieldLabel>{t('vocab_example')}</EditFieldLabel>
                <Textarea
                  value={editingVocab.example}
                  onChange={(e) =>
                    setEditingVocab({ ...editingVocab, example: e.target.value })
                  }
                  rows={2}
                />
              </EditFormGroupFull>
            </EditDialogGrid>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingVocab(null)}
            >
              {t('cancel')}
            </Button>
            <Button type="button" onClick={onEditSubmit} id="btn-edit-save">
              {t('vocab_mgr_save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={!!deletingVocab}
        onOpenChange={(open) => { if (!open) setDeletingVocab(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vocab_mgr_delete_title')}</DialogTitle>
            <DialogDescription>{t('vocab_mgr_delete_desc')}</DialogDescription>
          </DialogHeader>

          <DeleteConfirmText>
            {t('vocab_mgr_delete_confirm')}{' '}
            <DeleteHighlight>{deletingVocab?.word}</DeleteHighlight>?
          </DeleteConfirmText>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingVocab(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              id="btn-delete-confirm"
            >
              {t('vocab_mgr_confirm_delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VocabManagerRoot>
  );
}
