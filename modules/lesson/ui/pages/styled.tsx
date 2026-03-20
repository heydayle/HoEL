import styled from 'styled-components';

/**
 * Root wrapper for lesson page.
 */
export const LessonPageWrapper = styled.main`
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--background);
  color: var(--foreground);

  @media (min-width: 768px) {
    padding: 2.5rem 2rem;
  }
`;

/**
 * Constrains content width for readability.
 */
export const LessonContainer = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/**
 * Top-level lesson title text.
 */
export const LessonTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
`;

/**
 * Supporting subtitle for the lesson page.
 */
export const LessonSubtitle = styled.p`
  margin: 0;
  color: var(--foreground-secondary);
  line-height: 1.6;
`;
