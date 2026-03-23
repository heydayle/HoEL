import styled from 'styled-components';

import { DialogContent, DialogHeader } from '@/shared/components/Styled';

/**
 * Styled dialog content for lesson details modal.
 */
export const DetailModalContent = styled(DialogContent)`
  display: flex !important;
  flex-direction: column !important;
  max-height: 80vh !important;
  overflow: hidden !important;
  padding: 0 !important;
  gap: 0 !important;

  @media (min-width: 640px) {
    max-width: 44rem !important;
  }
`;

/**
 * Styled dialog header pinned to the top.
 */
export const DetailModalHeader = styled(DialogHeader)`
  flex-shrink: 0 !important;
  padding: 1rem !important;
  border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
`;

/**
 * Scrollable content wrapper.
 */
export const DetailContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/**
 * Section wrapper for detail groups.
 */
export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/**
 * Section title styling.
 */
export const DetailSectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

/**
 * Grid layout for multiple detail items.
 */
export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

/**
 * Single detail item wrapper.
 */
export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

/**
 * Label for detail items.
 */
export const DetailGroupLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

/**
 * Value display for details.
 */
export const DetailValue = styled.p`
  margin: 0;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  line-height: 1.5;
`;

/**
 * Badge for displaying priority or other status.
 */
export const DetailBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 0.25rem;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-size: 0.7rem;
  font-weight: 500;
`;

/**
 * Row layout for horizontal detail display.
 */
export const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

/**
 * Container for vocabulary list.
 */
export const DetailListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

/* ─────────────────────────────────────────────
   Vocabulary item rows
───────────────────────────────────────────── */

/**
 * Individual vocabulary item in detail view.
 * Clean card with a single top-border separator and no shadow.
 */
export const VocabDetailItem = styled.div`
  padding: 0.875rem 0;
  border-top: 1px solid hsl(var(--border) / 0.4);

  &:first-child {
    border-top: none;
  }
`;

/**
 * Row 1 — index · word · ipa · pos badge · pronunciation.
 * Single horizontal line, low contrast layout.
 */
export const VocabRow1 = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
`;

/**
 * Vocabulary index number — minimal monospace badge.
 */
export const VocabIndex = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground) / 0.6);
  min-width: 1rem;
  flex-shrink: 0;
`;

/**
 * Word + IPA wrapper — keeps them together on wrap.
 */
export const VocabWordGroup = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  flex-shrink: 0;
`;

/**
 * Main vocabulary word.
 */
export const VocabWord = styled.span`
  font-size: 0.975rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  word-break: break-word;
`;

/**
 * Phonetic notation (IPA) — muted, italic.
 */
export const VocabIPA = styled.span`
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
  font-style: italic;
`;

/**
 * Part of speech badge — flat, borderless, very subtle.
 */
export const PoSBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground) / 0.7);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid hsl(var(--border) / 0.5);
  border-radius: 0.25rem;
  padding: 0.05rem 0.35rem;
  flex-shrink: 0;
`;

/**
 * Pronunciation note — inline text, no background pill.
 */
export const PronunciationNote = styled.span`
  font-size: 0.775rem;
  color: hsl(var(--muted-foreground) / 0.65);
`;

/**
 * Shared wrapper for rows 2-4.
 */
export const VocabDataRow = styled.div`
  font-size: 0.85rem;
  line-height: 1.6;
  color: hsl(var(--muted-foreground));
  margin-top: 0.2rem;
`;

/**
 * Inline muted prefix label for a data row (e.g. "Meaning ·").
 */
export const RowLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground) / 0.5);
  margin-right: 0.4rem;
`;

/**
 * Row 2 — meaning text.
 */
export const MeaningText = styled.span`
  color: hsl(var(--foreground) / 0.85);
  font-size: 0.875rem;
  line-height: 1.6;
`;

/**
 * Row 3 — example text (italic). Rendered as a span inside VocabDataRow (div block).
 * Supports dangerouslySetInnerHTML for rich HTML content.
 */
export const ExampleText = styled.div`
  display: inline;
  color: hsl(var(--muted-foreground));
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.6;
`;

/**
 * Row 4 — translation text.
 */
export const TranslationText = styled.span`
  color: hsl(var(--muted-foreground) / 0.75);
  font-size: 0.825rem;
  line-height: 1.6;
`;

/* ─── Meta strip — compact one-line summary below header ─── */

/**
 * Horizontal strip that collapses date, priority, notes, and counts
 * into a single wrapped-friendly row of chips.
 */
export const MetaStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid hsl(var(--border) / 0.4);
`;

/**
 * Individual meta chip — plain inline text token.
 * @prop $dim - when true renders at a lower opacity for de-emphasized values (e.g. notes)
 */
export const MetaChip = styled.span<{ $dim?: boolean }>`
  font-size: 0.75rem;
  color: ${({ $dim }) =>
    $dim ? 'hsl(var(--muted-foreground) / 0.55)' : 'hsl(var(--muted-foreground))'};
  white-space: nowrap;
  max-width: 18ch;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Separator dot between meta chips.
 */
export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: hsl(var(--muted-foreground) / 0.3);
  flex-shrink: 0;
`;

/* ─── legacy exports kept to avoid breaking other imports ─── */
export const VocabWordHeader = styled.div``;
export const VocabMetadata = styled.div``;
export const MeaningSection = styled.div``;
export const MeaningLabel = styled.p``;
export const ExampleSection = styled.div``;
export const ExampleLabel = styled.p``;
export const TranslationSection = styled.div``;
export const TranslationLabel = styled.p``;
