import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard/timer'

    if (!code) {
      return NextResponse.redirect(`${origin}/login?error=missing_auth_code`)
    }

    // 1. Guard against missing environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return NextResponse.redirect(`${origin}/login?error=missing_env_variables`)
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (err) {
              // Safe block for server components
            }
          },
        },
      }
    )

    // 2. Exchange authorization code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // SUCCESS: Route to the dashboard timer
    return NextResponse.redirect(`${origin}${next}`)

  } catch (globalError: any) {
    // 3. CATCH-ALL: Send the exact crash error message to the URL bar
    const errorString = globalError?.message || "unknown_server_error"
    console.error("💥 Auth Callback Crash Trace:", globalError)
    
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorString)}`)
  }
}