import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GAME_CONFIG } from '@/modules/free-practice/core/models';

import TimerBar from './TimerBar';

describe('TimerBar', () => {
  it('renders with full width when timeLeft equals max', () => {
    render(<TimerBar timeLeft={GAME_CONFIG.TIME_PER_QUESTION} />);

    const fill = screen.getByTestId('timer-fill');

    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('renders at 50% when half the time remains', () => {
    const halfTime = GAME_CONFIG.TIME_PER_QUESTION / 2;
    render(<TimerBar timeLeft={halfTime} />);

    const fill = screen.getByTestId('timer-fill');

    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('renders at 0% when timeLeft is 0', () => {
    render(<TimerBar timeLeft={0} />);

    const fill = screen.getByTestId('timer-fill');

    expect(fill).toHaveStyle({ width: '0%' });
  });

  it('applies critical styling when time is at threshold', () => {
    render(<TimerBar timeLeft={GAME_CONFIG.CRITICAL_TIME_THRESHOLD} />);

    const fill = screen.getByTestId('timer-fill');

    expect(fill.className).toContain('bg-terracotta');
    expect(fill.className).toContain('animate-pulse');
  });

  it('does not apply critical styling when time is above threshold', () => {
    render(<TimerBar timeLeft={GAME_CONFIG.CRITICAL_TIME_THRESHOLD + 1} />);

    const fill = screen.getByTestId('timer-fill');

    expect(fill.className).toContain('bg-accent-primary');
    expect(fill.className).not.toContain('animate-pulse');
  });

  it('has correct ARIA attributes', () => {
    render(<TimerBar timeLeft={15} />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuenow', '15');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', String(GAME_CONFIG.TIME_PER_QUESTION));
  });
});
