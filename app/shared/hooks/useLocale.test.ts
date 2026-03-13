import { act, renderHook } from '@testing-library/react';
import { useLocale } from './useLocale';
import type { Locale, TranslationMessages } from '../types';

describe('useLocale hook', () => {
  const mockMessages: Record<Locale, TranslationMessages> = {
    en: { greeting: 'Hello', unused: 'Unused' },
    vi: { greeting: 'Xin chào', unused: 'Không dùng' },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with the default locale (en)', () => {
    const { result } = renderHook(() => useLocale(mockMessages));
    expect(result.current.locale).toBe('en');
    expect(result.current.t('greeting')).toBe('Hello');
  });

  it('should initialize with a locale from localStorage if available', () => {
    localStorage.setItem('elh-locale', 'vi');
    const { result } = renderHook(() => useLocale(mockMessages));
    expect(result.current.locale).toBe('vi');
    expect(result.current.t('greeting')).toBe('Xin chào');
  });

  it('should fallback to en if invalid locale in localStorage', () => {
    localStorage.setItem('elh-locale', 'fr');
    const { result } = renderHook(() => useLocale(mockMessages));
    expect(result.current.locale).toBe('en');
  });

  it('should ignore localStorage if null', () => {
    localStorage.removeItem('elh-locale');
    const { result } = renderHook(() => useLocale(mockMessages));
    expect(result.current.locale).toBe('en');
  });

  it('should return the key if the translation is missing', () => {
    const { result } = renderHook(() => useLocale(mockMessages));
    expect(result.current.t('missing_key')).toBe('missing_key');
  });

  it('should return the key if the current language has no translation for it', () => {
    const customMessages = {
      en: { greeting: 'Hello' },
      vi: {} as TranslationMessages,
    };
    const { result } = renderHook(() => useLocale(customMessages));
    act(() => {
      result.current.setLocale('vi');
    });
    expect(result.current.t('greeting')).toBe('greeting');
  });

  it('should allow changing the locale and persisting it', () => {
    const { result } = renderHook(() => useLocale(mockMessages));

    act(() => {
      result.current.setLocale('vi');
    });

    expect(result.current.locale).toBe('vi');
    expect(result.current.t('greeting')).toBe('Xin chào');
    expect(localStorage.getItem('elh-locale')).toBe('vi');
  });
});
