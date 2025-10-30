import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// 연락처 메시지 전송 API - Supabase 직접 사용
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 유효성 검사
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

    // 클라이언트 IP 및 User-Agent 가져오기
    const headers = request.headers;
    const ipAddress = headers.get('x-forwarded-for') || 
                     headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = headers.get('user-agent') || 'unknown';

    // Supabase에 연락처 메시지 저장
    try {
      const { data: savedContact, error: dbError } = await supabase
        .from('contacts')
        .insert([{
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          status: 'unread',
          ip_address: ipAddress,
          user_agent: userAgent
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase 저장 오류:', dbError);
        throw dbError;
      }

      console.log('✅ 메시지가 데이터베이스에 저장되었습니다:', savedContact.id);

      // 이메일 전송 시도
      let emailResult = { success: false, message: '이메일 전송 실패' };
      
      try {
        // 환경변수 확인
        const hasEmailConfig = 
          process.env.GOOGLE_CLIENT_ID &&
          process.env.GOOGLE_CLIENT_SECRET &&
          process.env.GOOGLE_REFRESH_TOKEN &&
          process.env.SMTP_USER;

        if (hasEmailConfig) {
          // OAuth2 클라이언트 생성
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NODE_ENV === 'production' 
              ? 'https://kuuuma.com/auth/callback'
              : 'http://localhost:3000/auth/callback'
          );

          // 리프레시 토큰 설정
          oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });

          // 액세스 토큰 가져오기
          const { token: accessToken } = await oauth2Client.getAccessToken();

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
          console.log('✅ 이메일 전송 성공');
        } else {
          emailResult = { 
            success: false, 
            message: '이메일 설정이 구성되지 않았습니다.' 
          };
          console.log('⚠️ 이메일 설정이 없어 이메일을 전송하지 않습니다.');
        }
      } catch (emailError: any) {
        console.error('이메일 전송 오류:', emailError);
        emailResult = { 
          success: false, 
          message: `이메일 전송 실패: ${emailError.message}` 
        };
      }

      // 성공 응답
      return NextResponse.json({
        success: true,
        message: emailResult.success 
          ? '메시지가 성공적으로 전송되었습니다.' 
          : '메시지는 저장되었지만 이메일 전송에 실패했습니다.',
        contactId: savedContact.id,
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.message
      }, { status: 201 });

    } catch (error: any) {
      console.error('데이터베이스 저장 오류:', error);
      return NextResponse.json(
        { 
          success: false,
          message: '메시지 저장 중 오류가 발생했습니다.',
          error: error.message 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('연락처 API 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: error.message 
      },
      { status: 500 }
    );
  }
}