import type { AuthProvider, IAuthFormData, IAuthResult } from '../models';

/**
 * Interface defining the repository contract for authentication operations.
 * Supports both custom `users` table auth and OAuth provider sign-in.
 */
export interface IAuthRepository {
  /**
   * Signs in a user by looking up their email and verifying the password
   * against the `users` table.
   * @param data - The form data containing email and password
   * @returns A promise resolving to the authentication result with user data
   */
  signIn(data: IAuthFormData): Promise<IAuthResult>;

  /**
   * Registers a new user by inserting a row into the `users` table.
   * @param data - The form data containing email, password, and displayName
   * @returns A promise resolving to the authentication result with user data
   */
  signUp(data: IAuthFormData): Promise<IAuthResult>;

  /**
   * Initiates OAuth sign-in with a third-party provider via Supabase Auth.
   * Redirects the user to the provider's login page.
   * @param provider - The OAuth provider to sign in with (e.g. 'google', 'github')
   * @param redirectTo - The URL to redirect to after successful auth
   * @returns A promise resolving to the auth result (error only, since it redirects)
   */
  signInWithProvider(provider: AuthProvider, redirectTo: string): Promise<IAuthResult>;

  /**
   * Attempts to refresh the current Supabase session using the stored
   * refresh token. Returns the new session on success.
   * @returns A promise resolving to the auth result with the refreshed session
   */
  refreshSession(): Promise<IAuthResult>;

  /**
   * Retrieves the current active session without contacting the Auth server.
   * Reads session data from local cookies/storage only.
   * @returns A promise resolving to the auth result with the current session
   */
  getSession(): Promise<IAuthResult>;
}

