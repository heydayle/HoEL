import styled from 'styled-components';

import {
  DialogContent,
  DialogHeader,
} from '@/shared/components/Styled';

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
    max-width: 42rem !important;
  }
`;

/**
 * Styled dialog header pinned to the top.
 */
export const DetailModalHeader = styled(DialogHeader)`
  flex-shrink: 0 !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid hsl(var(--border)) !important;
`;

/**
 * Scrollable content wrapper.
 */
export const DetailContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/**
 * Value display for details.
 */
export const DetailValue = styled.p`
  margin: 0;
  color: var(--foreground);
  font-size: 0.9rem;
  line-height: 1.5;
`;

/**
 * Badge for displaying priority or other status.
 */
export const DetailBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  background: var(--accent-primary-light);
  color: var(--accent-primary);
  font-size: 0.75rem;
  font-weight: 600;
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
  gap: 0.75rem;
`;

/**
 * Individual vocabulary item in detail view.
 */
export const VocabDetailItem = styled.div`
  padding: 1rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.3);
  border-top: 1px solid gray;

  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
`;

/**
 * Vocabulary index number.
 */
export const VocabIndex = styled.span`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  padding: 0.25rem;
`;

/**
 * Enhanced vocabulary header with word and IPA.
 */
export const VocabWordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid hsl(var(--border));
`;

/**
 * Main vocabulary word.
 */
export const VocabWord = styled.h4`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--foreground);
  word-break: break-word;
`;

/**
 * Phonetic notation (IPA).
 */
export const VocabIPA = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--foreground-secondary);
  font-style: italic;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

/**
 * Metadata section for part of speech and pronunciation info.
 */
export const VocabMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
`;

/**
 * Badge for part of speech.
 */
export const PoSBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  background: var(--accent-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

/**
 * Pronunciation note.
 */
export const PronunciationNote = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--foreground-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--accent-secondary-light);
  border-radius: 0.375rem;
  border-left: 3px solid var(--accent-secondary);
`;

/**
 * Meaning/Definition section.
 */
export const MeaningSection = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  border-radius: 0.375rem;
  border-left: 4px solid var(--accent-primary);
  background: var(--accent-secondary-light);
`;

/**
 * Meaning label.
 */
export const MeaningLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-primary);
`;

/**
 * Definition text.
 */
export const MeaningText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--foreground);
  background: hsl(var(--secondary-foreground) / 0.9);
`;

/**
 * Example section with styling.
 */
export const ExampleSection = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--accent-secondary-light);
  border-radius: 0.375rem;
  border-left: 4px solid var(--accent-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/**
 * Example label.
 */
export const ExampleLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-secondary);
`;

/**
 * Example sentence text.
 */
export const ExampleText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--foreground);
  font-style: italic;
`;

/**
 * Translation section.
 */
export const TranslationSection = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  border-left: 4px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--accent-secondary-light);
  border-left: 4px solid var(--accent-secondary);
`;

/**
 * Translation label.
 */
export const TranslationLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--foreground-secondary);
`;

/**
 * Translation text.
 */
export const TranslationText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--foreground);
`;
