import { NextResponse } from 'next/server'

import { createClient } from '@/shared/utils/supabase/server'

/**
 * GET handler for the OAuth callback route.
 * Exchanges the authorization code from the OAuth provider for a Supabase session.
 * Redirects to the home page on success, or to /auth with an error on failure.
 *
 * @param request - The incoming request containing the auth code in search params
 * @returns A redirect response to the appropriate page
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`)
}
