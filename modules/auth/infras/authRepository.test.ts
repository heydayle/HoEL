import { TextEncoder } from 'util';
import { webcrypto } from 'crypto';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { IAuthFormData } from '../core/models';
import { UsersTableAuthRepository, hashPassword } from './authRepository';

/* Polyfill TextEncoder and crypto.subtle for Jest (jsdom) environment */
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to polyfill Web Crypto API in jsdom
(global as any).crypto = { subtle: webcrypto.subtle };

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
      const hashedPw = await hashPassword('password123');
      mockClient._mocks.mockLimit.mockResolvedValue({
        data: [
          {
            id: 'u1',
            email: 'test@test.com',
            display_name: 'Test',
            password: hashedPw,
            created_at: '2026-01-01',
          },
        ],
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
      mockClient._mocks.mockLimit.mockResolvedValue({ data: [], error: null });

      const result = await repo.signIn(formData);

      expect(result).toEqual({ success: false, error: 'Invalid email or password' });
    });

    it('should return error when password does not match', async () => {
      mockClient._mocks.mockLimit.mockResolvedValue({
        data: [
          {
            id: 'u1',
            email: 'test@test.com',
            display_name: 'Test',
            password: 'wrong-hash',
            created_at: '2026-01-01',
          },
        ],
        error: null,
      });

      const result = await repo.signIn(formData);

      expect(result).toEqual({ success: false, error: 'Invalid email or password' });
    });

    it('should return error on database query failure', async () => {
      mockClient._mocks.mockLimit.mockResolvedValue({
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
      // First call: check existing — no duplicates
      mockClient._mocks.mockLimit.mockResolvedValue({ data: [], error: null });
      // Second call: insert
      const hashedPw = await hashPassword('password123');
      mockClient._mocks.mockSingle.mockResolvedValue({
        data: {
          id: 'u2',
          email: 'new@test.com',
          display_name: 'New User',
          password: hashedPw,
          created_at: '2026-01-02',
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
      mockClient._mocks.mockLimit.mockResolvedValue({ data: [], error: null });
      mockClient._mocks.mockSingle.mockResolvedValue({
        data: {
          id: 'u3',
          email: 'jane@example.com',
          display_name: 'jane',
          password: 'hashed',
          created_at: '2026-01-03',
        },
        error: null,
      });

      const result = await repo.signUp(dataWithoutName);

      expect(result.success).toBe(true);
      expect(result.user?.display_name).toBe('jane');
    });

    it('should return error when email already exists', async () => {
      mockClient._mocks.mockLimit.mockResolvedValue({
        data: [{ id: 'existing-id' }],
        error: null,
      });

      const result = await repo.signUp(formData);

      expect(result).toEqual({
        success: false,
        error: 'An account with this email already exists',
      });
    });

    it('should return error when lookup query fails', async () => {
      mockClient._mocks.mockLimit.mockResolvedValue({
        data: null,
        error: { message: 'Lookup failed' },
      });

      const result = await repo.signUp(formData);

      expect(result).toEqual({ success: false, error: 'Lookup failed' });
    });

    it('should return error when insert fails', async () => {
      mockClient._mocks.mockLimit.mockResolvedValue({ data: [], error: null });
      mockClient._mocks.mockSingle.mockResolvedValue({
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
});
