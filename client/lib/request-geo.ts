/**
 * Client IP / country extraction for `proxy.ts`.
 *
 * `NextRequest` no longer exposes `.ip` / `.geo` (removed upstream) — Vercel's
 * documented replacement is reading the `x-vercel-ip-country` header (and
 * `x-forwarded-for` for the IP) directly, which also happens to work
 * identically in local dev (both are simply absent → sensible fallbacks).
 */

const IP_VALUE_PATTERN = /^[a-zA-Z0-9:.%-]{1,128}$/

export function getClientIp(headers: Headers): string {
  const candidates = [
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
  ]

  for (const candidate of candidates) {
    if (candidate && IP_VALUE_PATTERN.test(candidate)) return candidate
  }
  return 'unknown'
}

/** ISO 3166-1 alpha-2 country code (e.g. `KR`, `CN`), or `null` if unknown. */
export function getClientCountry(headers: Headers): string | null {
  const country = headers.get('x-vercel-ip-country')?.trim().toUpperCase()
  if (country && /^[A-Z]{2}$/.test(country)) return country
  return null
}
