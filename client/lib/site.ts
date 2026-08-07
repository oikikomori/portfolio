/** Canonical site URL — production default kuuuma.com */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return 'https://kuuuma.com'
}

/**
 * Server/runtime gate for /portfolio. Temporarily blocked for everyone at the
 * site owner's request (personal-info exposure concern) — set
 * PORTFOLIO_DISABLED=false to re-open it once resolved.
 */
export function isPortfolioPublic(): boolean {
  if (process.env.PORTFOLIO_DISABLED === 'false') return true
  return false
}

/**
 * Client nav visibility — NEXT_PUBLIC_* inlined at build time.
 * Hide nav with NEXT_PUBLIC_PORTFOLIO_DISABLED=true (or legacy NEXT_PUBLIC_PORTFOLIO_ENABLED=false).
 */
export const PORTFOLIO_PUBLIC = false

export const SITE_NAME = 'kuuuma'
export const SITE_AUTHOR = 'okuma'
export const SITE_GITHUB = 'https://github.com/oikikomori'
export const SITE_EMAIL = 'c8c8c81828@gmail.com'
export const OG_IMAGE_PATH = '/images/placeholder.svg'
