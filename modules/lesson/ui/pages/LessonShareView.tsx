'use client';
import type { ILesson, ISummaryLesson, IVocabulary } from '@/modules/lesson/core/models';
import { SummaryLesson } from '@/modules/lesson/ui/components/SummaryLesson';
import { PriorityBadge, resolvePriorityVariant } from '@/shared/components';
import { BookOpen, Calendar, Eye, Flag, User, Volume2 } from 'lucide-react';
import React from 'react';

/** ──────────────────────────────────────────────────────────────────────────
 * Sub-component: VocabularyCard
 * ─────────────────────────────────────────────────────────────────────────── */
interface IVocabularyCardProps {
  /** Vocabulary entry to render */
  vocab: IVocabulary;
  /** Translation function */
  t: (key: string) => string;
}

/**
 * Renders a single vocabulary entry in the public share view.
 * @param props - Component props
 * @returns Vocabulary card element
 */
function VocabularyCard({ vocab, t }: IVocabularyCardProps): React.JSX.Element {
  return (
    <article className="flex flex-col gap-3 p-5 rounded-[0.875rem] bg-[var(--surface)] border border-[var(--surface-border)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:border-primary/40 hover:-translate-y-0.5">
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-xl font-bold text-[var(--highlight)] rounded-lg">{vocab.word}</span>
        {vocab.ipa && (
          <span className="text-[0.85rem] text-foreground-secondary italic">{vocab.ipa}</span>
        )}
        {vocab.partOfSpeech && <PriorityBadge label={vocab.partOfSpeech} variant="pos" />}
      </div>
      <div className="flex flex-col gap-2.5">
        {vocab.meaning && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-foreground-secondary">
              {t('share_view_meaning')}
            </span>
            <span className="text-[0.9rem] text-foreground leading-relaxed">{vocab.meaning}</span>
          </div>
        )}
        {vocab.translation && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-foreground-secondary">
              {t('share_view_translation')}
            </span>
            <span className="text-[0.9rem] text-foreground leading-relaxed">
              {vocab.translation}
            </span>
          </div>
        )}
        {vocab.pronunciation && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-foreground-secondary">
              <Volume2 aria-hidden="true" className="w-3.5 h-3.5" />
              {t('share_view_pronunciation')}
            </span>
            <span className="text-[0.9rem] text-foreground leading-relaxed">
              {vocab.pronunciation}
            </span>
          </div>
        )}
        {vocab.example && (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-[0.3rem] text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-foreground-secondary">
              {t('share_view_example')}
            </span>
            <p
              className="m-0 mt-1.5 text-[0.85rem] leading-relaxed text-foreground-secondary italic [&_b]:text-foreground"
              dangerouslySetInnerHTML={{ __html: vocab.example }}
            ></p>
          </div>
        )}
      </div>
    </article>
  );
}

/** ──────────────────────────────────────────────────────────────────────────
 * Main component: LessonShareView
 * ─────────────────────────────────────────────────────────────────────────── */
interface ILessonShareViewProps {
  /** Fully loaded lesson entity to display */
  lesson: ILesson;
  /** Associated summary data, or null if none exists */
  summary: ISummaryLesson | null;
  /** Translation function bound to the lesson module messages */
  t: (key: string) => string;
}

/**
 * Public, read-only view of a single lesson.
 * Rendered at `/s/[id]` — no authentication required, no editing allowed.
 * @param props - Component props
 * @returns Full page read-only lesson detail UI
 */
export function LessonShareView({ lesson, summary, t }: ILessonShareViewProps): React.JSX.Element {
  const formattedDate = new Date(lesson.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const priorityVariant = resolvePriorityVariant(lesson.priority);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 pb-16">
      <main className="max-w-[52rem] mx-auto flex flex-col gap-6">
        {/* ── Hero banner ── */}
        <section className="flex flex-col gap-4 p-4 rounded-2xl border border-primary/25 backdrop-blur-[8px]">
          <span className="inline-flex items-center gap-[0.35rem] w-fit py-1 !px-3 rounded-full text-xs font-semibold tracking-[0.04em] uppercase bg-primary/15 text-primary border border-primary/30">
            <Eye aria-hidden="true" className="w-3.5 h-3.5" />
            {t('share_view_badge')}
          </span>
          <div className="flex flex-col gap-[0.35rem]">
            <h1 className="m-0 text-[1.875rem] font-extrabold text-foreground leading-tight tracking-tight sm:text-4xl">
              {lesson.topic}
            </h1>
            <p className="m-0 text-[0.95rem] text-foreground-secondary">{t('share_view_title')}</p>
          </div>
        </section>

        {/* ── Lesson metadata ── */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
          <div className="flex flex-col gap-[0.35rem] py-4 px-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] transition-colors duration-200 hover:border-primary/40">
            <span className="flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-foreground-secondary">
              <User aria-hidden="true" className="w-4 h-4" />
              {t('share_view_participant')}
            </span>
            <span className="text-base font-semibold text-foreground flex items-center gap-2">
              {lesson.participantName}
            </span>
          </div>
          <div className="flex flex-col gap-[0.35rem] py-4 px-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] transition-colors duration-200 hover:border-primary/40">
            <span className="flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-foreground-secondary">
              <Calendar aria-hidden="true" className="w-4 h-4" />
              {t('share_view_date')}
            </span>
            <span className="text-base font-semibold text-foreground flex items-center gap-2">
              {formattedDate}
            </span>
          </div>
          <div className="flex flex-col gap-[0.35rem] py-4 px-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] transition-colors duration-200 hover:border-primary/40">
            <span className="flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-foreground-secondary">
              <Flag aria-hidden="true" className="w-4 h-4" />
              {t('share_view_priority')}
            </span>
            <span className="text-base font-semibold text-foreground flex items-center gap-2">
              <PriorityBadge label={lesson.priority} variant={priorityVariant} />
            </span>
          </div>
        </div>

        {/* ── Notes ── */}
        {lesson.notes && (
          <>
            <hr className="m-0 border-none border-t border-[var(--surface-border)]" />
            <h2 className="m-0 flex items-center gap-2 text-[1.1rem] font-bold text-foreground">
              <BookOpen aria-hidden="true" className="w-[1.1rem] h-[1.1rem]" />
              {t('share_view_notes')}
            </h2>
            <p className="m-0 py-5 px-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] text-[0.95rem] leading-[1.7] text-foreground whitespace-pre-wrap break-words">
              {lesson.notes}
            </p>
          </>
        )}

        {/* ── Summary ── */}
        <SummaryLesson summary={summary} isLoading={false} isGenerating={false} t={t} />

        {/* ── Vocabulary ── */}
        <hr className="m-0 border-none border-t border-[var(--surface-border)]" />
        <h2 className="m-0 flex items-center gap-2 text-[1.1rem] font-bold text-foreground">
          <BookOpen aria-hidden="true" className="w-[1.1rem] h-[1.1rem]" />
          {t('share_view_vocabulary')}
          {lesson.vocabularies.length > 0 && ` (${lesson.vocabularies.length})`}
        </h2>
        {lesson.vocabularies.length === 0 ? (
          <p className="m-0 py-6 rounded-xl border border-dashed border-[var(--surface-border)] text-foreground-secondary text-[0.9rem] text-center italic">
            {t('share_view_no_vocab')}
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
            {lesson.vocabularies.map((vocab) => (
              <VocabularyCard key={vocab.id} vocab={vocab} t={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
