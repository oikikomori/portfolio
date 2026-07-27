'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'
import { dbQuery } from '@/lib/neon-server'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
})

// This form sends a real email and writes to the DB on every submission —
// unlike the AI chat endpoints in this codebase, it had no throttling at
// all, so a script could spam-submit it indefinitely. 5/hour per IP is
// generous for a real visitor but blocks trivial abuse.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000

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

export async function submitContact(formData: FormData) {
  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown'
  const userAgent = headerList.get('user-agent') ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return { error: '요청이 너무 많습니다. 1시간 후에 다시 시도해주세요.' }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return { error: '입력을 확인해주세요.' }
  }

  const { name, email, subject, message } = parsed.data

  // DB 저장 (실패해도 이메일 전송 계속 진행)
  let contactId: string | undefined
  let dbError: string | undefined

  try {
    const insertResult = await dbQuery<{ id: string }>(
      `INSERT INTO contacts (name, email, subject, message, status, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, 'unread', $5, $6)
       RETURNING id`,
      [name, email, subject, message, ip, userAgent],
    )
    contactId = insertResult.rows[0]?.id
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : 'DB 저장 실패'
    console.warn('⚠️ DB 저장 실패 (이메일 전송은 계속 진행):', dbError)
  }

  // 이메일 전송
  let emailSent = false
  const hasEmailConfig =
    process.env.SMTP_USER &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN

  if (hasEmailConfig) {
    try {
      const result = await sendContactEmail({ name, email, subject, message })
      emailSent = !!result.success
    } catch (err: unknown) {
      console.error('이메일 전송 오류:', err)
    }
  }

  if (!contactId && !emailSent) {
    return { error: '메시지를 저장하거나 전송하지 못했습니다. 잠시 후 다시 시도해주세요.' }
  }

  return { success: true, contactId, emailSent }
}
