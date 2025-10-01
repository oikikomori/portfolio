import { NextResponse } from 'next/server';

// 이메일 전송 테스트 API
export async function POST() {
  try {
    // 간단한 테스트 이메일 데이터
    const testEmailData = {
      name: '테스트 사용자',
      email: 'test@example.com',
      subject: '이메일 전송 테스트',
      message: '이것은 이메일 전송 테스트입니다.'
    };

    // 서버의 이메일 전송 함수 호출
    const { sendContactEmail } = require('../../../../server/utils/email');
    
    console.log('테스트 이메일 전송 시작...');
    const result = await sendContactEmail(testEmailData);
    console.log('테스트 이메일 전송 결과:', result);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error || null
    });

  } catch (error) {
    console.error('이메일 전송 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      message: '이메일 전송 테스트에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
