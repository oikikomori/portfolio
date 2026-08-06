export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getRecipes } from '@/lib/notion'

export async function GET() {
  try {
    const recipes = await getRecipes()
    return NextResponse.json({ recipes })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[/api/recipes]', msg)
    // Recipes page falls back to its own hardcoded RECIPES list on any
    // non-2xx or empty response, so an unconfigured/unreachable Notion DB
    // degrades gracefully instead of breaking the page.
    return NextResponse.json({ recipes: [] })
  }
}
