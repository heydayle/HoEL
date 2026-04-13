import React from 'react';
import { render, screen } from '@testing-library/react';
import { VocabCardSkeleton } from './VocabCardSkeleton';

/** Shared i18n stub */
const t = (key: string) => key;

describe('VocabCardSkeleton', () => {
  it('renders the skeleton container with correct test id', () => {
    render(<VocabCardSkeleton t={t} />);
    expect(screen.getByTestId('vocab-card-skeleton')).toBeInTheDocument();
  });

  it('displays the generic loading label when no loadingWord is provided', () => {
    render(<VocabCardSkeleton t={t} />);
    expect(screen.getByText('vocab_loading')).toBeInTheDocument();
  });

  it('displays the loading word when loadingWord is provided', () => {
    render(<VocabCardSkeleton t={t} loadingWord="happy" />);
    expect(screen.getByText('vocab_loading_word: happy')).toBeInTheDocument();
  });

  it('renders multiple skeleton bars for the vocabulary card layout', () => {
    render(<VocabCardSkeleton t={t} />);
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    // Header remove btn (1) + 4 field rows (2 each = 8) + translation (2) + meaning (2) + example (2) = 15
    expect(skeletons.length).toBe(15);
  });

  it('has the animate-pulse class for animation', () => {
    render(<VocabCardSkeleton t={t} />);
    expect(screen.getByTestId('vocab-card-skeleton')).toHaveClass('animate-pulse');
  });
});
