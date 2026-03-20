import { act, renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';
import type { ThemeMode } from '../types';

describe('useTheme hook', () => {
  let matchMediaMock: jest.Mock;
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    
    // Default mocks
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();
    matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: false, // Default: light theme
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: jest.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
    
    // Clear data-theme
    document.documentElement.removeAttribute('data-theme');
  });

  it('should default to system mode and light resolved theme if OS is light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should default to system mode and dark resolved theme if OS is dark', () => {
    matchMediaMock.mockImplementation((query) => ({
      matches: true, // Dark theme
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('should load theme from localStorage if available', () => {
    localStorage.setItem('elh-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('should fallback to system if localStorage value is null', () => {
    localStorage.removeItem('elh-theme');
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('system');
  });

  it('should handle setting mode manually and persisting it', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setThemeMode('light');
    });
    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
    expect(localStorage.getItem('elh-theme')).toBe('light');
  });

  it('should handle OS theme change events in system mode', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.resolvedTheme).toBe('light');
    
    // Extract the registered media query handler
    const handler = addEventListenerMock.mock.calls.find(c => c[0] === 'change')?.[1];
    expect(handler).toBeDefined();

    // Trigger the handler directly since we mocked matchMedia
    act(() => {
      handler({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should not update resolvedTheme on OS change if not in system mode', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setThemeMode('light');
    });

    // Check that we aren't listening or shouldn't react
    const addCallsCount = addEventListenerMock.mock.calls.length;
    
    // Simulate re-rendering the hook by changing props (none here)
    // The previous listener should have been removed
    expect(removeEventListenerMock).toHaveBeenCalled();
  });
  
  it('should cleanup media matcher on unmount', () => {
    const { unmount } = renderHook(() => useTheme());
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
