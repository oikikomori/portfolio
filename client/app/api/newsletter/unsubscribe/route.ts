export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/neon-server'
import { escapeHtml } from '@/lib/escapeHtml'

// Every newsletter email links here (see lib/newsletter-email.ts), but this
// route never existed — every "구독 취소" click 404'd, so no subscriber
// could actually unsubscribe.
function htmlPage(title: string, body: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;color:#e5e5e5;">
  <div style="max-width:480px;margin:0 auto;padding:80px 20px;text-align:center;">
    <h1 style="font-size:20px;margin:0 0 12px;">${title}</h1>
    <p style="color:#a3a3a3;font-size:14px;line-height:1.7;">${body}</p>
  </div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim()
  if (!token) {
    return htmlPage('잘못된 요청입니다', '구독 취소 링크가 올바르지 않습니다.')
  }

  try {
    const result = await dbQuery<{ email: string }>(
      `UPDATE email_subscribers SET active = FALSE WHERE unsubscribe_token = $1 AND active = TRUE RETURNING email`,
      [token],
    )

    if (!result.rows[0]) {
      return htmlPage('처리할 수 없습니다', '유효하지 않거나 이미 처리된 구독 취소 링크입니다.')
    }

    return htmlPage(
      '구독이 취소되었습니다',
      `${escapeHtml(result.rows[0].email)} 주소로 더 이상 뉴스레터가 발송되지 않습니다.`,
    )
  } catch (error) {
    console.error('[/api/newsletter/unsubscribe]', error)
    return htmlPage('오류가 발생했습니다', '잠시 후 다시 시도해주세요.')
  }
}
