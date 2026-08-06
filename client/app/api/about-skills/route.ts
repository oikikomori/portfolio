export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAboutSkills } from '@/lib/notion'

export async function GET() {
  try {
    const data = await getAboutSkills()
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[/api/about-skills]', msg)
    // About/Skills sections fall back to their own hardcoded content on any
    // non-2xx or empty response, so an unconfigured/unreachable Notion DB
    // degrades gracefully instead of breaking the page.
    return NextResponse.json({ interests: [], tools: [], skills: [] })
  }
}
