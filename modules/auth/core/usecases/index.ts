import type { AuthProvider, IAuthFormData, IAuthResult } from '../models';
import type { IAuthRepository } from '../repositories';

/**
 * Use case for signing in a user via the `users` table.
 * @param repository - The authentication repository implementation
 * @param data - The sign-in form data (email + password)
 * @returns The authentication result including user data on success
 */
export const signInUseCase = async (
  repository: IAuthRepository,
  data: IAuthFormData
): Promise<IAuthResult> => {
  return repository.signIn(data);
};

/**
 * Use case for registering a new user in the `users` table.
 * @param repository - The authentication repository implementation
 * @param data - The registration form data (email + password + displayName)
 * @returns The authentication result including user data on success
 */
export const signUpUseCase = async (
  repository: IAuthRepository,
  data: IAuthFormData
): Promise<IAuthResult> => {
  return repository.signUp(data);
};

/**
 * Use case for signing in via an OAuth provider (Google, GitHub, etc.).
 * @param repository - The authentication repository implementation
 * @param provider - The OAuth provider identifier
 * @param redirectTo - The callback URL after successful auth
 * @returns The authentication result (error only since OAuth redirects)
 */
export const signInWithProviderUseCase = async (
  repository: IAuthRepository,
  provider: AuthProvider,
  redirectTo: string
): Promise<IAuthResult> => {
  return repository.signInWithProvider(provider, redirectTo);
};

