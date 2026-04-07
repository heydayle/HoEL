import styled from 'styled-components';

import { Badge, Card, Input } from '@/shared/components/Styled';

/** Compact spacing for components with small width footprint (< 20rem). */
const SMALL_COMPONENT_PADDING_Y = '6px';
const SMALL_COMPONENT_PADDING_X = '10px';

/** Comfortable spacing for components with larger width footprint (>= 20rem). */
const LARGE_COMPONENT_PADDING_Y = '10px';
const LARGE_COMPONENT_PADDING_X = '20px';

/**
 * Header row containing page heading and utility controls.
 */
export const LessonHeaderRow = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  position: sticky;
  top: 32px;
  background: hsl(var(--background) / 0.94);
  backdrop-filter: blur(10px);
`;

/**
 * Wrapper for locale/theme controls.
 */
export const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/**
 * Grid displaying summary statistic cards.
 */
export const StatsGrid = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
`;

/**
 * Styled statistics card built from shared shadcn Card.
 */
export const StatCard = styled(Card)`
  background: var(--surface);
  padding: ${LARGE_COMPONENT_PADDING_Y} ${LARGE_COMPONENT_PADDING_X};
`;

/**
 * Label displayed on top of a stat value.
 */
export const StatLabel = styled.p`
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 0.875rem;
`;

/**
 * Numeric value for each summary stat.
 */
export const StatValue = styled.p`
  margin: 0.25rem 0 0;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 700;
`;

/**
 * Filter panel container.
 */
export const FilterPanel = styled(Card)`
  background: var(--surface);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Filter control row for responsive layout.
 */
export const FilterGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
`;

/**
 * Styled shared input for filters.
 */
export const FilterInput = styled(Input)`
  width: 100%;
  padding: ${SMALL_COMPONENT_PADDING_Y} ${SMALL_COMPONENT_PADDING_X};

  @media (min-width: 768px) {
    padding: ${LARGE_COMPONENT_PADDING_Y} 16px;
  }
`;

/**
 * Native select input used in filter controls.
 */
export const FilterSelect = styled.select`
  width: 100%;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  background: var(--surface);
  color: var(--foreground);
  padding: ${SMALL_COMPONENT_PADDING_Y} ${SMALL_COMPONENT_PADDING_X};
`;

/**
 * Filter checkbox label wrapper.
 */
export const FilterCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--foreground-secondary);
  font-size: 0.875rem;
`;

/**
 * Filter action button.
 */
export const FilterResetButton = styled.button`
  width: fit-content;
  padding: ${SMALL_COMPONENT_PADDING_Y} ${SMALL_COMPONENT_PADDING_X};
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  background: var(--surface-hover);
  color: var(--foreground);
  cursor: pointer;

  @media (min-width: 768px) {
    padding: ${LARGE_COMPONENT_PADDING_Y} 16px;
  }
`;

/**
 * Lessons list container.
 */
export const LessonsList = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 0.75rem;
`;

/**
 * Single lesson card in the list.
 */
export const LessonCard = styled(Card)`
  background: var(--surface);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-primary);
    background: var(--surface-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

/**
 * Top row inside lesson card.
 */
export const LessonCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

/**
 * Lesson topic title.
 */
export const LessonTopic = styled.h2`
  margin: 0;
  color: var(--foreground);
  font-size: 1.1rem;
`;

/**
 * Meta text in lesson cards.
 */
export const LessonMeta = styled.p`
  margin: 0.4rem 0 0;
  color: var(--foreground-secondary);
  font-size: 0.9rem;
`;

/**
 * Notes content preview block.
 */
export const NotesContent = styled.p`
  margin: 0.75rem 0 0;
  color: var(--foreground);
  line-height: 1.5;
`;

/**
 * Priority badge style.
 */
export const PriorityBadge = styled(Badge)`
  background: var(--accent-primary-light);
  color: var(--accent-primary);
  padding: ${SMALL_COMPONENT_PADDING_Y} ${SMALL_COMPONENT_PADDING_X};
`;

/**
 * Button to open lesson in new tab (positioned on card).
 */
export const OpenLessonButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--surface-hover);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/**
 * Button to edit lesson (positioned on card).
 */
export const EditLessonButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--surface-hover);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/**
 * Button to copy the public share link for a lesson.
 * Uses a distinct teal accent to differentiate from the edit action.
 */
export const ShareLessonButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: hsl(180, 60%, 90%, 0.15);
    color: hsl(180, 60%, 45%);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/**
 * Empty state text when list has no result.
 */
export const EmptyState = styled.p`
  margin: 0;
  padding: ${LARGE_COMPONENT_PADDING_Y} ${LARGE_COMPONENT_PADDING_X};
  border-radius: var(--radius-md);
  border: 1px dashed var(--surface-border);
  color: var(--foreground-secondary);
`;
