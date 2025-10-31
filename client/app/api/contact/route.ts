export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendContactEmail } from '@/lib/email'

// 서버 사이드에서 Supabase 클라이언트 생성
// Service Role Key가 있으면 우선 사용 (RLS 우회), 없으면 Anon Key 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Service Role Key가 있으면 사용 (RLS 우회), 없으면 Anon Key 사용
const supabaseKey = supabaseServiceKey || supabaseAnonKey

const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 연락처 메시지 전송 API - Supabase에 저장만 수행
export async function POST(request: Request) {
  try {
    // 디버깅: 환경 변수 확인
    console.log('=== API Route 환경 변수 확인 ===');
    console.log('URL 존재:', !!supabaseUrl);
    console.log('Service Role Key 존재:', !!supabaseServiceKey);
    console.log('Anon Key 존재:', !!supabaseAnonKey);
    console.log('사용 중인 Key:', supabaseServiceKey ? 'Service Role Key (RLS 우회)' : 'Anon Key');
    if (supabaseUrl) console.log('URL (처음 30자):', supabaseUrl.substring(0, 30));
    console.log('================================');
    
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

    // 이메일 전송 시도 (선택 사항)
    let emailSent = false
    let emailError: string | undefined = undefined

    // 이메일 전송 환경 변수 확인
    const hasEmailConfig = 
      process.env.SMTP_USER &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN

    if (hasEmailConfig) {
      try {
        console.log('이메일 전송 시작...')
        const emailResult = await sendContactEmail({
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message
        })
        
        if (emailResult.success) {
          emailSent = true
          console.log('✅ 이메일 전송 성공')
        } else {
          emailError = emailResult.error || emailResult.message
          console.error('❌ 이메일 전송 실패:', emailError)
        }
      } catch (emailErr: any) {
        console.error('이메일 전송 오류:', emailErr)
        emailError = emailErr.message || '이메일 전송에 실패했습니다.'
      }
    } else {
      emailError = '이메일 전송 환경 변수가 설정되지 않았습니다. (SMTP_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)'
    }

    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: '메시지가 성공적으로 저장되었습니다.',
        contactId: data?.id,
        emailSent,
        emailError: emailError || undefined
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