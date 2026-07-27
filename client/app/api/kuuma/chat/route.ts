export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { recordAiRequest } from '@/lib/aiStats'

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'

// Kept in sync with the AI Interviewer's system prompt
// (app/api/ai-interviewer/route.ts) — same fix applied earlier to
// /api/chatbot: this used to be a thin blurb that didn't know about the
// current job, prior career, or any real project details.
const SYSTEM_PROMPT = `당신은 '쿠마'입니다. 프론트엔드 개발자 okuma(오승일)의 포트폴리오 사이트에 있는 AI 동반자예요.
마우스 커서를 따라다니며 방문자와 대화합니다.

개발자 정보: 프론트엔드 개발자 겸 웹퍼블리셔, 1990년생, 개발경력 7년+.
경력:
- 퀀텀에이아이(Quantum AI), 2025.12 ~ 현재, 프론트엔드 개발
- (주)소프트위즈, 2020.05 ~ 2025.12, 웹팀/대리 — Next.js 브랜드 사이트, Svelte+Web Components CRM, PixiJS 트레이딩 UI, MySQL 사내 시스템
- 스마일데이, 2018.12 ~ 2020.02, 웹개발팀/사원 — 에이전시 외주 퍼블리싱, jQuery 인터랙션
기술: 프론트엔드(HTML5/CSS3, JavaScript, TypeScript, React, Next.js, Svelte, PixiJS)가 주력. Go/Java/Node.js로 백엔드도 가능. 퍼블리싱(HTML/CSS 반응형)도 능숙. MySQL, Figma.
프로젝트: BABA OPTION(Next.js 브랜드 사이트), CRM(Svelte+Web Components), 이지트로스 WTS(PixiJS), mytradinginfo(React), mysoftwiz(EJS), 랄라(React 유아 AI 앱), kmuseum(박물관 예약).
이 사이트에서: 직접 만든 게임(테트리스, 서바이브, 타워 디펜스, RPG, 포켓 아케이드), Notion으로 맛집 리스트 관리하는 /food, 기술 블로그(/posts).
연락: 사이트 내 Contact 폼.

성격: 친근하고 유머 있게, 짧고 명확하게 답변. 한국어로 대화. 여기 없는 내용은 지어내지 말고 Contact 페이지 안내.`

const rateMap = new Map<string, { count: number; reset: number }>()

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 3_600_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRate(ip)) {
    return NextResponse.json({ reply: '잠깐, 너무 많이 물어보셨어요! 1시간 후에 다시 해주세요 😅' }, { status: 429 })
  }

  try {
    const { message, history = [] } = await req.json() as {
      message: string
      history?: { role: 'user' | 'assistant'; content: string }[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ reply: '메시지를 입력해주세요!' })
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json({ reply: 'AI 기능이 설정되지 않았어요. Contact 페이지로 연락해주세요!' })
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: message.trim().slice(0, 1000) },
    ]

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 400,
      }),
    })

    if (!res.ok) {
      console.error('[kuuma/chat] Gemini error', res.status, await res.text())
      return NextResponse.json({ reply: '잠깐 문제가 생겼어요. 잠시 후 다시 시도해주세요!' })
    }

    const data = await res.json() as { choices?: { message?: { content?: string } }[] }
    const reply = data.choices?.[0]?.message?.content?.trim() || '응답을 받지 못했어요.'
    recordAiRequest()
    return NextResponse.json({ reply })
  } catch (e) {
    console.error('[kuuma/chat]', e)
    return NextResponse.json({ reply: '잠깐 문제가 생겼어요. 잠시 후 다시 시도해주세요!' })
  }
}
