export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { runSync } from '@/lib/lotto/sync'

// 매주 자동 실행 — 최신 회차만 채우면 되므로 소량(10)이면 충분.
export async function GET(request: NextRequest) {
  // This used to fail *open* — `cronSecret && ...` skipped the check
  // entirely when CRON_SECRET wasn't set, unlike every other cron route in
  // this codebase (aetheria-tick, generate-posts), which fail closed
  // (503) if the secret is missing in a deployed environment.
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (!cronSecret && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
    console.error('CRON_SECRET is required for /api/cron/lotto-sync in deployed environments.')
    return NextResponse.json({ error: 'Cron endpoint is not configured' }, { status: 503 })
  }

  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (providedSecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const result = await runSync(10)
    revalidateTag('lotto-stats', 'max')
    return NextResponse.json(result)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[/api/cron/lotto-sync]', msg)
    return NextResponse.json({ ok: false, message: msg }, { status: 500 })
  }
}
