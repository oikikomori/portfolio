export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/neon-server'

const MAX_POSTS_PER_SESSION_PER_DAY = 10

export type TypingScoreRow = {
  id: string
  player_name: string
  wpm: number
  accuracy: number
  created_at: string
}

// This used to be one regex, `[ -<>&"']`, which reads as a *range* from
// space (0x20) through '<' (0x3C) in a character class — silently
// stripping every digit and most punctuation (0-9, !, #, etc.) out of
// player names. Strip control chars and the special-char set as two
// separate, unambiguous passes instead, matching the sibling game score
// routes' sanitizePlayerName style.
function sanitize(raw: unknown): string {
  if (typeof raw !== 'string') return 'Anonymous'
  const s = raw.trim()
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>&"']/g, '')
  return s.length >= 1 && s.length <= 50 ? s : 'Anonymous'
}

async function ensureTable() {
  await dbQuery(`CREATE TABLE IF NOT EXISTS typing_scores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50),
    wpm INTEGER,
    accuracy INTEGER,
    session_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`)
  await dbQuery(`ALTER TABLE typing_scores ADD COLUMN IF NOT EXISTS session_id VARCHAR(64)`)
}

export async function GET() {
  await ensureTable()
  const result = await dbQuery<TypingScoreRow>(
    `SELECT id, player_name, wpm, accuracy, created_at FROM typing_scores ORDER BY wpm DESC LIMIT 10`
  )
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const player_name = sanitize(body.player_name)
  const wpm = Math.max(0, Math.min(300, parseInt(body.wpm, 10) || 0))
  const accuracy = Math.max(0, Math.min(100, parseInt(body.accuracy, 10) || 0))

  await ensureTable()

  // Same per-session daily cap used by the tetris/survive/tower-defense/
  // arcade score routes — this one had no throttling at all before, so
  // the leaderboard could be flooded with unlimited fake scores.
  let sessionId: string | null = null
  const rawSessionId = body.sessionId
  if (typeof rawSessionId === 'string' && rawSessionId.trim()) {
    const sid = rawSessionId.trim().slice(0, 64)
    if (/^[a-zA-Z0-9_-]+$/.test(sid)) sessionId = sid
  }

  if (sessionId) {
    const countRes = await dbQuery<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM typing_scores
       WHERE session_id = $1
         AND created_at >= (timezone('utc', now())::date)`,
      [sessionId],
    )
    const count = Number(countRes.rows[0]?.count ?? 0)
    if (count >= MAX_POSTS_PER_SESSION_PER_DAY) {
      return NextResponse.json({ message: '오늘 제출 한도에 도달했습니다.' }, { status: 429 })
    }
  }

  await dbQuery(
    `INSERT INTO typing_scores (player_name, wpm, accuracy, session_id) VALUES ($1, $2, $3, $4)`,
    [player_name, wpm, accuracy, sessionId]
  )
  return NextResponse.json({ ok: true })
}
