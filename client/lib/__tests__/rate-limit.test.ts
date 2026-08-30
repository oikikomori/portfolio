import { describe, expect, test } from 'vitest'
import { consumeRateLimit, isRateLimitExemptPath } from '@/lib/rate-limit'

describe('isRateLimitExemptPath', () => {
  test('exempts layout and RPG polling endpoints only', () => {
    expect(isRateLimitExemptPath('/api/cursors')).toBe(true)
    expect(isRateLimitExemptPath('/api/rpg-presence')).toBe(true)
    expect(isRateLimitExemptPath('/api/contact')).toBe(false)
    expect(isRateLimitExemptPath('/api/posts')).toBe(false)
  })
})

describe('consumeRateLimit', () => {
  test('blocks after the configured window budget is exhausted', () => {
    const key = `test-${Date.now()}-${Math.random()}`
    const limit = 3
    const windowMs = 10_000

    expect(consumeRateLimit(key, limit, windowMs).allowed).toBe(true)
    expect(consumeRateLimit(key, limit, windowMs).allowed).toBe(true)
    expect(consumeRateLimit(key, limit, windowMs).allowed).toBe(true)
    const blocked = consumeRateLimit(key, limit, windowMs)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })
})
