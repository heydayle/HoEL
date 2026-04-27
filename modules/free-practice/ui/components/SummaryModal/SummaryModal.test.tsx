import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SummaryModal from './SummaryModal';

/**
 * Default props factory.
 */
const createProps = (overrides = {}) => ({
  isOpen: true,
  t: (key: string) => key,
  totalAnswered: 10,
  correctAnswers: 8,
  onReturnDashboard: vi.fn(),
  onReplay: vi.fn(),
  ...overrides,
});

describe('SummaryModal', () => {
  it('renders the summary title when open', () => {
    render(<SummaryModal {...createProps()} />);

    expect(screen.getByText('summary_title')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SummaryModal {...createProps({ isOpen: false })} />);

    expect(screen.queryByText('summary_title')).not.toBeInTheDocument();
  });

  it('displays the total answered count', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 15 })} />);

    expect(screen.getByTestId('total-answered')).toHaveTextContent('15');
  });

  it('displays the correct answers count', () => {
    render(<SummaryModal {...createProps({ correctAnswers: 7 })} />);

    expect(screen.getByTestId('total-correct')).toHaveTextContent('7');
  });

  it('calculates and displays the correct percentage', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 10, correctAnswers: 8 })} />);

    expect(screen.getByTestId('percentage')).toHaveTextContent('80%');
  });

  it('displays 0% when no questions answered', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 0, correctAnswers: 0 })} />);

    expect(screen.getByTestId('percentage')).toHaveTextContent('0%');
  });

  it('shows "excellent" memory level for > 80% score', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 10, correctAnswers: 9 })} />);

    expect(screen.getByTestId('memory-level')).toHaveTextContent('memory_excellent');
  });

  it('shows "good_grasp" memory level for 50-80% score', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 10, correctAnswers: 6 })} />);

    expect(screen.getByTestId('memory-level')).toHaveTextContent('memory_good_grasp');
  });

  it('shows "needs_review" memory level for < 50% score', () => {
    render(<SummaryModal {...createProps({ totalAnswered: 10, correctAnswers: 3 })} />);

    expect(screen.getByTestId('memory-level')).toHaveTextContent('memory_needs_review');
  });

  it('calls onReturnDashboard when button is clicked', () => {
    const onReturnDashboard = vi.fn();
    render(<SummaryModal {...createProps({ onReturnDashboard })} />);

    fireEvent.click(screen.getByText('return_dashboard_btn'));

    expect(onReturnDashboard).toHaveBeenCalledOnce();
  });

  it('renders the Play Again button', () => {
    render(<SummaryModal {...createProps()} />);

    expect(screen.getByText('replay_btn')).toBeInTheDocument();
  });

  it('calls onReplay when Play Again button is clicked', () => {
    const onReplay = vi.fn();
    render(<SummaryModal {...createProps({ onReplay })} />);

    fireEvent.click(screen.getByText('replay_btn'));

    expect(onReplay).toHaveBeenCalledOnce();
  });
});
