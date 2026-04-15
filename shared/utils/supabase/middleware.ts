
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Checks if a user is logged in by verifying the session user and access token.
 * @param {NextRequest} request The incoming Next.js request.
 * @returns {Promise<{ isLoggedIn: boolean; user: any; accessToken: string | null }>} Login status, user, and access token
 */
export async function checkUserLoggedIn(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  // Validate the token server-side — only getUser() contacts the Auth server.
  // getSession() is intentionally NOT used here as it only reads from cookies
  // without verifying the token's validity.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login page if not authenticated
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }

  // If logged in, allow request to continue
  return NextResponse.next();
}

/**
 * Middleware function to refresh Supabase Auth sessions for OAuth providers.
 * Required to keep OAuth sessions valid across server-side navigations.
 *
 * @param {NextRequest} request The incoming Next.js request.
 * @returns {Promise<NextResponse>} The Next.js response with updated cookies.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes the OAuth session if one exists; no-op otherwise
  await supabase.auth.getUser()

  return supabaseResponse
}
