import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Return type for the useTextToSpeech hook.
 */
interface IUseTextToSpeechReturn {
  /** Speaks the given text aloud using the browser SpeechSynthesis API */
  speak: (text: string) => void;
  /** Cancels any ongoing speech */
  cancel: () => void;
  /** Whether the browser supports the SpeechSynthesis API */
  isSupported: boolean;
  /** Whether speech is currently being spoken */
  isSpeaking: boolean;
  /** The word currently being spoken, or null if idle */
  currentWord: string | null;
}

/**
 * Custom hook providing text-to-speech via the browser SpeechSynthesis API.
 * Speaks English text by default (configurable via `lang` parameter).
 *
 * @param lang - BCP 47 language tag for the utterance (default: `'en-US'`)
 * @returns Object containing `speak`, `cancel`, `isSupported`, `isSpeaking`, and `currentWord`
 */
export function useTextToSpeech(lang = 'en-US'): IUseTextToSpeechReturn {
  /** Whether the browser supports the SpeechSynthesis API */
  const [isSupported, setIsSupported] = useState(false);

  /** Whether speech is actively playing */
  const [isSpeaking, setIsSpeaking] = useState(false);

  /** The word currently being spoken */
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  /** Ref to the current utterance so we can cancel it */
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  /** Check browser support on mount */
  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  /**
   * Cancels any ongoing speech and resets internal state.
   */
  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = null;
    setIsSpeaking(false);
    setCurrentWord(null);
  }, []);

  /**
   * Speaks the provided text aloud.
   * If speech is already playing, it cancels the previous utterance first.
   *
   * @param text - The text to speak
   */
  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) {
        return;
      }

      /* Cancel any ongoing speech before starting a new one */
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentWord(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentWord(null);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentWord(null);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, lang],
  );

  /** Cleanup: cancel speech when the component unmounts */
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, cancel, isSupported, isSpeaking, currentWord };
}
