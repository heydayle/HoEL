import styled from "styled-components";

import { Button } from "@/app/shared/components/Styled";

/* ============================================================
 * Shared styled-components for shared Atom components.
 * Per the "styled.tsx Rule", all styled components in this
 * /atoms/ directory are declared in this single file.
 * ============================================================ */

/**
 * Custom styled wrapper for the shadcn Button component.
 * Adds accent-primary background with hover and press effects.
 */
export const PrimaryButton = styled(Button)`
  background-color: var(--accent-primary);
  color: white;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: var(--accent-primary-hover);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  }

  &:active {
    transform: scale(0.97);
  }
`;

/**
 * Custom styled wrapper for the shadcn Button as an outlined variant.
 * Uses surface border and foreground text colors.
 */
export const OutlineButton = styled(Button)`
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--surface-border);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: var(--accent-primary);
    background-color: var(--accent-primary-light);
  }

  &:active {
    transform: scale(0.97);
  }
`;

/**
 * Styled toggle button container for theme or locale switches.
 */
export const ToggleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: var(--radius-md, 12px);
  background-color: var(--surface-hover);
  color: var(--foreground-secondary);
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: var(--accent-primary-light);
    color: var(--accent-primary);
  }

  &:active {
    transform: scale(0.92);
  }
`;
