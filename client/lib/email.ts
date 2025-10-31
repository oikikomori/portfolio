// Next.js에서 사용할 이메일 전송 유틸리티
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// OAuth 2.0 클라이언트 생성
function createOAuth2Client(): OAuth2Client {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'https://kuuuma.com/auth/callback'
  );

  // 리프레시 토큰 설정
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  oauth2Client.timeout = 30000; // 30초

  return oauth2Client;
}

// 액세스 토큰 가져오기
async function getAccessToken(): Promise<string> {
  try {
    console.log('OAuth2 클라이언트 생성 중...');
    const oauth2Client = createOAuth2Client();
    
    console.log('액세스 토큰 요청 중...');
    const { token } = await oauth2Client.getAccessToken();
    
    console.log('액세스 토큰 응답:', token ? '토큰 획득 성공' : '토큰 없음');
    
    if (!token) {
      throw new Error('액세스 토큰을 가져올 수 없습니다.');
    }
    
    return token;
  } catch (error: any) {
    console.error('액세스 토큰 가져오기 실패:', error);
    
    // invalid_grant 오류인 경우 상세한 안내 제공
    if (error.message?.includes('invalid_grant') || error.response?.data?.error === 'invalid_grant') {
      const errorMessage = `Refresh Token이 만료되었거나 무효합니다. 
      
다음 중 하나를 시도해주세요:
1. Refresh Token을 재발급받기
   - server/scripts/web-oauth.js를 실행하여 새로운 refresh token 생성
   - 또는 Google Cloud Console에서 OAuth 동의 화면 재승인

2. 환경 변수 확인:
   - GOOGLE_CLIENT_ID가 올바른지 확인
   - GOOGLE_CLIENT_SECRET이 올바른지 확인
   - GOOGLE_REFRESH_TOKEN이 최신인지 확인

3. Redirect URI 확인:
   - Google Cloud Console의 OAuth 2.0 클라이언트 설정에서
   - 승인된 리디렉션 URI에 'https://kuuuma.com/auth/callback' 또는
     'http://localhost:3000/auth/callback' 추가`;
      
      throw new Error(errorMessage);
    }
    
    throw new Error(`OAuth 2.0 인증에 실패했습니다: ${error.message}`);
  }
}

// OAuth 2.0 설정 검증
function validateOAuthConfig(): void {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET이 설정되지 않았습니다.');
  }
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('GOOGLE_REFRESH_TOKEN이 설정되지 않았습니다.');
  }
  if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER가 설정되지 않았습니다.');
  }
}

// 이메일 전송기 생성
async function createTransporter() {
  validateOAuthConfig();
  
  try {
    console.log('OAuth2 설정 확인 중...');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('액세스 토큰을 가져올 수 없습니다.');
    }
    
    console.log('액세스 토큰 획득 성공:', accessToken ? '토큰 존재' : '토큰 없음');
    
    const authConfig = {
      type: 'OAuth2',
      user: process.env.SMTP_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken
    };
    
    console.log('OAuth2 설정:', {
      user: authConfig.user,
      clientId: authConfig.clientId ? `${authConfig.clientId.substring(0, 20)}...` : '없음',
      refreshToken: authConfig.refreshToken ? '설정됨' : '없음',
      accessToken: accessToken ? '설정됨' : '없음'
    });
    
    // nodemailer OAuth2 설정 (명시적으로 모든 필드 포함)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: authConfig.user!,
        clientId: authConfig.clientId!,
        clientSecret: authConfig.clientSecret!,
        refreshToken: authConfig.refreshToken!,
        accessToken: accessToken,
        expires: 3600 // 토큰 만료 시간 (초)
      }
    });
    
    console.log('nodemailer transporter 생성 완료');
    
    // 연결 테스트 (OAuth2가 제대로 설정되었는지 확인)
    console.log('transporter 연결 테스트 중...');
    await transporter.verify();
    console.log('✅ transporter 연결 테스트 성공 (OAuth2 인증 확인됨)');
    
    return transporter;
  } catch (error: any) {
    console.error('OAuth 2.0 전송기 생성 실패:', error);
    throw new Error(`이메일 전송기 생성에 실패했습니다: ${error.message}`);
  }
}

// 연락처 메시지 전송
export async function sendContactEmail(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    console.log('이메일 전송 시작:', {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject
    });

    const transporter = await createTransporter();
    console.log('이메일 전송기 생성 완료');

    // 전송기 연결 테스트
    await transporter.verify();
    console.log('전송기 연결 테스트 성공');

    const smtpUser = process.env.SMTP_USER || '';

    // 관리자에게 보낼 메일
    const adminMailOptions = {
      from: smtpUser,
      to: smtpUser,
      subject: `[포트폴리오] 새로운 연락 메시지: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            새로운 연락 메시지
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">발신자 정보</h3>
            <p><strong>이름:</strong> ${contactData.name}</p>
            <p><strong>이메일:</strong> ${contactData.email}</p>
            <p><strong>제목:</strong> ${contactData.subject}</p>
            <p><strong>전송 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #555; margin-top: 0;">메시지 내용</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${contactData.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2;">
              <strong>답변하기:</strong> 
              <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}" 
                 style="color: #1976d2; text-decoration: none;">
                ${contactData.email}
              </a>
            </p>
          </div>
        </div>
      `
    };

    // 발신자에게 자동 응답 메일
    const autoReplyOptions = {
      from: smtpUser,
      to: contactData.email,
      subject: '메시지가 성공적으로 전송되었습니다 - 오승일 포트폴리오',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            메시지 전송 완료
          </h2>
          
          <p>안녕하세요, <strong>${contactData.name}</strong>님!</p>
          
          <p>포트폴리오 사이트를 통해 보내주신 메시지가 성공적으로 전송되었습니다.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">전송된 메시지</h3>
            <p><strong>제목:</strong> ${contactData.subject}</p>
            <p><strong>내용:</strong></p>
            <div style="white-space: pre-wrap; line-height: 1.6; background-color: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #e9ecef;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>빠른 시일 내에 답변드리도록 하겠습니다. 감사합니다!</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e8; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #2e7d32;">
              <strong>오승일</strong><br>
              프론트엔드 개발자<br>
              <a href="mailto:${smtpUser}" style="color: #2e7d32;">${smtpUser}</a>
            </p>
          </div>
        </div>
      `
    };

    // 두 메일 모두 전송
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    return { success: true, message: '메일이 성공적으로 전송되었습니다.' };
  } catch (error: any) {
    console.error('메일 전송 실패:', error);
    return { 
      success: false, 
      message: '메일 전송에 실패했습니다.', 
      error: error.message 
    };
  }
}

