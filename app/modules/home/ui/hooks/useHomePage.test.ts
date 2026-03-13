import { renderHook, act } from '@testing-library/react';
import { useHomePage } from './useHomePage';
import * as sharedHooks from '@/app/shared/hooks';

// Mock the shared hooks to isolate useHomePage testing
jest.mock('@/app/shared/hooks', () => ({
  useTheme: jest.fn(() => ({
    mode: 'system',
    resolvedTheme: 'dark',
    setThemeMode: jest.fn(),
  })),
  useLocale: jest.fn(() => ({
    locale: 'en',
    setLocale: jest.fn(),
    t: jest.fn((key) => `mockT_${key}`),
  })),
}));

describe('useHomePage hook', () => {
  it('should aggregate and provide theme and locale functionalities', () => {
    const { result } = renderHook(() => useHomePage());
    
    expect(result.current).toHaveProperty('resolvedTheme', 'dark');
    expect(result.current).toHaveProperty('locale', 'en');
    
    // Check if toggleTheme toggles between light and dark
    // Since mock useTheme is read-only here, let's just make sure it's exported
    expect(typeof result.current.toggleTheme).toBe('function');
    expect(typeof result.current.setLocale).toBe('function');
  });

  it('should provide localized translation function t', () => {
    const { result } = renderHook(() => useHomePage());
    expect(result.current.t('hello')).toBe('mockT_hello');
  });

  it('should fetch and provide features and stats data from usecases', () => {
    const { result } = renderHook(() => useHomePage());
    
    expect(Array.isArray(result.current.features)).toBe(true);
    expect(result.current.features.length).toBeGreaterThan(0);
    
    expect(Array.isArray(result.current.stats)).toBe(true);
    expect(result.current.stats.length).toBeGreaterThan(0);
  });
  
  it('toggleTheme should behave correctly by flipping resolvedTheme', () => {
    const mockSetThemeMode = jest.fn();
    jest.spyOn(sharedHooks, 'useTheme').mockImplementationOnce(() => ({
      mode: 'system',
      resolvedTheme: 'light',
      setThemeMode: mockSetThemeMode,
    }));
    
    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.toggleTheme();
    });
    
    // Next theme after light is dark
    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');
  });

  it('toggleTheme from dark switches to light', () => {
    const mockSetThemeMode = jest.fn();
    jest.spyOn(sharedHooks, 'useTheme').mockImplementationOnce(() => ({
      mode: 'system',
      resolvedTheme: 'dark',
      setThemeMode: mockSetThemeMode,
    }));
    
    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.toggleTheme();
    });
    
    // Next theme after dark is light
    expect(mockSetThemeMode).toHaveBeenCalledWith('light');
  });
});
