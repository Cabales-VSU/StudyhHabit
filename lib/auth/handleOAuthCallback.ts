import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function handleOAuthCallback(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // This grabs the "/dashboard" we sent from the Google Button
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )
    
    // Exchange the code for a real session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // SUCCESS: Route to /dashboard
      return { type: 'redirect', url: new URL(next, request.url).toString() }
    }
  }

  // FAIL: Route back to login
  return { type: 'fallback', fallback: new URL('/login', request.url).toString() }
}