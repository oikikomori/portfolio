import { NextResponse } from 'next/server';

// 이메일 설정 테스트 API
export async function GET() {
  try {
    // 환경변수 확인
    const config = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
      smtpUser: process.env.SMTP_USER
    };

    const allConfigured = config.hasClientId && config.hasClientSecret && config.hasRefreshToken && config.smtpUser;

    if (allConfigured) {
      return NextResponse.json({
        success: true,
        message: '이메일 설정이 올바르게 구성되었습니다.',
        config
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '이메일 설정이 완전하지 않습니다.',
        config
      }, { status: 500 });
    }

  } catch (error) {
    console.error('이메일 설정 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      message: '이메일 설정 테스트에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
