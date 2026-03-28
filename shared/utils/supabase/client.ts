import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for use in browser environments (Client Components).
 * Uses the standard `@supabase/supabase-js` client for direct database queries
 * against the `users` table (no Supabase Auth).
 *
 * @returns {ReturnType<typeof createSupabaseClient>} The Supabase browser client instance.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}
