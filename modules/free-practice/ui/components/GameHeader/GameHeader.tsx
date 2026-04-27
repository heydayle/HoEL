'use client';

import { ArrowLeft, Moon, Sun, X } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Props for the GameHeader component.
 */
interface IGameHeaderProps {
  /** i18n translation function */
  t: (key: string) => string;
  /** Currently resolved theme */
  resolvedTheme: 'light' | 'dark';
  /** Toggle between light and dark modes */
  onToggleTheme: () => void;
  /** Callback when the "End Game" button is clicked */
  onEndGame: () => void;
  /** Callback when the back/navigation button is clicked */
  onBack: () => void;
}

/**
 * Top navigation bar for the Vocabulary Sprint game.
 *
 * Renders a back button on the left, and a colour-mode toggle plus
 * a prominent "End Game" button on the right. All styling follows
 * the Bento Neo-Brutalism design system.
 *
 * @param props - Header configuration and callbacks
 * @returns The rendered game header element
 */
export default function GameHeader({
  t,
  resolvedTheme,
  onToggleTheme,
  onEndGame,
  onBack,
}: IGameHeaderProps): React.JSX.Element {
  return (
    <header
      id="game-header"
      className={cn(
        'flex w-full items-center justify-between',
        'rounded-bento border-2 border-brutal-black bg-surface px-3 py-2 md:px-5 md:py-3',
        'shadow-brutal-sm',
      )}
    >
      {/* Left: Back button */}
      <button
        id="game-back-btn"
        onClick={onBack}
        className={cn(
          'flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2',
          'text-foreground transition-all duration-200',
          'hover:bg-surface-hover active:scale-95',
          'cursor-pointer',
        )}
        aria-label={t('back_btn')}
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        <span className="hidden text-sm font-bold sm:inline">{t('back_btn')}</span>
      </button>

      {/* Right: Theme toggle + End Game */}
      <div className="flex items-center gap-3">
        <button
          id="game-theme-toggle"
          onClick={onToggleTheme}
          className={cn(
            'flex items-center justify-center rounded-[var(--radius-md)] p-2',
            'bg-surface-hover text-foreground-secondary',
            'transition-all duration-200',
            'hover:bg-accent-primary-light hover:text-accent-primary',
            'cursor-pointer active:scale-92',
          )}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={18} strokeWidth={2} />
          ) : (
            <Moon size={18} strokeWidth={2} />
          )}
        </button>

        <button
          id="game-end-btn"
          onClick={onEndGame}
          className={cn(
            'flex items-center gap-2 rounded-[var(--radius-md)]',
            'border-2 border-brutal-black bg-terracotta px-4 py-2',
            'text-sm font-black text-white',
            'shadow-brutal-sm transition-all duration-200',
            'hover:bg-terracotta-hover hover:shadow-brutal-md',
            'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
          )}
        >
          <X size={14} strokeWidth={3} />
          <span>{t('end_game_btn')}</span>
        </button>
      </div>
    </header>
  );
}
