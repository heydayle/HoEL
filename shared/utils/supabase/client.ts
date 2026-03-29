import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser environments (Client Components).
 * Uses `createBrowserClient` from `@supabase/ssr` to properly manage
 * cookie-based auth sessions in Next.js.
 *
 * @returns {ReturnType<typeof createBrowserClient>} The Supabase browser client instance.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  )
}
