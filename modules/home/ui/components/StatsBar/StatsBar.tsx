"use client";

import type { ILearningStat } from "@/modules/home/core/models";

/**
 * Props for the StatsBar component.
 */
interface IStatsBarProps {
  /** Array of learning stat objects to display */
  stats: ILearningStat[];
  /** Translation function to resolve stat label keys */
  t: (key: string) => string;
}

/**
 * StatsBar component displaying learning statistics in a horizontal bar.
 * Uses glassmorphism effects and staggered fade-in animations.
 * @param props - StatsBar props including stats data and translation function
 * @returns The rendered StatsBar element
 */
export default function StatsBar({
  stats,
  t,
}: IStatsBarProps): React.JSX.Element {
  return (
    <section
      id="stats-bar"
      className="
        mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center
        gap-4 px-6 py-8
        sm:gap-6
      "
      style={{ animation: "fadeInUp 0.8s ease-out 0.5s both" }}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="
            flex min-w-[140px] flex-col items-center gap-2
            rounded-[var(--radius-lg)] border border-surface-border
            bg-surface px-6 py-5
            transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            hover:border-accent-primary/30
            hover:shadow-[var(--surface-shadow-hover)]
            hover:-translate-y-1
          "
          style={{
            animation: `scaleIn 0.5s ease-out ${0.6 + index * 0.1}s both`,
          }}
        >
          <span className="text-2xl">{stat.icon}</span>
          <span className="text-2xl font-bold text-foreground">
            {stat.value}
          </span>
          <span className="text-xs font-medium tracking-wide text-foreground-muted uppercase">
            {t(stat.labelKey)}
          </span>
        </div>
      ))}
    </section>
  );
}
