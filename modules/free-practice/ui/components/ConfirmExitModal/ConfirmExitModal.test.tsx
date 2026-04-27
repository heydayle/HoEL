import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ConfirmExitModal from './ConfirmExitModal';

/**
 * Default props factory.
 */
const createProps = (overrides = {}) => ({
  isOpen: true,
  t: (key: string) => key,
  onResume: vi.fn(),
  onConfirm: vi.fn(),
  ...overrides,
});

describe('ConfirmExitModal', () => {
  it('renders the confirmation text when open', () => {
    render(<ConfirmExitModal {...createProps()} />);

    expect(screen.getByText('confirm_exit_text')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ConfirmExitModal {...createProps({ isOpen: false })} />);

    expect(screen.queryByText('confirm_exit_text')).not.toBeInTheDocument();
  });

  it('renders Resume and Confirm buttons', () => {
    render(<ConfirmExitModal {...createProps()} />);

    expect(screen.getByText('resume_btn')).toBeInTheDocument();
    expect(screen.getByText('confirm_btn')).toBeInTheDocument();
  });

  it('calls onResume when Resume is clicked', () => {
    const onResume = vi.fn();
    render(<ConfirmExitModal {...createProps({ onResume })} />);

    fireEvent.click(screen.getByText('resume_btn'));

    expect(onResume).toHaveBeenCalledOnce();
  });

  it('calls onConfirm when Confirm is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmExitModal {...createProps({ onConfirm })} />);

    fireEvent.click(screen.getByText('confirm_btn'));

    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
