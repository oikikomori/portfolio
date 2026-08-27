/**
 * In-memory rate limiting for `proxy.ts` (Next.js middleware equivalent).
 *
 * Vercel's Edge/serverless runtime may reuse a "warm" isolate across
 * consecutive requests for a short while, but there is NO guarantee of a
 * single shared instance across all requests/regions — this is a best-effort
 * limiter, not a distributed one. That's an accepted trade-off: the project
 * has no Redis/Upstash infra today, and adding one is out of scope for a
 * personal-portfolio free-tier deployment. State is kept on `globalThis` so
 * it survives module re-evaluation within the same warm instance/dev reload.
 */

interface FixedWindowEntry {
  count: number
  resetAt: number
}

interface RateLimitGlobals {
  __rlBuckets?: Map<string, FixedWindowEntry>
  __rlBannedIps?: Map<string, number>
  __rlLastSweep?: number
}

const g = globalThis as unknown as RateLimitGlobals

// Safety valve so a huge burst of unique IPs (e.g. a botnet) can't grow the
// in-memory map without bound on a long-lived warm instance.
const MAX_TRACKED_KEYS = 8000
const SWEEP_INTERVAL_MS = 30_000

function getBuckets(): Map<string, FixedWindowEntry> {
  if (!g.__rlBuckets) g.__rlBuckets = new Map()
  return g.__rlBuckets
}

function getBannedIps(): Map<string, number> {
  if (!g.__rlBannedIps) g.__rlBannedIps = new Map()
  return g.__rlBannedIps
}

function sweepExpired(now: number): void {
  if (g.__rlLastSweep && now - g.__rlLastSweep < SWEEP_INTERVAL_MS) return
  g.__rlLastSweep = now

  const buckets = getBuckets()
  for (const [key, entry] of buckets) {
    if (now >= entry.resetAt) buckets.delete(key)
  }
  if (buckets.size > MAX_TRACKED_KEYS) {
    // Crude but effective for a free-tier personal site: drop everything and
    // let legitimate clients re-establish their window on the next request.
    buckets.clear()
  }

  const banned = getBannedIps()
  for (const [ip, expiresAt] of banned) {
    if (now >= expiresAt) banned.delete(ip)
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  retryAfterSeconds: number
}

/**
 * Fixed-window counter. Not as smooth as a sliding window/token bucket, but
 * simple, cheap, and good enough for "obviously excessive" traffic detection.
 */
export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  sweepExpired(now)

  const buckets = getBuckets()
  const entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, limit, retryAfterSeconds: 0 }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    }
  }

  entry.count += 1
  return { allowed: true, remaining: limit - entry.count, limit, retryAfterSeconds: 0 }
}

/**
 * Temporary IP ban store — used as defense-in-depth after a single request
 * that scans for a sensitive path (`/wp-admin`, `/.env`, ...). One hit is
 * already a strong enough signal that we don't need to wait for a rate
 * threshold before blocking the rest of that IP's scan attempts.
 */
export function banIpTemporarily(ip: string, durationMs: number): void {
  if (!ip || ip === 'unknown') return
  getBannedIps().set(ip, Date.now() + durationMs)
}

export function isIpTemporarilyBanned(ip: string): boolean {
  if (!ip || ip === 'unknown') return false
  const banned = getBannedIps()
  const expiresAt = banned.get(ip)
  if (!expiresAt) return false
  if (Date.now() >= expiresAt) {
    banned.delete(ip)
    return false
  }
  return true
}
