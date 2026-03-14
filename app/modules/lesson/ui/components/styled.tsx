import styled from 'styled-components';

import { Card } from '@/app/shared/components/Styled';

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
 * Card for displaying the latest lesson details.
 */
export const LatestLessonCard = styled(Card)`
  border: 1px solid var(--surface-border);
  background: var(--surface);
  padding: 1rem;
`;

/**
 * Title of the latest lesson topic.
 */
export const LessonTopic = styled.h2`
  margin: 0;
  color: var(--foreground);
  font-size: 1.25rem;
`;

/**
 * Small meta text row in lesson details.
 */
export const LessonMeta = styled.p`
  margin: 0.5rem 0 0;
  color: var(--foreground-secondary);
  font-size: 0.95rem;
`;

/**
 * Notes content preview block.
 */
export const NotesContent = styled.p`
  margin: 1rem 0 0;
  color: var(--foreground);
  line-height: 1.6;
`;

/**
 * List container for lesson reference links.
 */
export const LinkList = styled.ul`
  margin: 0.75rem 0 0;
  padding-left: 1.25rem;
`;

/**
 * Reference link text style.
 */
export const LinkItem = styled.a`
  color: var(--accent-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
