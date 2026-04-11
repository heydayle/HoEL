'use client';

import { BookOpen, ChevronRight, Globe, HelpCircle, Loader2, RefreshCw } from 'lucide-react';
import React from 'react';

import type { ISummaryLesson } from '@/modules/lesson/core/models';
import { Button } from '@/shared/components/Styled';

/**
 * Props for the SummaryLesson component.
 */
interface ISummaryLessonProps {
  /** Summary data to display */
  summary: ISummaryLesson | null;
  /** Whether the summary is being loaded */
  isLoading: boolean;
  /** Whether summary generation is in progress */
  isGenerating: boolean;
  /** Translation function */
  t: (key: string) => string;
  /** Callback to regenerate / generate summary */
  onRegenerate?: () => void;
}

/**
 * Displays the AI-generated summary of a lesson including
 * a paragraph, its translation, and comprehension questions.
 * Renders above the vocabulary section in lesson detail views.
 *
 * @param props - Component props
 * @returns Summary lesson section UI
 */
export function SummaryLesson({
  summary,
  isLoading,
  isGenerating,
  t,
  onRegenerate,
}: ISummaryLessonProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 border border-border rounded-xl bg-muted/10">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">{t('summary_loading')}</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 border border-dashed border-border rounded-xl bg-muted/5">
        <BookOpen className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground/60 italic">{t('summary_empty')}</p>
        {onRegenerate && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isGenerating ? t('summary_generating') : t('summary_generate_btn')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-5 border border-border rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 m-0 text-sm font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="w-4 h-4" />
          {t('summary_section_title')}
        </h3>
        {onRegenerate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-1.5 text-xs h-7"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {isGenerating ? t('summary_generating') : t('summary_regenerate_btn')}
          </Button>
        )}
      </div>

      {/* Paragraph */}
      {summary.paragraph && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.7rem] font-medium uppercase tracking-widest text-muted-foreground/50">
            {t('summary_paragraph_label')}
          </span>
          <p
            className="m-0 text-[0.9rem] leading-relaxed text-foreground/90 [&_b]:bg-[var(--highlight)] [&_b]:px-1"
            dangerouslySetInnerHTML={{ __html: summary.paragraph }}
          ></p>
        </div>
      )}

      {/* Translation — collapsible, closed by default */}
      {summary.translate && (
        <details className="group pl-3 border-l-2 border-primary/20">
          <summary className="flex items-center gap-1 cursor-pointer select-none list-none text-[0.7rem] font-medium uppercase tracking-widest text-muted-foreground/50 [&::-webkit-details-marker]:hidden">
            <ChevronRight className="w-3 h-3 transition-transform duration-200 group-open:rotate-90" />
            <Globe className="w-3 h-3" />
            {t('summary_translation_label')}
          </summary>
          <p
            className="m-0 mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground/80 italic [&_b]:text-white [&_b]:bg-[var(--highlight)] [&_b]:px-1"
            dangerouslySetInnerHTML={{ __html: summary.translate }}
          ></p>
        </details>
      )}

      {/* Questions */}
      {(summary.question_1 || summary.question_2 || summary.question_3) && (
        <div className="flex flex-col gap-2 mt-1">
          <span className="flex items-center gap-1 text-[0.7rem] font-medium uppercase tracking-widest text-muted-foreground/50">
            <HelpCircle className="w-3 h-3" />
            {t('summary_questions_label')}
          </span>
          <div className="flex flex-col gap-1.5">
            {summary.question_1 && (
              <div className="flex items-start gap-2 text-[0.85rem] text-foreground/85">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[0.7rem] font-semibold mt-0.5">
                  1
                </span>
                <span>{summary.question_1}</span>
              </div>
            )}
            {summary.question_2 && (
              <div className="flex items-start gap-2 text-[0.85rem] text-foreground/85">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[0.7rem] font-semibold mt-0.5">
                  2
                </span>
                <span>{summary.question_2}</span>
              </div>
            )}
            {summary.question_3 && (
              <div className="flex items-start gap-2 text-[0.85rem] text-foreground/85">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[0.7rem] font-semibold mt-0.5">
                  3
                </span>
                <span>{summary.question_3}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
