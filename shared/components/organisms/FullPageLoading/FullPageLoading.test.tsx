import React from 'react';
import { render, screen } from '@testing-library/react';
import { FullPageLoading } from './FullPageLoading';

describe('FullPageLoading', () => {
  it('renders with the correct test id', () => {
    render(<FullPageLoading />);
    expect(screen.getByTestId('full-page-loading')).toBeInTheDocument();
  });

  it('renders a spinner (svg with role="status")', () => {
    render(<FullPageLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays the message when provided', () => {
    render(<FullPageLoading message="Creating your lesson..." />);
    expect(screen.getByText('Creating your lesson...')).toBeInTheDocument();
  });

  it('does not render message text when message is not provided', () => {
    const { container } = render(<FullPageLoading />);
    // Only the spinner glow elements, no <p> tags
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('displays the hint when provided', () => {
    render(<FullPageLoading message="Creating..." hint="Saving data and generating summary." />);
    expect(screen.getByText('Saving data and generating summary.')).toBeInTheDocument();
  });

  it('does not render hint text when hint is not provided', () => {
    render(<FullPageLoading message="Creating..." />);
    expect(screen.queryByText('Saving data')).not.toBeInTheDocument();
  });

  it('renders both message and hint together', () => {
    render(
      <FullPageLoading
        message="Updating your lesson..."
        hint="Syncing vocabulary data."
      />,
    );
    expect(screen.getByText('Updating your lesson...')).toBeInTheDocument();
    expect(screen.getByText('Syncing vocabulary data.')).toBeInTheDocument();
  });

  it('has fixed positioning and high z-index for full-page overlay', () => {
    render(<FullPageLoading />);
    const overlay = screen.getByTestId('full-page-loading');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('z-[100]');
  });

  it('has backdrop blur for the glassmorphism effect', () => {
    render(<FullPageLoading />);
    const overlay = screen.getByTestId('full-page-loading');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('renders the animated ping glow ring', () => {
    const { container } = render(<FullPageLoading />);
    const pingElement = container.querySelector('.animate-ping');
    expect(pingElement).toBeInTheDocument();
  });
});
