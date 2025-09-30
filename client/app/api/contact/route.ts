import { NextResponse } from 'next/server';

// 연락처 메시지 전송 API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 간단한 유효성 검사
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: '유효한 이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 임시로 이메일 전송 비활성화 (DNS 문제 해결 전까지)
    console.log('연락처 메시지 수신:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message
    });

    // 성공 응답 (실제로는 데이터베이스에 저장하거나 이메일 전송)
    return NextResponse.json({
      message: '메시지가 성공적으로 전송되었습니다.',
      contact: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        timestamp: new Date().toISOString()
      },
      emailSent: false,
      emailError: '이메일 전송이 임시로 비활성화되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('연락처 API 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}