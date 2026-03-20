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
  border-radius: 0.5rem;
  background-color: hsl(var(--muted) / 0.3);

  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
`;

/**
 * Vocabulary index number.
 */
export const VocabIndex = styled.span`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
`;
