import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeyboardAware } from './useKeyboardAware';

/** Helper to build a minimal visualViewport mock. */
const makeViewport = (height: number, offsetTop = 0) => {
  const listeners: Record<string, EventListener[]> = {};

  return {
    height,
    offsetTop,
    addEventListener: vi.fn((event: string, cb: EventListener) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(cb);
    }),
    removeEventListener: vi.fn((event: string, cb: EventListener) => {
      listeners[event] = (listeners[event] ?? []).filter((l) => l !== cb);
    }),
    /** Test helper: fire an event on this mock viewport */
    _fire: (event: string) => {
      (listeners[event] ?? []).forEach((cb) => cb(new Event(event)));
    },
  };
};

describe('useKeyboardAware', () => {
  const originalInnerHeight = window.innerHeight;
  const originalVisualViewport = window.visualViewport;

  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: originalVisualViewport,
    });
  });

  it('returns 0 when visualViewport is not available', () => {
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: null,
    });

    const { result } = renderHook(() => useKeyboardAware());

    expect(result.current).toBe(0);
  });

  it('returns 0 when keyboard is closed (full height visible)', () => {
    const viewport = makeViewport(800);
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: viewport,
    });

    const { result } = renderHook(() => useKeyboardAware());

    expect(result.current).toBe(0);
  });

  it('returns keyboard height when viewport shrinks', () => {
    const viewport = makeViewport(500); // keyboard takes 300px
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: viewport,
    });

    const { result } = renderHook(() => useKeyboardAware());

    act(() => {
      viewport._fire('resize');
    });

    expect(result.current).toBe(300);
  });

  it('removes event listeners on unmount', () => {
    const viewport = makeViewport(800);
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: viewport,
    });

    const { unmount } = renderHook(() => useKeyboardAware());

    unmount();

    expect(viewport.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(viewport.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
