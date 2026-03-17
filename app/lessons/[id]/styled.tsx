import styled from 'styled-components';

import { Button } from '@/app/shared/components/Styled';

/**
 * Main wrapper for the lesson detail page.
 */
export const DetailPageWrapper = styled.div`
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
`;

/**
 * Container for the lesson detail page content.
 */
export const DetailPageContainer = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

/**
 * Back button to return to lessons list.
 */
export const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-hover);
    border-color: var(--accent-primary);
  }
`;

/**
 * Title for the lesson detail page.
 */
export const LessonTitle = styled.h1`
  margin: 1.5rem 0 0.5rem;
  color: var(--foreground);
  font-size: 2rem;
  font-weight: 700;
`;

/**
 * Subtitle for the lesson detail page.
 */
export const LessonSubtitle = styled.p`
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 1rem;
`;
