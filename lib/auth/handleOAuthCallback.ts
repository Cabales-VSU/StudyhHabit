import { createClient } from '@/lib/supabase/server'

type OAuthCallbackResult =
| {
    type: 'redirect'
    url: string
}
| {
    type: 'error'
    fallback: string
  }


export async function handleOAuthCallback(
  request: Request
): Promise<OAuthCallbackResult> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const origin = url.origin

  if (error) {
    console.error('OAuth error in callback:', {
      error,
      error_code: url.searchParams.get('error_code'),
      error_description: url.searchParams.get('error_description')
    })
    return { type: 'error', fallback: `${origin}/error` }
  }

  if (!code) {
    console.error('No code provided in OAuth callback')
    return { type: 'error', fallback: `${origin}/error` }
  }

  const supabase = await createClient()
  
  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('OAuth exchange failed:', exchangeError)
      return { type: 'error', fallback: `${origin}/error` }
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Failed to get user after exchange:', userError)
      return { type: 'error', fallback: `${origin}/error` }
    }

    // Just check if profile exists (no role logic anymore)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile fetch failed:', profileError)
      return { type: 'error', fallback: `${origin}/error` }
    }

    const hasProfile = !!profile

    return {
      type: 'redirect',
      url: hasProfile
        ? `${origin}/dashboard`
        : `${origin}/sign-up`,
    }

  } catch (err) {
    console.error('Unexpected error in OAuth callback:', err)
    return { type: 'error', fallback: `${origin}/error` }
  }
}