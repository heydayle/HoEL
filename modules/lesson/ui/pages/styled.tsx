import styled, { css } from 'styled-components';
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
/** ──────────────────────────────────────────────────────────────────────────
 * LessonShareView – layout
 * ─────────────────────────────────────────────────────────────────────────── */
/**
 * Full-page wrapper for the public share view.
 */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  padding: 2rem 1rem 4rem;
`;
/**
 * Centered content container — capped at a comfortable reading width.
 */
export const PageContainer = styled.main`
  max-width: 52rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
/**
 * Gradient hero banner with lesson topic and public-view badge.
 */
export const PageBanner = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    hsl(var(--primary) / 0.18) 0%,
    hsl(var(--accent) / 0.12) 100%
  );
  border: 1px solid hsl(var(--primary) / 0.25);
  backdrop-filter: blur(8px);
`;
/**
 * Groups PageTitle and PageSubtitle inside the banner.
 */
export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;
/**
 * Lesson topic — primary heading on the share view.
 */
export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--foreground);
  line-height: 1.2;
  letter-spacing: -0.02em;
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;
/**
 * Supporting subtitle beneath the lesson title in the banner.
 */
export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: var(--foreground-secondary);
`;
/**
 * Small pill badge indicating public-view mode.
 */
export const PageBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--primary));
  border: 1px solid hsl(var(--primary) / 0.3);
`;
/**
 * Informational banner reminding visitors this view is read-only.
 */
export const ReadonlyHint = styled.p`
  margin: 0;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: hsl(var(--muted-foreground));
  background: hsl(var(--muted) / 0.5);
  border: 1px dashed hsl(var(--border));
  font-style: italic;
`;
/** ──────────────────────────────────────────────────────────────────────────
 * LessonShareView – metadata grid
 * ─────────────────────────────────────────────────────────────────────────── */
/**
 * Responsive grid for lesson metadata items.
 */
export const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;
/**
 * Single metadata card (label + value).
 */
export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  transition: border-color 0.2s ease;
  &:hover {
    border-color: hsl(var(--primary) / 0.4);
  }
`;
/**
 * Small label above a metadata value (includes icon slot).
 */
export const InfoLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--foreground-secondary);
`;
/**
 * The metadata value text.
 */
export const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
/** ──────────────────────────────────────────────────────────────────────────
 * LessonShareView – section structure
 * ─────────────────────────────────────────────────────────────────────────── */
/**
 * Horizontal rule separating content sections.
 */
export const SectionDivider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid var(--surface-border);
`;
/**
 * Bold section heading (with optional icon slot).
 */
export const SectionHeading = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--foreground);
`;
/**
 * Preformatted notes block with soft surface background.
 */
export const NotesBlock = styled.p`
  margin: 0;
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--foreground);
  white-space: pre-wrap;
  word-break: break-word;
`;
/** ──────────────────────────────────────────────────────────────────────────
 * LessonShareView – vocabulary cards
 * ─────────────────────────────────────────────────────────────────────────── */
/**
 * Responsive grid layout for vocabulary cards.
 */
export const VocabGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
`;
/**
 * Individual vocabulary card with hover-lift animation.
 */
export const VocabCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 0.875rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    border-color: hsl(var(--primary) / 0.4);
    transform: translateY(-2px);
  }
`;
/**
 * Top row: word + IPA + PoS badge.
 */
export const VocabMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
/**
 * The vocabulary word — prominent and bold.
 */
export const VocabCardWord = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--foreground);
  background-color: var(--highlight);
  padding: 0rem 0.2rem;
  border-radius: 0.5rem;
`;
/**
 * IPA phonetic notation.
 */
export const VocabIpa = styled.span`
  font-size: 0.85rem;
  color: var(--foreground-secondary);
  font-style: italic;
`;
/**
 * Body area containing all vocab field rows.
 */
export const VocabCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;
/**
 * A single label+value field inside the vocab card.
 */
export const VocabCardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;
/**
 * Field label inside a vocab card.
 */
export const VocabCardFieldLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--foreground-secondary);
`;
interface IVocabCardFieldValueProps {
  /** When true, renders the value in italic (used for example sentences). */
  $italic?: boolean;
}
/**
 * Field value inside a vocab card.
 */
export const VocabCardFieldValue = styled.span<IVocabCardFieldValueProps>`
  font-size: 0.9rem;
  color: var(--foreground);
  line-height: 1.5;
  ${({ $italic }) =>
    $italic &&
    css`
      font-style: italic;
      color: var(--foreground-secondary);
    `}
`;
/** ──────────────────────────────────────────────────────────────────────────
 * LessonShareView – priority / PoS chip
 * ─────────────────────────────────────────────────────────────────────────── */
interface IPriorityChipProps {
  /** Controls the colour scheme of the chip */
  $variant: 'low' | 'medium' | 'high' | 'pos';
}
const priorityColors: Record<IPriorityChipProps['$variant'], string> = {
  low: 'hsl(150, 60%, 40%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 72%, 51%)',
  pos: 'hsl(var(--primary))',
};
const priorityBgColors: Record<IPriorityChipProps['$variant'], string> = {
  low: 'rgba(34,197,110,0.12)',
  medium: 'rgba(234,179,8,0.12)',
  high: 'rgba(239,68,68,0.12)',
  pos: 'hsl(var(--primary) / 0.12)',
};
/**
 * Coloured pill chip for priority levels and part-of-speech labels.
 */
export const PriorityChip = styled.span<IPriorityChipProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ $variant }) => priorityColors[$variant]};
  background: ${({ $variant }) => priorityBgColors[$variant]};
  border: 1px solid ${({ $variant }) => priorityColors[$variant]}33;
`;
/**
 * Shown when a lesson has no vocabulary entries.
 */
export const EmptyVocabHint = styled.p`
  margin: 0;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px dashed var(--surface-border);
  color: var(--foreground-secondary);
  font-size: 0.9rem;
  text-align: center;
  font-style: italic;
`;
