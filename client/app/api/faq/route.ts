export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getFaqs } from '@/lib/notion'

export async function GET() {
  try {
    const faqs = await getFaqs()
    return NextResponse.json({ faqs })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[/api/faq]', msg)
    // The FAQ section falls back to its own hardcoded list on any non-2xx
    // or empty response, so an unconfigured/unreachable Notion DB degrades
    // gracefully instead of breaking the page.
    return NextResponse.json({ faqs: [] })
  }
}
