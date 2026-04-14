import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { createClient } from '@/shared/utils/supabase/server'

/**
 * Resolves the public-facing origin from the request.
 * In production behind a reverse proxy (e.g. Vercel), `request.url`
 * may report `localhost:3000`. We use the `x-forwarded-host` /
 * `host` headers plus `x-forwarded-proto` to reconstruct the real origin.
 *
 * Falls back to NEXT_PUBLIC_SITE_URL env var, then to request.url origin.
 *
 * @param request - The incoming request
 * @returns The public-facing origin (e.g. https://myapp.vercel.app)
 */
async function getOrigin(request: Request): Promise<string> {
  /** Prefer explicit env var if set */
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || 'https'

  if (host) {
    return `${proto}://${host}`
  }

  /** Last resort: use the URL from the request itself */
  return new URL(request.url).origin
}

/**
 * GET handler for the OAuth callback route.
 * Exchanges the authorization code from the OAuth provider for a Supabase session.
 * Redirects to the home page on success, or to /auth with an error on failure.
 *
 * @param request - The incoming request containing the auth code in search params
 * @returns A redirect response to the appropriate page
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const origin = await getOrigin(request)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`)
}
