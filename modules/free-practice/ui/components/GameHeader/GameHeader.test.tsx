import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GameHeader from './GameHeader';

/**
 * Default props factory for GameHeader tests.
 */
const createProps = (overrides = {}) => ({
  t: (key: string) => key,
  resolvedTheme: 'light' as const,
  onToggleTheme: vi.fn(),
  onEndGame: vi.fn(),
  onBack: vi.fn(),
  ...overrides,
});

describe('GameHeader', () => {
  it('renders back button with translated text', () => {
    render(<GameHeader {...createProps()} />);

    expect(screen.getByText('back_btn')).toBeInTheDocument();
  });

  it('renders end game button with translated text', () => {
    render(<GameHeader {...createProps()} />);

    expect(screen.getByText('end_game_btn')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<GameHeader {...createProps({ onBack })} />);

    fireEvent.click(screen.getByLabelText('back_btn'));

    expect(onBack).toHaveBeenCalledOnce();
  });

  it('calls onEndGame when end game button is clicked', () => {
    const onEndGame = vi.fn();
    render(<GameHeader {...createProps({ onEndGame })} />);

    fireEvent.click(screen.getByText('end_game_btn'));

    expect(onEndGame).toHaveBeenCalledOnce();
  });

  it('calls onToggleTheme when theme button is clicked', () => {
    const onToggleTheme = vi.fn();
    render(<GameHeader {...createProps({ onToggleTheme })} />);

    fireEvent.click(screen.getByLabelText('Switch to dark mode'));

    expect(onToggleTheme).toHaveBeenCalledOnce();
  });

  it('shows sun icon in dark mode', () => {
    render(<GameHeader {...createProps({ resolvedTheme: 'dark' })} />);

    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });
});
