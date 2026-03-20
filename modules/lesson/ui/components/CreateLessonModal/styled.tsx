import styled from 'styled-components';

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/shared/components/Styled';

/**
 * Styled dialog content with 80vh max height,
 * no internal padding (padding lives on sub-sections),
 * and a flex column layout so header/body/footer stack correctly.
 */
export const ModalContent = styled(DialogContent)`
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
 * Styled dialog header pinned to the top with padding and bottom border.
 */
export const ModalHeader = styled(DialogHeader)`
  flex-shrink: 0 !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid hsl(var(--border)) !important;
`;

/**
 * Scrollable body wrapper for the form fields.
 */
export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/**
 * Styled dialog footer fixed to bottom with padding and top border.
 */
export const ModalFooter = styled(DialogFooter)`
  flex-shrink: 0 !important;
  margin: 0 !important;
  padding: 1rem 1.5rem !important;
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-end !important;
  gap: 0.5rem !important;
  border-top: 1px solid hsl(var(--border)) !important;
  border-radius: 0 0 0.75rem 0.75rem !important;
`;

/**
 * Wrapper for the <form>, uses flex column and fills remaining space.
 */
export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
`;

/**
 * Generic form group – vertical label + input pair.
 */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

/**
 * Label for form inputs.
 */
export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
`;

/**
 * Responsive row that stacks on mobile, goes side-by-side on ≥640px.
 */
export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    > * {
      flex: 1;
    }
  }
`;

/**
 * Section wrapper for the vocabulary entries with a top divider.
 */
export const VocabSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
`;

/**
 * Header row for the vocabulary section (title + add button).
 */
export const VocabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Title for the vocabulary section.
 */
export const VocabTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

/**
 * Card-like wrapper for each vocabulary entry.
 */
export const VocabItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  background-color: hsl(var(--muted) / 0.5);
`;

/**
 * Header row inside a vocab item (number badge + remove button).
 */
export const VocabItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

/**
 * Badge showing the vocab item number.
 */
export const VocabIndex = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;
