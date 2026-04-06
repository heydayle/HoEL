import styled from 'styled-components';

/**
 * Full-viewport centred container shown while the public lesson is loading.
 */
export const ShareLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--background);
`;

/**
 * Full-viewport centred container shown when the lesson cannot be found
 * or an error occurs during fetch.
 */
export const ShareErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
  color: var(--foreground);
  text-align: center;
`;

/**
 * Primary "not found" heading inside the error container.
 */
export const ShareErrorHeading = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
`;

/**
 * Secondary descriptive text inside the error container.
 */
export const ShareErrorSub = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: var(--foreground-secondary);
  max-width: 28rem;
  line-height: 1.6;
`;
