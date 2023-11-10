import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {data: { session },} = await supabase.auth.getSession()

    // Check auth condition
    if (session) {
      const redirectUrl = request.nextUrl.clone();

      // Authentication successful, forward request to protected route.
      return response
    }
      // Auth condition not met, redirect to login page.
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)

  } catch (e) {
    // If you are here, a Supabase client could not be created, This is likely because you have not set up environment variables.

    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*','/account', '/ship/:path*']
}