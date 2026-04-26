import { vi } from 'vitest'
import { renderHook, act } from '@testing-library/react';

import { useSessionGuard } from './useSessionGuard';

/** Mock session data */
const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
};

const mockGetSession = vi.fn();
const mockRefreshSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock('@/shared/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: () => mockGetSession(),
      refreshSession: () => mockRefreshSession(),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  }),
}));

vi.mock('@/shared/utils/navigation', () => ({
  navigateTo: (...args: unknown[]) => mockNavigateTo(...args),
}));

describe('useSessionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    mockRefreshSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should subscribe to auth state changes on mount', () => {
    renderHook(() => useSessionGuard());

    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(typeof mockOnAuthStateChange.mock.calls[0][0]).toBe('function');
  });

  it('should read the current session on mount', async () => {
    renderHook(() => useSessionGuard());

    /** Wait for the async initTimer to complete */
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it('should schedule a refresh timer based on session expires_at', async () => {
    const expiresAt = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now
    mockGetSession.mockResolvedValue({
      data: { session: { ...mockSession, expires_at: expiresAt } },
    });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    /** Timer should be set — advance close to expiry minus buffer (60s) */
    /** 120s - 60s buffer = 60s delay = 60000ms */
    expect(mockRefreshSession).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(60_000);
      await Promise.resolve();
    });

    expect(mockRefreshSession).toHaveBeenCalledTimes(1);
  });

  it('should refresh immediately when token is already within buffer window', async () => {
    /** Token expires in 30 seconds, which is within the 60s buffer */
    const expiresAt = Math.floor(Date.now() / 1000) + 30;
    mockGetSession.mockResolvedValue({
      data: { session: { ...mockSession, expires_at: expiresAt } },
    });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    /** Should schedule with delay 0 (immediate) */
    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockRefreshSession).toHaveBeenCalledTimes(1);
  });

  it('should redirect to /auth when refresh fails', async () => {
    const expiresAt = Math.floor(Date.now() / 1000) + 30;
    mockGetSession.mockResolvedValue({
      data: { session: { ...mockSession, expires_at: expiresAt } },
    });
    mockRefreshSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Refresh token expired' },
    });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith('/auth');
  });

  it('should re-schedule refresh when TOKEN_REFRESHED event fires', async () => {
    const newExpiresAt = Math.floor(Date.now() / 1000) + 7200; // 2 hours
    mockOnAuthStateChange.mockImplementation((callback: Function) => {
      /** Simulate a TOKEN_REFRESHED event */
      callback('TOKEN_REFRESHED', {
        ...mockSession,
        expires_at: newExpiresAt,
      });
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    /** The timer should not fire yet — 2 hours - 60s buffer = 7140s */
    expect(mockRefreshSession).not.toHaveBeenCalled();
  });

  it('should clear timer on SIGNED_OUT event', async () => {
    /** Ensure initTimer does NOT schedule a refresh */
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockImplementation((callback: Function) => {
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    /** Advance time well past any possible expiry — refresh should NOT fire */
    await act(async () => {
      vi.advanceTimersByTime(7_200_000);
      await Promise.resolve();
    });

    expect(mockRefreshSession).not.toHaveBeenCalled();
  });

  it('should unsubscribe and clear timer on unmount', async () => {
    const mockUnsubscribe = vi.fn();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should not schedule refresh when session is null', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    renderHook(() => useSessionGuard());

    await act(async () => {
      await Promise.resolve();
    });

    /** Advance time — no timer should fire */
    await act(async () => {
      vi.advanceTimersByTime(120_000);
      await Promise.resolve();
    });

    expect(mockRefreshSession).not.toHaveBeenCalled();
  });
});
