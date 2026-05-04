import { NextResponse } from 'next/server'
import { handleOAuthCallback } from '@/lib/auth/handleOAuthCallback'

export async function GET(request: Request) {
  const result = await handleOAuthCallback(request)

  if (result.type === 'redirect') {
    return NextResponse.redirect(result.url)
  }

  return NextResponse.redirect(result.fallback)
}
