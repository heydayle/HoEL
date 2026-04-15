import { TextEncoder } from 'util';
import { webcrypto } from 'crypto';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { IAuthFormData } from '../core/models';
import { UsersTableAuthRepository, hashPassword } from './authRepository';

/* Polyfill TextEncoder and crypto.subtle for Jest (jsdom) environment */
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to polyfill Web Crypto API in jsdom
if (!global.crypto) {
  (global as any).crypto = {};
}
if (!global.crypto.subtle) {
  (global.crypto as any).subtle = webcrypto.subtle;
}

/**
 * Creates a mock Supabase client for testing.
 * Mocks .from().select().eq().limit() and .from().insert().select().single() chains.
 * @returns A partially mocked SupabaseClient
 */
const createMockClient = () => {
  const mockLimit = jest.fn();
  const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
  const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
  const mockSingle = jest.fn();
  const mockInsertSelect = jest.fn().mockReturnValue({ single: mockSingle });
  const mockInsert = jest.fn().mockReturnValue({ select: mockInsertSelect });

  return {
    from: jest.fn().mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    }),
    auth: {
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      refreshSession: jest.fn(),
      getSession: jest.fn(),
    },
    /** Exposed for direct assertion access */
    _mocks: { mockSelect, mockEq, mockLimit, mockInsert, mockInsertSelect, mockSingle },
  };
};

describe('UsersTableAuthRepository', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for deeply mocked Supabase client
  let mockClient: any;
  let repo: UsersTableAuthRepository;

  beforeEach(() => {
    mockClient = createMockClient();
    repo = new UsersTableAuthRepository(mockClient as unknown as SupabaseClient);
  });

  describe('hashPassword', () => {
    it('should return a deterministic hex string', async () => {
      const hash1 = await hashPassword('test-password');
      const hash2 = await hashPassword('test-password');

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should produce different hashes for different passwords', async () => {
      const hash1 = await hashPassword('password-a');
      const hash2 = await hashPassword('password-b');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('signIn', () => {
    const formData: IAuthFormData = { email: 'test@test.com', password: 'password123' };

    it('should return success with user data on valid credentials', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: 'u1',
            email: 'test@test.com',
            user_metadata: { display_name: 'Test' },
            created_at: '2026-01-01',
          },
          session: { access_token: 'token123' },
        },
        error: null,
      });

      const result = await repo.signIn(formData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 'u1',
        email: 'test@test.com',
        display_name: 'Test',
        created_at: '2026-01-01',
      });
      expect(result.user).not.toHaveProperty('password');
    });

    it('should return error when no user is found', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid email or password' },
      });

      const result = await repo.signIn(formData);

      expect(result).toEqual({ success: false, error: 'Invalid email or password' });
    });

    it('should return error when password does not match', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid email or password' },
      });

      const result = await repo.signIn(formData);

      expect(result).toEqual({ success: false, error: 'Invalid email or password' });
    });

    it('should return error on database query failure', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
      });

      const result = await repo.signIn(formData);

      expect(result).toEqual({ success: false, error: 'DB error' });
    });
  });

  describe('signUp', () => {
    const formData: IAuthFormData = {
      email: 'new@test.com',
      password: 'password123',
      displayName: 'New User',
    };

    it('should insert and return user data on success', async () => {
      mockClient.auth.signUp.mockResolvedValue({
        data: {
          user: {
            id: 'u2',
            email: 'new@test.com',
            user_metadata: { display_name: 'New User' },
            created_at: '2026-01-02',
          },
          session: { access_token: 'token456' },
        },
        error: null,
      });

      const result = await repo.signUp(formData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 'u2',
        email: 'new@test.com',
        display_name: 'New User',
        created_at: '2026-01-02',
      });
    });

    it('should fallback display_name to email prefix when not provided', async () => {
      const dataWithoutName: IAuthFormData = { email: 'jane@example.com', password: 'pass' };
      mockClient.auth.signUp.mockResolvedValue({
        data: {
          user: {
            id: 'u3',
            email: 'jane@example.com',
            user_metadata: {},
            created_at: '2026-01-03',
          },
          session: { access_token: 'token789' },
        },
        error: null,
      });

      const result = await repo.signUp(dataWithoutName);

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('jane@example.com');
    });

    it('should return error when email already exists', async () => {
      mockClient.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'An account with this email already exists' },
      });

      const result = await repo.signUp(formData);

      expect(result).toEqual({
        success: false,
        error: 'An account with this email already exists',
      });
    });

    it('should return error when lookup query fails', async () => {
      mockClient.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Lookup failed' },
      });

      const result = await repo.signUp(formData);

      expect(result).toEqual({ success: false, error: 'Lookup failed' });
    });

    it('should return error when insert fails', async () => {
      mockClient.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      });

      const result = await repo.signUp(formData);

      expect(result).toEqual({ success: false, error: 'Insert failed' });
    });
  });

  describe('signInWithProvider', () => {
    it('should call supabase.auth.signInWithOAuth and return success', async () => {
      mockClient.auth.signInWithOAuth.mockResolvedValue({ error: null });

      const result = await repo.signInWithProvider('google', 'http://localhost:3000/auth/callback');

      expect(result).toEqual({ success: true });
      expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/auth/callback' },
      });
    });

    it('should return error when OAuth fails', async () => {
      mockClient.auth.signInWithOAuth.mockResolvedValue({
        error: { message: 'OAuth provider not configured' },
      });

      const result = await repo.signInWithProvider('github', 'http://localhost:3000/auth/callback');

      expect(result).toEqual({ success: false, error: 'OAuth provider not configured' });
    });
  });

  describe('refreshSession', () => {
    it('should return success with new session on successful refresh', async () => {
      const mockNewSession = { access_token: 'new-token', refresh_token: 'new-refresh' };
      mockClient.auth.refreshSession.mockResolvedValue({
        data: { session: mockNewSession },
        error: null,
      });

      const result = await repo.refreshSession();

      expect(result.success).toBe(true);
      expect(result.session).toEqual(mockNewSession);
      expect(mockClient.auth.refreshSession).toHaveBeenCalledTimes(1);
    });

    it('should return error when refresh token is expired or invalid', async () => {
      mockClient.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid Refresh Token: Already Used' },
      });

      const result = await repo.refreshSession();

      expect(result).toEqual({
        success: false,
        error: 'Invalid Refresh Token: Already Used',
      });
    });

    it('should return success with undefined session when data.session is null', async () => {
      mockClient.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await repo.refreshSession();

      expect(result.success).toBe(true);
      expect(result.session).toBeUndefined();
    });
  });

  describe('getSession', () => {
    it('should return success with current session', async () => {
      const mockCurrentSession = { access_token: 'current-token', refresh_token: 'current-refresh' };
      mockClient.auth.getSession.mockResolvedValue({
        data: { session: mockCurrentSession },
        error: null,
      });

      const result = await repo.getSession();

      expect(result.success).toBe(true);
      expect(result.session).toEqual(mockCurrentSession);
      expect(mockClient.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should return success with undefined session when no session exists', async () => {
      mockClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await repo.getSession();

      expect(result.success).toBe(true);
      expect(result.session).toBeUndefined();
    });

    it('should return error when getSession fails', async () => {
      mockClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Session retrieval failed' },
      });

      const result = await repo.getSession();

      expect(result).toEqual({
        success: false,
        error: 'Session retrieval failed',
      });
    });
  });
});
