// proxy.ts (Root folder — Next.js 16 middleware replacement)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 proxy function that refreshes the Supabase Auth session
 * on every matched request. Without this, server-side calls to
 * `supabase.auth.getUser()` return null because auth cookies expire
 * and are never refreshed.
 *
 * Also protects `/lessons` routes by redirecting unauthenticated users.
 *
 * @param request - The incoming Next.js request
 * @returns The response with refreshed auth cookies
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Update the request cookies so downstream Server Components see them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // 2. Re-create the response so it carries the updated request cookies
          supabaseResponse = NextResponse.next({ request })
          // 3. Set the cookies on the outgoing response so the browser stores them
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() triggers the session refresh.
  // Do NOT replace this with getSession() — only getUser() contacts the
  // Supabase Auth server and guarantees the token is valid.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes — redirect unauthenticated users away from /lessons
  if (!user && request.nextUrl.pathname.startsWith('/lessons')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from /auth
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

/**
 * Matcher configuration for the proxy.
 * Runs on all routes except static files, images, and favicon.
 */
export const config = {
  matcher: [
    '/auth',
    '/lessons/s',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
