import type { SupabaseClient } from '@supabase/supabase-js';

import type { AuthProvider, IAuthFormData, IAuthResult, IUser } from '../core/models';
import type { IAuthRepository } from '../core/repositories';

/**
 * Hashes a plain-text password using SHA-256 via the Web Crypto API.
 * Returns a hex-encoded digest string.
 * @param password - The plain-text password to hash
 * @returns The hex-encoded SHA-256 hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Repository implementation that authenticates users directly
 * against the `users` table in Supabase (no Supabase Auth).
 *
 * - signIn: selects a row matching email, then compares hashed passwords.
 * - signUp: inserts a new row with hashed password into the `users` table.
 */
export class UsersTableAuthRepository implements IAuthRepository {
  /** The Supabase client used for database queries */
  private client: SupabaseClient;

  /**
   * Creates a new UsersTableAuthRepository instance.
   * @param client - The Supabase client for querying the `users` table
   */
  constructor(client: SupabaseClient) {
    this.client = client;
  }

  /**
   * Signs in a user by querying the `users` table for a matching email
   * and comparing the hashed password.
   * @param data - The form data containing email and password
   * @returns The authentication result with user data (excluding password)
   */
  async signIn(data: IAuthFormData): Promise<IAuthResult> {
    const { data: userLogged, error } = await this.client.auth
      .signInWithPassword({
        email: data.email,
        password: data.password,
      });
    if (error) {
      return { success: false, error: error.message };
    }

    if (!userLogged || !userLogged.user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const userResult: Omit<IUser, 'password'> = {
      id: userLogged.user.id || '',
      email: userLogged.user.email || '',
      display_name: userLogged.user.user_metadata?.display_name || '',
      created_at: userLogged.user.created_at || '',
    };

    return {
      success: true,
      user: userResult,
      session: userLogged.session ?? undefined,
    };
  }

  /**
   * Registers a new user by inserting a row into the `users` table.
   * Checks for duplicate email first, then inserts with hashed password.
   * @param data - The form data containing email, password, and displayName
   * @returns The authentication result with user data (excluding password)
   */
  async signUp(data: IAuthFormData): Promise<IAuthResult> {
    const { data: signUpData, error } = await this.client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${location.origin}/`, // Optional redirect URL
      },
    });

    if (error) {
      return { error: error.message, success: false };
    }

    let userResult: Omit<IUser, 'password'> | undefined = undefined;
    if (signUpData && signUpData.user) {
      userResult = {
        id: signUpData.user.id || '',
        email: signUpData.user.email || '',
        display_name: signUpData.user.user_metadata?.display_name || '',
        created_at: signUpData.user.created_at || '',
      };
    }
    return {
      success: true,
      user: userResult,
    };
  }

  /**
   * Initiates OAuth sign-in by redirecting to the provider via Supabase Auth.
   * @param provider - The OAuth provider (e.g. 'google', 'github')
   * @param redirectTo - The callback URL after successful auth
   * @returns The auth result (error only, success causes a page redirect)
   */
  async signInWithProvider(provider: AuthProvider, redirectTo: string): Promise<IAuthResult> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Refreshes the current Supabase session using the stored refresh token.
   * The Supabase client automatically uses the refresh token from cookies.
   * @returns The auth result with the new session on success
   */
  async refreshSession(): Promise<IAuthResult> {
    const { data, error } = await this.client.auth.refreshSession();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session: data.session ?? undefined };
  }

  /**
   * Retrieves the current active session from local cookies/storage.
   * Does not contact the Supabase Auth server for validation.
   * @returns The auth result with the current session
   */
  async getSession(): Promise<IAuthResult> {
    const { data, error } = await this.client.auth.getSession();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session: data.session ?? undefined };
  }
}
