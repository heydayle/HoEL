import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SummaryLesson } from './SummaryLesson';
import type { ISummaryLesson } from '@/modules/lesson/core/models';

/** Shared i18n stub */
const t = (key: string) => key;

/** Full summary fixture */
const makeSummary = (overrides: Partial<ISummaryLesson> = {}): ISummaryLesson => ({
  id: 'summary-1',
  lesson_id: 'lesson-1',
  paragraph: 'Test paragraph',
  translate: 'Translated paragraph',
  question_1: 'Q1?',
  question_2: 'Q2?',
  question_3: 'Q3?',
  ...overrides,
});

describe('SummaryLesson — loading state', () => {
  it('renders loading indicator when isLoading is true', () => {
    render(
      <SummaryLesson summary={null} isLoading={true} isGenerating={false} t={t} />,
    );
    expect(screen.getByText('summary_loading')).toBeInTheDocument();
  });

  it('does not render summary content when isLoading is true', () => {
    render(
      <SummaryLesson summary={makeSummary()} isLoading={true} isGenerating={false} t={t} />,
    );
    expect(screen.getByText('summary_loading')).toBeInTheDocument();
    expect(screen.queryByText('summary_section_title')).not.toBeInTheDocument();
  });
});

describe('SummaryLesson — processing state', () => {
  it('shows processing UI when summary is null and showProcessingState is true', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        showProcessingState={true}
      />,
    );
    expect(screen.getByTestId('summary-processing')).toBeInTheDocument();
    expect(screen.getByText('summary_processing')).toBeInTheDocument();
    expect(screen.getByText('summary_processing_hint')).toBeInTheDocument();
  });

  it('renders the Reload button in processing state when onReload is provided', () => {
    const onReload = jest.fn();
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        showProcessingState={true}
        onReload={onReload}
      />,
    );
    const reloadBtn = screen.getByText('summary_reload_btn');
    expect(reloadBtn).toBeInTheDocument();

    fireEvent.click(reloadBtn);
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('does not render Reload button when onReload is not provided', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        showProcessingState={true}
      />,
    );
    expect(screen.queryByText('summary_reload_btn')).not.toBeInTheDocument();
  });

  it('has animate-pulse class on the processing container', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        showProcessingState={true}
      />,
    );
    expect(screen.getByTestId('summary-processing')).toHaveClass('animate-pulse');
  });
});

describe('SummaryLesson — empty state (no processing)', () => {
  it('shows empty state when summary is null and showProcessingState is false', () => {
    render(
      <SummaryLesson summary={null} isLoading={false} isGenerating={false} t={t} />,
    );
    expect(screen.getByText('summary_empty')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-processing')).not.toBeInTheDocument();
  });

  it('renders Generate button in empty state when onRegenerate is provided', () => {
    const onRegenerate = jest.fn();
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={onRegenerate}
        vocabCount={5}
      />,
    );
    const generateBtn = screen.getByText('summary_generate_btn');
    expect(generateBtn).toBeInTheDocument();

    fireEvent.click(generateBtn);
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it('disables the Generate button and shows generating text when isGenerating is true', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={true}
        t={t}
        onRegenerate={jest.fn()}
      />,
    );
    const btn = screen.getByText('summary_generating');
    expect(btn.closest('button')).toBeDisabled();
  });
});

describe('SummaryLesson — summary displayed', () => {
  it('renders the full summary when data is provided', () => {
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={false}
        t={t}
      />,
    );
    expect(screen.getByText('summary_section_title')).toBeInTheDocument();
    expect(screen.getByText('summary_paragraph_label')).toBeInTheDocument();
    expect(screen.getByText('Q1?')).toBeInTheDocument();
    expect(screen.getByText('Q2?')).toBeInTheDocument();
    expect(screen.getByText('Q3?')).toBeInTheDocument();
  });

  it('renders the Regenerate button when onRegenerate is provided and summary exists', () => {
    const onRegenerate = jest.fn();
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={onRegenerate}
        vocabCount={5}
      />,
    );
    const btn = screen.getByText('summary_regenerate_btn');
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it('disables Regenerate button and shows generating text when isGenerating is true with summary', () => {
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={true}
        t={t}
        onRegenerate={jest.fn()}
      />,
    );
    const btn = screen.getByText('summary_generating');
    expect(btn.closest('button')).toBeDisabled();
  });

  it('does not show processing state when summary exists even if showProcessingState is true', () => {
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={false}
        t={t}
        showProcessingState={true}
      />,
    );
    expect(screen.queryByTestId('summary-processing')).not.toBeInTheDocument();
    expect(screen.getByText('summary_section_title')).toBeInTheDocument();
  });

  it('renders without questions when they are not provided', () => {
    render(
      <SummaryLesson
        summary={makeSummary({ question_1: '', question_2: '', question_3: '' })}
        isLoading={false}
        isGenerating={false}
        t={t}
      />,
    );
    expect(screen.queryByText('summary_questions_label')).not.toBeInTheDocument();
  });

  it('renders without translation when it is not provided', () => {
    render(
      <SummaryLesson
        summary={makeSummary({ translate: '' })}
        isLoading={false}
        isGenerating={false}
        t={t}
      />,
    );
    expect(screen.queryByText('summary_translation_label')).not.toBeInTheDocument();
  });
});

describe('SummaryLesson — minimum vocabulary guard', () => {
  it('disables Generate button and shows hint when vocabCount < 5 (empty state)', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={jest.fn()}
        vocabCount={3}
      />,
    );
    const btn = screen.getByText('summary_generate_btn');
    expect(btn.closest('button')).toBeDisabled();
    expect(screen.getByText('summary_min_vocab_hint')).toBeInTheDocument();
  });

  it('enables Generate button when vocabCount >= 5 (empty state)', () => {
    render(
      <SummaryLesson
        summary={null}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={jest.fn()}
        vocabCount={5}
      />,
    );
    const btn = screen.getByText('summary_generate_btn');
    expect(btn.closest('button')).not.toBeDisabled();
    expect(screen.queryByText('summary_min_vocab_hint')).not.toBeInTheDocument();
  });

  it('disables Regenerate button when vocabCount < 5 (summary exists)', () => {
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={jest.fn()}
        vocabCount={2}
      />,
    );
    const btn = screen.getByText('summary_regenerate_btn');
    expect(btn.closest('button')).toBeDisabled();
  });

  it('enables Regenerate button when vocabCount >= 5 (summary exists)', () => {
    render(
      <SummaryLesson
        summary={makeSummary()}
        isLoading={false}
        isGenerating={false}
        t={t}
        onRegenerate={jest.fn()}
        vocabCount={10}
      />,
    );
    const btn = screen.getByText('summary_regenerate_btn');
    expect(btn.closest('button')).not.toBeDisabled();
  });
});
