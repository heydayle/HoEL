import { renderHook, act } from '@testing-library/react';
import { useTextToSpeech } from './useTextToSpeech';

/** Captured event handlers from the last SpeechSynthesisUtterance instance */
let capturedHandlers: Record<string, (() => void) | null>;

/** Mock SpeechSynthesisUtterance constructor */
let MockUtterance: jest.Mock;

/** Mock speechSynthesis methods */
const mockSpeak = jest.fn();
const mockCancel = jest.fn();

beforeEach(() => {
  capturedHandlers = { onstart: null, onend: null, onerror: null };

  MockUtterance = jest.fn().mockImplementation((text: string) => {
    const instance = {
      text,
      lang: '',
      rate: 1,
      pitch: 1,
      set onstart(fn: () => void) {
        capturedHandlers.onstart = fn;
      },
      set onend(fn: () => void) {
        capturedHandlers.onend = fn;
      },
      set onerror(fn: () => void) {
        capturedHandlers.onerror = fn;
      },
    };
    return instance;
  });

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

      const instance = MockUtterance.mock.results[0].value;
      expect(instance.lang).toBe('en-US');
    });

    it('accepts a custom lang parameter', () => {
      const { result } = renderHook(() => useTextToSpeech('en-GB'));

      act(() => {
        result.current.speak('colour');
      });

      const instance = MockUtterance.mock.results[0].value;
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
