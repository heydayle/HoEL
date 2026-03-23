import styled from 'styled-components';

/**
 * Outer card wrapper — flex column so the sticky footer works
 * within any scrolling parent (modal body or page scroll).
 */
export const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  background: hsl(var(--background));
`;

export const FormHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
`;

export const FormTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

export const FormSubtitle = styled.p`
  margin: 0.5rem 0 0;
  color: var(--foreground-secondary);
`;

/**
 * The <form> element.
 * Extra bottom padding prevents content from hiding behind the fixed footer bar.
 */
export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  padding-bottom: 6rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
`;

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
 * 4-column grid row for compact vocab fields (Word, IPA, PoS, Pronunciation).
 * Stacks to 2 columns on tablet, single column on mobile.
 */
export const VocabRow4 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

export const VocabSection = styled.div`
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const VocabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const VocabTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

export const VocabItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  background: hsl(var(--muted) / 0.5);
  padding: 1rem;
`;

export const VocabItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const VocabIndex = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

/**
 * New-vocab input row — flush, no extra padding.
 */
export const NewVocabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

/**
 * Footer action bar — fixed to the bottom of the viewport.
 * Always visible regardless of page scroll position.
 * Max-width and centering mirror the LessonContainer constraint (60rem).
 */
export const FooterActions = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-top: 1px solid hsl(var(--border) / 0.5);
  background: hsl(var(--background) / 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;
