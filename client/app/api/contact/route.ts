export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 연락처 메시지 전송 API - Supabase에 저장만 수행
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 유효성 검사
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 클라이언트 IP 및 User-Agent
    const headers = request.headers
    const ip_address = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
    const user_agent = headers.get('user-agent') || 'unknown'

    // Supabase에 연락처 메시지 저장
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          status: 'unread',
          ip_address,
          user_agent
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase 저장 오류:', error)
      return NextResponse.json(
        { success: false, message: '메시지 저장 중 오류가 발생했습니다.', error: error.message },
        { status: 500 }
      )
    }

    // 성공 응답 (이메일은 전송하지 않음)
    return NextResponse.json(
      {
        success: true,
        message: '메시지가 성공적으로 저장되었습니다.',
        contactId: data?.id,
        emailSent: false
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('연락처 API 오류:', e)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.', error: e?.message || 'unknown' },
      { status: 500 }
    )
  }
}