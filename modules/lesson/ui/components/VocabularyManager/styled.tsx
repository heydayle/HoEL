import styled, { keyframes } from 'styled-components';

import { Badge, Card, Input } from '@/shared/components/Styled';

/**
 * Fade-in + slide-up animation used when list items enter the DOM.
 */
const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Root wrapper for the VocabularyManager panel.
 */
export const VocabManagerRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/**
 * Header row with the section title and action controls.
 */
export const VocabManagerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

/**
 * Section title for the vocabulary panel.
 */
export const VocabManagerTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
`;

/**
 * Counter badge showing the total vocabulary count.
 */
export const VocabCountBadge = styled(Badge)`
  font-variant-numeric: tabular-nums;
  background: var(--accent-primary-light);
  color: var(--accent-primary);
`;

/**
 * AI generation input row — input + button side by side.
 */
export const AiGenerateRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

/**
 * Helper text displayed below the AI input row.
 */
export const AiHelperText = styled.p`
  margin: 0;
  padding-left: 0.25rem;
  font-size: 0.8125rem;
  color: hsl(var(--muted-foreground));
`;

/**
 * Draft review card — shown when AI has generated vocab data
 * and the user can edit before saving.
 */
export const DraftCard = styled(Card)`
  padding: 1rem 1.25rem;
  border: 1px dashed var(--accent-primary);
  background: hsl(var(--accent) / 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${fadeSlideIn} 0.3s ease-out;
`;

/**
 * Title row inside the draft card.
 */
export const DraftCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Draft card section label.
 */
export const DraftLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-primary);
`;

/**
 * Grid layout for draft editing fields.
 * 2 columns on tablets, 4 on desktop.
 */
export const DraftFieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

/**
 * Draft field wrapper.
 */
export const DraftField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

/**
 * Label for a draft field.
 */
export const DraftFieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground-secondary);
`;

/**
 * Full-width draft field for longer content (meaning, example).
 */
export const DraftFieldFull = styled(DraftField)`
  grid-column: 1 / -1;
`;

/**
 * Draft card footer with save / discard actions.
 */
export const DraftActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

/**
 * Scrollable vocabulary list container.
 */
export const VocabList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Single vocabulary item card in the saved list.
 */
export const VocabCard = styled(Card)`
  padding: 1rem 1.25rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.35);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeSlideIn} 0.25s ease-out;

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

/**
 * Top row inside a vocab card — word + actions.
 */
export const VocabCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

/**
 * Left side of vocab card header.
 */
export const VocabCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

/**
 * Primary word label.
 */
export const VocabWord = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
`;

/**
 * IPA / phonetic text.
 */
export const VocabIpa = styled.span`
  font-size: 0.8125rem;
  color: var(--foreground-secondary);
  font-style: italic;
`;

/**
 * Part of speech badge.
 */
export const VocabPosBadge = styled(Badge)`
  font-size: 0.75rem;
  padding: 2px 8px;
`;

/**
 * Actions container for a vocab card (Edit, Delete buttons).
 */
export const VocabCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

/**
 * Detail row (meaning, translation, example) inside a card.
 */
export const VocabDetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

/**
 * Small meta-label inside detail rows.
 */
export const VocabDetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--foreground-secondary);
`;

/**
 * Detail value text.
 */
export const VocabDetailValue = styled.span`
  font-size: 0.875rem;
  color: var(--foreground);
  line-height: 1.45;
`;

/**
 * Example sentence — slightly different styling.
 */
export const VocabExample = styled.span`
  font-size: 0.8125rem;
  color: var(--foreground-secondary);
  font-style: italic;
  line-height: 1.45;
`;

/**
 * Empty state message when no vocabularies exist.
 */
export const VocabEmptyState = styled.p`
  margin: 0;
  padding: 1.25rem 1rem;
  border-radius: var(--radius-md);
  border: 1px dashed hsl(var(--border));
  color: var(--foreground-secondary);
  text-align: center;
  font-size: 0.875rem;
`;

/**
 * Styled input for the edit dialog fields.
 */
export const EditDialogInput = styled(Input)`
  width: 100%;
`;

/**
 * Grid for edit dialog fields.
 */
export const EditDialogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/**
 * Edit dialog form group.
 */
export const EditFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

/**
 * Full-width edit form group.
 */
export const EditFormGroupFull = styled(EditFormGroup)`
  grid-column: 1 / -1;
`;

/**
 * Label for edit dialog fields.
 */
export const EditFieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground-secondary);
`;

/**
 * Delete confirmation text.
 */
export const DeleteConfirmText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--foreground);
  line-height: 1.5;
`;

/**
 * Highlighted word inside the delete confirmation.
 */
export const DeleteHighlight = styled.strong`
  color: hsl(var(--destructive));
`;
