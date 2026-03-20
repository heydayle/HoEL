import styled from "styled-components";

/**
 * Wrapper for the entire Home page layout.
 * Provides full-screen flex column with theme-aware background.
 */
export const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background);
  transition: background-color var(--transition-base);
`;

/**
 * Main content area between header and footer.
 */
export const HomeMainContent = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

/**
 * Spacer element to offset the fixed header height.
 */
export const HeaderSpacer = styled.div`
  height: 4rem;
`;
