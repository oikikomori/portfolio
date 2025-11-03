const { google } = require('googleapis');
const express = require('express');
require('dotenv').config();

async function generateRefreshTokenWeb() {
  console.log('=== Gmail OAuth 2.0 리프레시 토큰 생성 (웹 방식) ===\n');
  
  // 환경변수 확인
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ 환경변수가 설정되지 않았습니다.');
    console.log('GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 .env 파일에 설정해주세요.');
    return;
  }

  // 로컬 개발용: localhost로 redirect URI 설정
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback';
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
  
  console.log(`📍 사용 중인 Redirect URI: ${REDIRECT_URI}`);

  const app = express();
  const PORT = 3001;

  // 인증 URL 생성 - Gmail 전송에 필요한 전체 권한 요청
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://mail.google.com/' // 더 넓은 권한으로 변경
    ],
    prompt: 'consent' // 항상 동의 화면 표시 (새 refresh token 얻기 위해)
  });

  console.log('1️⃣ 다음 URL을 브라우저에서 열어주세요:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(authUrl);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 콜백 라우트 설정
  app.get('/auth/callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).send('인증 코드가 없습니다.');
      }

      console.log('\n🔄 토큰을 교환하는 중...');
      const { tokens } = await oauth2Client.getToken(code);
      
      console.log('\n✅ 리프레시 토큰이 성공적으로 생성되었습니다!');
      console.log('\n📋 .env 파일에 다음을 추가하세요:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: green;">✅ 리프레시 토큰이 성공적으로 생성되었습니다!</h2>
            <p>터미널을 확인하여 .env 파일에 추가할 토큰을 확인하세요.</p>
            <p>이 창을 닫아도 됩니다.</p>
          </body>
        </html>
      `);

      // 서버 종료
      setTimeout(() => {
        process.exit(0);
      }, 2000);

    } catch (error) {
      console.error('\n❌ 토큰 생성 실패:', error.message);
      res.status(500).send('토큰 생성에 실패했습니다.');
    }
  });

  // 서버 시작
  app.listen(PORT, () => {
    console.log(`2️⃣ 로컬 서버가 http://localhost:${PORT}에서 시작되었습니다.`);
    console.log('3️⃣ 위 URL을 클릭하면 자동으로 브라우저가 열립니다.\n');
    
    // 브라우저 열기 안내
    console.log('브라우저에서 위 URL을 열어주세요.');
  });
}

// 스크립트 실행
if (require.main === module) {
  generateRefreshTokenWeb();
}

module.exports = { generateRefreshTokenWeb };
