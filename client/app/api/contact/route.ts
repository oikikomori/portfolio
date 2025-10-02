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

    console.log('연락처 메시지 수신:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message
    });

    // 이메일 전송 시도
    let emailResult = { success: false, message: '이메일 전송 실패' };
    
    try {
      console.log('이메일 전송 시작...');
      
      // Nodemailer와 Google OAuth2 설정
      const nodemailer = require('nodemailer');
      const { google } = require('googleapis');
      
      console.log('OAuth2 클라이언트 생성 중...');
      // OAuth2 클라이언트 생성
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://kuuuma.com/auth/callback'
      );
      
      console.log('리프레시 토큰 설정 중...');
      // 리프레시 토큰 설정
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      
      console.log('액세스 토큰 요청 중...');
      // 액세스 토큰 가져오기
      const { token: accessToken } = await oauth2Client.getAccessToken();
      console.log('액세스 토큰 획득 성공:', accessToken ? '토큰 존재' : '토큰 없음');
      
      // Gmail OAuth2 설정
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.SMTP_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken
        }
      });

      // 관리자에게 보낼 메일
      const adminMailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `[포트폴리오] 새로운 연락 메시지: ${body.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              새로운 연락 메시지
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">발신자 정보</h3>
              <p><strong>이름:</strong> ${body.name}</p>
              <p><strong>이메일:</strong> ${body.email}</p>
              <p><strong>제목:</strong> ${body.subject}</p>
              <p><strong>전송 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
              <h3 style="color: #555; margin-top: 0;">메시지 내용</h3>
              <div style="white-space: pre-wrap; line-height: 1.6;">${body.message}</div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(adminMailOptions);
      emailResult = { success: true, message: '이메일이 성공적으로 전송되었습니다.' };
      
    } catch (emailError) {
      console.error('이메일 전송 오류:', emailError);
      console.error('오류 상세:', {
        name: emailError.name,
        message: emailError.message,
        stack: emailError.stack
      });
      emailResult = { 
        success: false, 
        message: `이메일 전송 실패: ${emailError.message}` 
      };
    }

    // 성공 응답
    return NextResponse.json({
      message: emailResult.success ? '메시지가 성공적으로 전송되었습니다.' : '메시지가 저장되었습니다. (메일 전송 실패)',
      contact: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        timestamp: new Date().toISOString()
      },
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.message
    }, { status: 201 });

  } catch (error) {
    console.error('연락처 API 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}