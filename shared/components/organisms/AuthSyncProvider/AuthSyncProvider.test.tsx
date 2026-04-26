import { vi } from 'vitest'
import { render, waitFor } from '@testing-library/react';

import { AUTH_TOKEN_KEY } from '@/shared/utils/constants';

import { AuthSyncProvider } from './AuthSyncProvider';

/** Mock user data returned by supabase.auth.getUser() */
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: { display_name: 'Test User' },
  created_at: '2026-01-01T00:00:00Z',
};

const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/shared/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: () => mockGetUser(),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  }),
}));

/** Mock the useSessionGuard hook — tested independently */
vi.mock('@/shared/hooks/useSessionGuard', () => ({
  useSessionGuard: vi.fn(),
}));

describe('AuthSyncProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should store user data in localStorage when user is authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    render(<AuthSyncProvider />);

    await waitFor(() => {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.id).toBe('user-123');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.display_name).toBe('Test User');
    });
  });

  it('should remove localStorage when user is not authenticated', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'old-data');
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(<AuthSyncProvider />);

    await waitFor(() => {
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    });
  });

  it('should subscribe to auth state changes', () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(<AuthSyncProvider />);

    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(typeof mockOnAuthStateChange.mock.calls[0][0]).toBe('function');
  });

  it('should update localStorage on auth state change with user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockOnAuthStateChange.mockImplementation((callback: Function) => {
      /** Simulate an auth state change with a signed-in user */
      callback('SIGNED_IN', {
        user: {
          id: 'user-456',
          email: 'new@example.com',
          user_metadata: { full_name: 'New User' },
          created_at: '2026-02-01T00:00:00Z',
        },
      });
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(<AuthSyncProvider />);

    await waitFor(() => {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.id).toBe('user-456');
      expect(parsed.display_name).toBe('New User');
    });
  });

  it('should clear localStorage on auth state change with sign out', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'existing-data');
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockOnAuthStateChange.mockImplementation((callback: Function) => {
      /** Simulate a sign-out event */
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(<AuthSyncProvider />);

    await waitFor(() => {
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    });
  });

  it('should render nothing (return null)', () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { container } = render(<AuthSyncProvider />);

    expect(container.innerHTML).toBe('');
  });
});
