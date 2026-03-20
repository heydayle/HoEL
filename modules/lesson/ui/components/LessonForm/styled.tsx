import styled from 'styled-components';

export const FormCard = styled.div`
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

export const FormSection = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

export const VocabSection = styled.div`
  margin-top: 1rem;
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

export const FooterActions = styled.div`
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
