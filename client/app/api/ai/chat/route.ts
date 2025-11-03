export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

// 간단한 AI 응답 생성 (ChatbotAI 대체)
async function generateAIResponse(message: string, tone: string = '친근하게'): Promise<{
  success: boolean
  response: string
  emotion: string
  intent: string
  confidence: number
}> {
  // 기본 응답 생성
  const greetings = ['안녕하세요', '안녕', '반가워요', '좋은 하루네요']
  const questions = ['어떻게 도와드릴까요?', '무엇을 도와드릴까요?', '도움이 필요하신가요?']
  const toneMap: Record<string, string> = {
    '친근하게': '안녕하세요!',
    '전문적으로': '안녕하십니까.',
    '격식있게': '안녕하십니까.',
    '캐주얼하게': '안녕!'
  }

  const tonePrefix = toneMap[tone] || '안녕하세요!'
  
  // 간단한 키워드 기반 응답
  const lowerMessage = message.toLowerCase()
  let response = tonePrefix + ' '

  if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
    response += '반가워요! 무엇을 도와드릴까요?'
  } else if (lowerMessage.includes('포트폴리오') || lowerMessage.includes('프로젝트')) {
    response += '포트폴리오에 관심을 가져주셔서 감사합니다. 어떤 프로젝트에 대해 알고 싶으신가요?'
  } else if (lowerMessage.includes('연락') || lowerMessage.includes('contact')) {
    response += '연락은 Contact 페이지를 통해 보내주시면 됩니다. 빠르게 답변드리겠습니다!'
  } else {
    response += '좋은 질문이네요! 더 자세히 알려주시면 도와드리겠습니다.'
  }

  return {
    success: true,
    response,
    emotion: 'neutral',
    intent: 'general',
    confidence: 0.7
  }
}

// 대화 세션 가져오기 또는 생성
async function getOrCreateConversation(sessionId: string, userId: string) {
  // 먼저 session_id로 기존 대화 찾기
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('session_id', sessionId)
    .single()

  if (existing) {
    return existing
  }

  // 없으면 새로 생성 (id는 자동 생성, session_id는 제공한 값 사용)
  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert([{
      session_id: sessionId,  // session_id 컬럼 사용
      user_id: userId,
      settings: {
        selectedTone: '친근하게',
        language: 'ko',
        isActive: true
      },
      statistics: {
        totalMessages: 0,
        userMessages: 0,
        aiMessages: 0,
        averageResponseTime: 0,
        mostUsedTone: '친근하게',
        lastActivity: new Date().toISOString()
      }
    }])
    .select()
    .single()

  if (error && error.code !== '23505') { // 23505 = unique_violation (이미 존재)
    console.error('대화 생성 오류:', error)
    throw error
  }

  return newConv || existing
}

// 메시지 추가
async function addMessage(sessionId: string, message: any) {
  // 먼저 conversation의 UUID(id)를 가져와야 함
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('session_id', sessionId)
    .single()

  if (!conversation) {
    console.error('대화를 찾을 수 없습니다:', sessionId)
    return
  }

  const { error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversation.id,  // UUID 사용
      message_id: message.id || Date.now().toString(),
      content: message.content,
      is_user: message.isUser,
      ai_features: message.aiFeatures || {},
      metadata: { responseTime: message.responseTime || 0 },
      response_time: message.responseTime || 0,
      timestamp: new Date().toISOString()
    }])

  if (error) {
    console.error('메시지 저장 오류:', error)
    // 메시지 저장 실패해도 계속 진행
  }
}

export async function POST(request: Request) {
  try {
    const { message, tone = '친근하게', sessionId, userId = 'anonymous' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId가 필요합니다.' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // 1. 대화 세션 가져오기 또는 생성
    try {
      await getOrCreateConversation(sessionId, userId)
    } catch (error: any) {
      console.error('대화 세션 처리 오류:', error)
      // 세션 생성 실패해도 계속 진행
    }

    // 2. 사용자 메시지 저장
    try {
      await addMessage(sessionId, {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date(),
        responseTime: 0
      })
    } catch (error: any) {
      console.error('사용자 메시지 저장 오류:', error)
      // 메시지 저장 실패해도 계속 진행
    }

    // 3. AI 응답 생성
    const aiResponse = await generateAIResponse(message, tone)
    const responseTime = Date.now() - startTime

    // 4. AI 응답 저장
    try {
      await addMessage(sessionId, {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
        aiFeatures: {
          tone: tone,
          emotion: aiResponse.emotion,
          intent: aiResponse.intent,
          confidence: aiResponse.confidence
        },
        responseTime: responseTime
      })
    } catch (error: any) {
      console.error('AI 메시지 저장 오류:', error)
      // 메시지 저장 실패해도 계속 진행
    }

    return NextResponse.json({
      success: aiResponse.success,
      response: aiResponse.response,
      emotion: aiResponse.emotion,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      responseTime: responseTime,
      sessionId: sessionId
    })

  } catch (error: any) {
    console.error('AI 채팅 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'AI 응답 생성 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

