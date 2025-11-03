export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 먼저 conversation의 UUID(id)를 가져와야 함
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('session_id', sessionId)
      .single()

    if (!conversation) {
      return NextResponse.json({
        success: true,
        sessionId: sessionId,
        messages: [],
        count: 0
      })
    }

    // 대화 히스토리 조회 (conversation_id는 UUID)
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)  // UUID 사용
      .order('timestamp', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('대화 히스토리 조회 오류:', error)
      return NextResponse.json(
        {
          success: false,
          error: '대화 히스토리 조회 중 오류가 발생했습니다.',
          details: error.message
        },
        { status: 500 }
      )
    }

    // 메시지를 ChatMessage 형식으로 변환
    const formattedMessages = (messages || []).map((msg: any) => ({
      id: msg.message_id?.toString() || msg.id?.toString() || Date.now().toString(),
      content: msg.content || '',
      isUser: msg.is_user === true,
      timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
      aiFeatures: msg.ai_features || msg.meta || {}
    }))

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      messages: formattedMessages,
      count: formattedMessages.length
    })

  } catch (error: any) {
    console.error('대화 히스토리 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '대화 히스토리 조회 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

