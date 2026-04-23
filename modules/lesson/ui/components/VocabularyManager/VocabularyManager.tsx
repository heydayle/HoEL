'use client';

import { Edit2, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import type {
  IVocabularyRow,
  IVocabularyUpdatePayload,
} from '@/modules/lesson/core/models';
import {
  Badge,
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

  /** Fetch vocabulary list on mount. */
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /** Sync draft form with AI-generated draft data. */
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

  /** Handles the AI generation trigger. */
  const onGenerate = useCallback(() => {
    if (aiWord.trim()) {
      handleGenerate(aiWord);
    }
  }, [aiWord, handleGenerate]);

  /** Intercepts Enter key to trigger AI generation. */
  const onAiKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onGenerate();
      }
    },
    [onGenerate],
  );

  /** Updates a single field in the draft form. */
  const updateDraftField = useCallback(
    (field: string, value: string) => {
      setDraftForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Saves the reviewed draft as a new vocabulary record. */
  const onSaveDraft = useCallback(() => {
    handleCreate(draftForm);
  }, [draftForm, handleCreate]);

  /** Opens the edit dialog for a specific vocabulary row. */
  const onEditClick = useCallback((vocab: IVocabularyRow) => {
    setEditingVocab({ ...vocab });
  }, []);

  /** Submits the edit dialog changes. */
  const onEditSubmit = useCallback(() => {
    if (!editingVocab) return;

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

  /** Confirms deletion of the selected vocabulary. */
  const onDeleteConfirm = useCallback(() => {
    if (deletingVocab) {
      handleDelete(deletingVocab.id);
      setDeletingVocab(null);
    }
  }, [deletingVocab, handleDelete]);

  /** Adds a blank vocabulary entry for manual input. */
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
    <section className="flex flex-col gap-4 mt-4 pt-6 border-t-2 border-brutal-black">
      {/* ── Section header ── */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="m-0 text-lg font-semibold flex items-center gap-2">
          {t('vocab_mgr_title')}{' '}
          <Badge variant="secondary" className="text-xs font-semibold">{vocabularies.length}</Badge>
        </h2>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddManual}
          disabled={isLoading}
          id="btn-add-vocab-manual"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {t('vocab_mgr_add_manual')}
        </Button>
      </div>

      {/* ── AI generation input ── */}
      <div>
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            id="ai-vocab-input"
            type="text"
            value={aiWord}
            onChange={(e) => setAiWord(e.target.value)}
            onKeyDown={onAiKeyDown}
            placeholder={t('vocab_mgr_ai_placeholder')}
            disabled={isLoading}
            className="flex-1 min-w-[12rem]"
          />
          <Button
            type="button"
            variant="default"
            onClick={onGenerate}
            disabled={isLoading || !aiWord.trim()}
            id="btn-generate-ai"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-1.5" />
            )}
            {isLoading ? t('vocab_mgr_generating') : t('vocab_mgr_generate_ai')}
          </Button>
        </div>
        <p className="mt-1.5 pl-1 text-xs text-muted-foreground italic">{t('vocab_mgr_ai_helper')}</p>
      </div>

      {/* ── Draft review card ── */}
      {draftVocab && (
        <div id="draft-review-card" className="p-4 border-2 border-dashed border-brutal-black rounded-[var(--rounded-bento)] bg-lemon/10 shadow-[var(--shadow-brutal-sm)]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">{t('vocab_mgr_draft_title')}</span>
            <Button type="button" variant="ghost" size="icon" onClick={clearDraft} aria-label={t('cancel')}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('vocab_word')}*</label>
              <Input value={draftForm.word} onChange={(e) => updateDraftField('word', e.target.value)} placeholder="ex: happy" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('vocab_ipa')}</label>
              <Input value={draftForm.ipa} onChange={(e) => updateDraftField('ipa', e.target.value)} placeholder="ex: /ˈhæpi/" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('vocab_pos')}</label>
              <Input value={draftForm.partOfSpeech} onChange={(e) => updateDraftField('partOfSpeech', e.target.value)} placeholder="ex: adjective" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('vocab_pronunciation')}</label>
              <Input value={draftForm.pronunciation} onChange={(e) => updateDraftField('pronunciation', e.target.value)} placeholder="ex: hap-ee" />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <label className="text-xs font-medium text-muted-foreground">{t('vocab_translation')}*</label>
            <Input value={draftForm.translation} onChange={(e) => updateDraftField('translation', e.target.value)} placeholder="ex: vui vẻ" />
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <label className="text-xs font-medium text-muted-foreground">{t('vocab_meaning')}*</label>
            <Textarea value={draftForm.meaning} onChange={(e) => updateDraftField('meaning', e.target.value)} rows={2} placeholder="ex: Feeling or showing pleasure." />
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <label className="text-xs font-medium text-muted-foreground">{t('vocab_example')}</label>
            <Textarea value={draftForm.example} onChange={(e) => updateDraftField('example', e.target.value)} rows={2} placeholder="ex: She was happy to see her friends." />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" size="sm" onClick={clearDraft}>{t('vocab_mgr_discard')}</Button>
            <Button type="button" size="sm" onClick={onSaveDraft} disabled={!draftForm.word.trim()} id="btn-save-draft">{t('vocab_mgr_save')}</Button>
          </div>
        </div>
      )}

      {/* ── Vocabulary list ── */}
      {vocabularies.length === 0 && !isLoading ? (
        <p className="py-6 px-4 text-center text-muted-foreground border-2 border-dashed border-brutal-black rounded-[var(--rounded-bento)] italic font-medium">{t('vocab_mgr_empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {vocabularies.map((vocab) => (
            <div key={vocab.id} id={`vocab-card-${vocab.id}`} className="p-4 border-2 border-brutal-black rounded-[calc(var(--rounded-bento)*0.6)] bg-card shadow-[var(--shadow-brutal-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[var(--shadow-brutal-md)]">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground bg-[var(--highlight)] px-1 rounded">{vocab.word}</span>
                    {vocab.partOfSpeech && (
                      <Badge variant="secondary" className="text-[0.65rem]">{vocab.partOfSpeech}</Badge>
                    )}
                  </div>
                  {vocab.ipa && <p className="mt-0.5 text-sm text-muted-foreground italic">{vocab.ipa}</p>}
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <Button type="button" variant="ghost" size="icon" onClick={() => onEditClick(vocab)} aria-label={t('vocab_mgr_edit')} id={`btn-edit-${vocab.id}`}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setDeletingVocab(vocab)} aria-label={t('vocab_mgr_delete')} id={`btn-delete-${vocab.id}`}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>

              {vocab.meaning && (
                <div className="mt-2">
                  <span className="text-[0.7rem] font-semibold text-muted-foreground/60 uppercase tracking-wider">{t('vocab_meaning')}</span>
                  <p className="mt-0.5 text-sm text-foreground/90 leading-relaxed">{vocab.meaning}</p>
                </div>
              )}

              {vocab.translation && (
                <div className="mt-2">
                  <span className="text-[0.7rem] font-semibold text-muted-foreground/60 uppercase tracking-wider">{t('vocab_translation')}</span>
                  <p className="mt-0.5 text-sm text-foreground/90 leading-relaxed">{vocab.translation}</p>
                </div>
              )}

              {vocab.example && (
                <div className="mt-2">
                  <span className="text-[0.7rem] font-semibold text-muted-foreground/60 uppercase tracking-wider">{t('vocab_example')}</span>
                  <p className="mt-0.5 text-sm italic text-muted-foreground leading-relaxed">{vocab.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Edit dialog ── */}
      <Dialog open={!!editingVocab} onOpenChange={(open) => { if (!open) setEditingVocab(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vocab_mgr_edit_title')}</DialogTitle>
            <DialogDescription>{t('vocab_mgr_edit_desc')}</DialogDescription>
          </DialogHeader>

          {editingVocab && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1"><label className="text-xs font-medium text-muted-foreground">{t('vocab_word')}*</label><Input value={editingVocab.word} onChange={(e) => setEditingVocab({ ...editingVocab, word: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-xs font-medium text-muted-foreground">{t('vocab_ipa')}</label><Input value={editingVocab.ipa} onChange={(e) => setEditingVocab({ ...editingVocab, ipa: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-xs font-medium text-muted-foreground">{t('vocab_pos')}</label><Input value={editingVocab.partOfSpeech} onChange={(e) => setEditingVocab({ ...editingVocab, partOfSpeech: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-xs font-medium text-muted-foreground">{t('vocab_pronunciation')}</label><Input value={editingVocab.pronunciation} onChange={(e) => setEditingVocab({ ...editingVocab, pronunciation: e.target.value })} /></div>
              <div className="flex flex-col gap-1 sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">{t('vocab_translation')}*</label><Input value={editingVocab.translation} onChange={(e) => setEditingVocab({ ...editingVocab, translation: e.target.value })} /></div>
              <div className="flex flex-col gap-1 sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">{t('vocab_meaning')}*</label><Textarea value={editingVocab.meaning} onChange={(e) => setEditingVocab({ ...editingVocab, meaning: e.target.value })} rows={2} /></div>
              <div className="flex flex-col gap-1 sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">{t('vocab_example')}</label><Textarea value={editingVocab.example} onChange={(e) => setEditingVocab({ ...editingVocab, example: e.target.value })} rows={2} /></div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingVocab(null)}>{t('cancel')}</Button>
            <Button type="button" onClick={onEditSubmit} id="btn-edit-save">{t('vocab_mgr_save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={!!deletingVocab} onOpenChange={(open) => { if (!open) setDeletingVocab(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vocab_mgr_delete_title')}</DialogTitle>
            <DialogDescription>{t('vocab_mgr_delete_desc')}</DialogDescription>
          </DialogHeader>

          <p className="text-sm text-foreground/80 py-2">
            {t('vocab_mgr_delete_confirm')}{' '}
            <strong className="text-foreground font-semibold">{deletingVocab?.word}</strong>?
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeletingVocab(null)}>{t('cancel')}</Button>
            <Button type="button" variant="destructive" onClick={onDeleteConfirm} id="btn-delete-confirm">{t('vocab_mgr_confirm_delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
