'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the height of the software keyboard using the `visualViewport` API.
 *
 * On iOS Safari, focusing an input causes the browser to scroll the page
 * **upward** rather than shrinking the viewport. Using `position: fixed` on
 * the game container prevents that scroll, but the keyboard then physically
 * overlaps the bottom of the screen. This hook measures that overlap so the
 * layout can add the correct bottom padding to keep the input visible.
 *
 * @returns The keyboard height in pixels (0 when the keyboard is hidden)
 */
export const useKeyboardAware = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    /**
     * Recalculates the keyboard height whenever the visual viewport resizes
     * (keyboard open/close) or scrolls (page scroll while keyboard is open).
     *
     * Formula: window.innerHeight is the full screen height (never changes
     * with keyboard). viewport.height is the visible area above the keyboard.
     * The difference is the keyboard + any system UI chrome at the bottom.
     */
    const handleChange = () => {
      const keyboard = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      setKeyboardHeight(keyboard);
    };

    viewport.addEventListener('resize', handleChange);
    viewport.addEventListener('scroll', handleChange);

    /** Run once on mount in case the keyboard is already open */
    handleChange();

    return () => {
      viewport.removeEventListener('resize', handleChange);
      viewport.removeEventListener('scroll', handleChange);
    };
  }, []);

  return keyboardHeight;
};
