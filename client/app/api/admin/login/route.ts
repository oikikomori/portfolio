import { NextRequest, NextResponse } from 'next/server'
import { createAdminSessionToken } from '@/lib/admin-session'

function getAdminPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD?.trim()
  if (configured) return configured
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return null
  }
  return 'admin'
}

// This is the login gate for the entire admin surface (posts, projects,
// ads, contacts) and had no brute-force protection at all — unlimited
// password guesses per IP. 5 attempts / 15 min is generous for a real
// admin (who has a password manager) but blocks trivial brute-forcing.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.' }, { status: 429 })
  }

  const adminPassword = getAdminPassword()
  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 503 })
  }

  const { password } = (await req.json()) as { password: string }
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = await createAdminSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Admin session secret is not configured' }, { status: 503 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
