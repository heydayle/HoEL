import type { Session } from '@supabase/supabase-js';

/**
 * Interface representing a row in the Supabase `users` table.
 */
export interface IUser {
  /** Unique identifier (UUID) */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  display_name: string;
  /** Hashed password stored in the database */
  password: string;
  /** ISO timestamp when the row was created */
  created_at: string;
}

/**
 * Enum representing the available authentication modes.
 */
export enum AuthMode {
  /** Sign in with existing credentials */
  SIGN_IN = 'sign_in',
  /** Register a new account */
  REGISTER = 'register',
}

/**
 * Supported OAuth provider identifiers for Supabase Auth.
 */
export type AuthProvider = 'google' | 'github';

/**
 * Interface for the authentication form data submitted by the user.
 */
export interface IAuthFormData {
  /** User's email address */
  email: string;
  /** User's plain-text password */
  password: string;
  /** User's display name (only required for registration) */
  displayName?: string;
}

/**
 * Interface for the result of an authentication action.
 */
export interface IAuthResult {
  /** Whether the action was successful */
  success: boolean;
  /** The authenticated user data (returned on success) */
  user?: Omit<IUser, 'password'>;
  /** Error message if the action failed */
  error?: string;
  /** The session data returned by Supabase Auth (optional) */
  session?: Session;
  /** Indicates if the password is considered weak (optional) */
  weakPassword?: boolean;
}
