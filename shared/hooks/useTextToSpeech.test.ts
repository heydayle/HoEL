import { vi, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react';
import { useTextToSpeech } from './useTextToSpeech';

/** Captured event handlers from the last SpeechSynthesisUtterance instance */
let capturedHandlers: Record<string, (() => void) | null>;

/** Mock SpeechSynthesisUtterance constructor — wrapped with vi.fn for call tracking */
let MockUtterance: Mock;

/** Mock speechSynthesis methods */
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

beforeEach(() => {
  capturedHandlers = { onstart: null, onend: null, onerror: null };

  /**
   * Use a regular function (not arrow) so it supports `new` invocation.
   * vi.fn wraps it to enable .mock tracking while preserving [[Construct]].
   */
  MockUtterance = vi.fn(function (this: Record<string, unknown>, text: string) {
    this.text = text;
    this.lang = '';
    this.rate = 1;
    this.pitch = 1;

    Object.defineProperty(this, 'onstart', {
      set(fn: () => void) { capturedHandlers.onstart = fn; },
      configurable: true,
    });
    Object.defineProperty(this, 'onend', {
      set(fn: () => void) { capturedHandlers.onend = fn; },
      configurable: true,
    });
    Object.defineProperty(this, 'onerror', {
      set(fn: () => void) { capturedHandlers.onerror = fn; },
      configurable: true,
    });
  }) as unknown as Mock;

  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: MockUtterance,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'speechSynthesis', {
    value: { speak: mockSpeak, cancel: mockCancel },
    writable: true,
    configurable: true,
  });

  mockSpeak.mockClear();
  mockCancel.mockClear();
});

describe('useTextToSpeech', () => {
  describe('browser support', () => {
    it('reports isSupported=true when speechSynthesis is available', () => {
      const { result } = renderHook(() => useTextToSpeech());
      expect(result.current.isSupported).toBe(true);
    });

    it('reports isSupported=false when speechSynthesis is absent', () => {
      /* Temporarily remove speechSynthesis */
      const original = window.speechSynthesis;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- removing API for test
      delete (window as any).speechSynthesis;

      const { result } = renderHook(() => useTextToSpeech());
      expect(result.current.isSupported).toBe(false);

      /* Restore */
      Object.defineProperty(window, 'speechSynthesis', {
        value: original,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('initial state', () => {
    it('starts with isSpeaking=false and currentWord=null', () => {
      const { result } = renderHook(() => useTextToSpeech());
      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.currentWord).toBeNull();
    });
  });

  describe('speak', () => {
    it('calls speechSynthesis.speak with the correct text', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('hello');
      });

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalledTimes(1);
      expect(MockUtterance).toHaveBeenCalledWith('hello');
    });

    it('sets the default lang to en-US', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('test');
      });

      const instance = MockUtterance.mock.instances[0];
      expect(instance.lang).toBe('en-US');
    });

    it('accepts a custom lang parameter', () => {
      const { result } = renderHook(() => useTextToSpeech('en-GB'));

      act(() => {
        result.current.speak('colour');
      });

      const instance = MockUtterance.mock.instances[0];
      expect(instance.lang).toBe('en-GB');
    });

    it('does not speak empty or whitespace-only text', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('   ');
      });

      expect(mockSpeak).not.toHaveBeenCalled();
    });

    it('sets isSpeaking=true and currentWord on utterance start', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('happy');
      });

      /* Simulate the onstart callback */
      act(() => {
        capturedHandlers.onstart?.();
      });

      expect(result.current.isSpeaking).toBe(true);
      expect(result.current.currentWord).toBe('happy');
    });

    it('resets state on utterance end', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('happy');
      });

      act(() => {
        capturedHandlers.onstart?.();
      });

      act(() => {
        capturedHandlers.onend?.();
      });

      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.currentWord).toBeNull();
    });

    it('resets state on utterance error', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('happy');
      });

      act(() => {
        capturedHandlers.onstart?.();
      });

      act(() => {
        capturedHandlers.onerror?.();
      });

      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.currentWord).toBeNull();
    });
  });

  describe('cancel', () => {
    it('calls speechSynthesis.cancel and resets state', () => {
      const { result } = renderHook(() => useTextToSpeech());

      act(() => {
        result.current.speak('happy');
      });

      act(() => {
        capturedHandlers.onstart?.();
      });

      mockCancel.mockClear();

      act(() => {
        result.current.cancel();
      });

      expect(mockCancel).toHaveBeenCalled();
      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.currentWord).toBeNull();
    });
  });

  describe('cleanup on unmount', () => {
    it('cancels speech when the component unmounts', () => {
      const { unmount } = renderHook(() => useTextToSpeech());

      mockCancel.mockClear();
      unmount();

      expect(mockCancel).toHaveBeenCalled();
    });
  });
});
