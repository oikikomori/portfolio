const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// OAuth 2.0 클라이언트 생성
const createOAuth2Client = () => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://kuuuma.com/auth/callback' // 웹 애플리케이션 flow
  );

  // 리프레시 토큰 설정
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  // 타임아웃 설정 추가
  oauth2Client.timeout = 30000; // 30초

  // Google API 엔드포인트 명시적 설정
  oauth2Client.options = {
    ...oauth2Client.options,
    timeout: 30000,
    retry: true,
    retryConfig: {
      retry: 3,
      retryDelay: 1000
    }
  };

  // DNS 문제 해결을 위한 추가 설정
  oauth2Client.request = oauth2Client.request.bind(oauth2Client);

  return oauth2Client;
};

// 액세스 토큰 가져오기 (자동 갱신 포함)
const getAccessToken = async () => {
  try {
    console.log('OAuth 클라이언트 생성 중...');
    const oauth2Client = createOAuth2Client();
    console.log('OAuth 클라이언트 생성 완료');
    
    console.log('액세스 토큰 요청 중...');
    const { token } = await oauth2Client.getAccessToken();
    console.log('액세스 토큰 획득 성공:', token ? '토큰 존재' : '토큰 없음');
    
    return token;
  } catch (error) {
    console.error('액세스 토큰 가져오기 실패:', error);
    console.error('오류 상세:', {
      code: error.code,
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    
    // DNS 오류인 경우 특별 처리
    if (error.code === 'DNS_HOSTNAME_RESOLVED_PRIVATE' || 
        error.message.includes('DNS') || 
        error.message.includes('ENOTFOUND')) {
      throw new Error('Google OAuth 서비스에 연결할 수 없습니다. 네트워크 설정을 확인해주세요.');
    }
    
    throw new Error(`OAuth 2.0 인증에 실패했습니다: ${error.message}`);
  }
};

// Gmail API 클라이언트 생성
const createGmailClient = async () => {
  try {
    const oauth2Client = createOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    return gmail;
  } catch (error) {
    console.error('Gmail 클라이언트 생성 실패:', error);
    throw new Error('Gmail API 클라이언트 생성에 실패했습니다.');
  }
};

// OAuth 2.0 설정 검증
const validateOAuthConfig = () => {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'GOOGLE_REFRESH_TOKEN',
    'SMTP_USER'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`다음 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}`);
  }

  return true;
};

module.exports = {
  createOAuth2Client,
  getAccessToken,
  createGmailClient,
  validateOAuthConfig
};
