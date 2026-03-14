import styled from 'styled-components';

import { Badge, Card, Input } from '@/app/shared/components/Styled';

/**
 * Header row containing page heading and utility controls.
 */
export const LessonHeaderRow = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
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
  border: 1px solid var(--surface-border);
  background: var(--surface);
  padding: 1rem;
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
  border: 1px solid var(--surface-border);
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
  padding: 0 0.75rem;
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
  padding: 0.45rem 0.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  background: var(--surface-hover);
  color: var(--foreground);
  cursor: pointer;
`;

/**
 * Lessons list container.
 */
export const LessonsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Single lesson card in the list.
 */
export const LessonCard = styled(Card)`
  border: 1px solid var(--surface-border);
  background: var(--surface);
  padding: 1rem;
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
`;

/**
 * Empty state text when list has no result.
 */
export const EmptyState = styled.p`
  margin: 0;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px dashed var(--surface-border);
  color: var(--foreground-secondary);
`;
