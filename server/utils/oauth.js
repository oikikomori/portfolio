const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// OAuth 2.0 클라이언트 생성
const createOAuth2Client = () => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob' // out-of-band flow
  );

  // 리프레시 토큰 설정
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return oauth2Client;
};

// 액세스 토큰 가져오기 (자동 갱신 포함)
const getAccessToken = async () => {
  try {
    const oauth2Client = createOAuth2Client();
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('액세스 토큰 가져오기 실패:', error);
    throw new Error('OAuth 2.0 인증에 실패했습니다.');
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
