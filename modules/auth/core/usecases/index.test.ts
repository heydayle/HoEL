import type { IAuthFormData, IAuthResult } from '../models';
import type { IAuthRepository } from '../repositories';
import { signInUseCase, signUpUseCase, signInWithProviderUseCase, refreshSessionUseCase, getSessionUseCase } from './index';

/**
 * Creates a mock auth repository for testing.
 * @returns A mocked IAuthRepository with jest functions
 */
const createMockRepository = (): jest.Mocked<IAuthRepository> => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithProvider: jest.fn(),
  refreshSession: jest.fn(),
  getSession: jest.fn(),
});

describe('Auth Use Cases', () => {
  let mockRepo: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
  });

  describe('signInUseCase', () => {
    it('should delegate to repository.signIn and return result', async () => {
      const formData: IAuthFormData = { email: 'test@test.com', password: 'pass123' };
      const expected: IAuthResult = {
        success: true,
        user: { id: '1', email: 'test@test.com', display_name: 'Test', created_at: '' },
      };
      mockRepo.signIn.mockResolvedValue(expected);

      const result = await signInUseCase(mockRepo, formData);

      expect(mockRepo.signIn).toHaveBeenCalledWith(formData);
      expect(result).toEqual(expected);
    });

    it('should return error result when sign in fails', async () => {
      const formData: IAuthFormData = { email: 'bad@test.com', password: 'wrong' };
      const expected: IAuthResult = { success: false, error: 'Invalid email or password' };
      mockRepo.signIn.mockResolvedValue(expected);

      const result = await signInUseCase(mockRepo, formData);

      expect(result).toEqual(expected);
    });
  });

  describe('signUpUseCase', () => {
    it('should delegate to repository.signUp and return result', async () => {
      const formData: IAuthFormData = {
        email: 'new@test.com',
        password: 'pass123',
        displayName: 'New User',
      };
      const expected: IAuthResult = {
        success: true,
        user: { id: '2', email: 'new@test.com', display_name: 'New User', created_at: '' },
      };
      mockRepo.signUp.mockResolvedValue(expected);

      const result = await signUpUseCase(mockRepo, formData);

      expect(mockRepo.signUp).toHaveBeenCalledWith(formData);
      expect(result).toEqual(expected);
    });

    it('should return error result when sign up fails', async () => {
      const formData: IAuthFormData = {
        email: 'dup@test.com',
        password: 'pass',
        displayName: 'Dup',
      };
      const expected: IAuthResult = {
        success: false,
        error: 'An account with this email already exists',
      };
      mockRepo.signUp.mockResolvedValue(expected);

      const result = await signUpUseCase(mockRepo, formData);

      expect(result).toEqual(expected);
    });
  });

  describe('signInWithProviderUseCase', () => {
    it('should delegate to repository.signInWithProvider and return result', async () => {
      const expected: IAuthResult = { success: true };
      mockRepo.signInWithProvider.mockResolvedValue(expected);

      const result = await signInWithProviderUseCase(
        mockRepo,
        'google',
        'http://localhost:3000/auth/callback',
      );

      expect(mockRepo.signInWithProvider).toHaveBeenCalledWith(
        'google',
        'http://localhost:3000/auth/callback',
      );
      expect(result).toEqual(expected);
    });

    it('should return error result when provider sign in fails', async () => {
      const expected: IAuthResult = { success: false, error: 'Provider error' };
      mockRepo.signInWithProvider.mockResolvedValue(expected);

      const result = await signInWithProviderUseCase(
        mockRepo,
        'github',
        'http://localhost:3000/auth/callback',
      );

      expect(result).toEqual(expected);
    });
  });

  describe('refreshSessionUseCase', () => {
    it('should delegate to repository.refreshSession and return result', async () => {
      const expected: IAuthResult = {
        success: true,
        session: { access_token: 'new-token' } as IAuthResult['session'],
      };
      mockRepo.refreshSession.mockResolvedValue(expected);

      const result = await refreshSessionUseCase(mockRepo);

      expect(mockRepo.refreshSession).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should return error result when refresh fails', async () => {
      const expected: IAuthResult = { success: false, error: 'Refresh token expired' };
      mockRepo.refreshSession.mockResolvedValue(expected);

      const result = await refreshSessionUseCase(mockRepo);

      expect(result).toEqual(expected);
    });
  });

  describe('getSessionUseCase', () => {
    it('should delegate to repository.getSession and return result', async () => {
      const expected: IAuthResult = {
        success: true,
        session: { access_token: 'current-token' } as IAuthResult['session'],
      };
      mockRepo.getSession.mockResolvedValue(expected);

      const result = await getSessionUseCase(mockRepo);

      expect(mockRepo.getSession).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should return error result when getSession fails', async () => {
      const expected: IAuthResult = { success: false, error: 'Session error' };
      mockRepo.getSession.mockResolvedValue(expected);

      const result = await getSessionUseCase(mockRepo);

      expect(result).toEqual(expected);
    });
  });
});
