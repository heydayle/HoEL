"use client";

import type { IFeatureHighlight } from "@/modules/home/core/models";
import { motion } from "framer-motion";

/**
 * Props for the FeatureHighlights component.
 */
interface IFeatureHighlightsProps {
  /** Array of feature highlight data to render */
  highlights: IFeatureHighlight[];
  /** Translation function to resolve title/description keys */
  t: (key: string) => string;
}

/** Spring physics config as specified by the design system */
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 20 };

/**
 * FeatureHighlights — Neo-Brutalism pill badges displaying app capabilities.
 * Features thick borders, solid shadows, and spring hover animations.
 * @param props - FeatureHighlights props
 * @returns The rendered FeatureHighlights element
 */
export function FeatureHighlights({
  highlights,
  t,
}: IFeatureHighlightsProps): React.JSX.Element {
  return (
    <section id="feature-highlights-section" aria-label="App features" className="w-full">
      <div className="flex flex-wrap justify-center gap-4">
        {highlights.map((item, index) => (
          <motion.span
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 + index * 0.08 }}
            whileHover={{ y: -2, x: -2, boxShadow: 'var(--shadow-brutal-md)' }}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full border-2 border-brutal-black bg-brutal-white text-sm font-bold text-foreground shadow-[var(--shadow-brutal-sm)] cursor-default"
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{t(item.titleKey)}</span>
          </motion.span>
        ))}
      </div>
    </section>
  );
}
