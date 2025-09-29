const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function generateRefreshToken() {
    try {
        console.log('Gmail OAuth 2.0 리프레시 토큰 생성기\n');
        
        // 환경변수 확인
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.error('❌ 환경변수가 설정되지 않았습니다.');
            console.log('다음 환경변수를 .env 파일에 설정해주세요:');
            console.log('- GOOGLE_CLIENT_ID');
            console.log('- GOOGLE_CLIENT_SECRET');
            process.exit(1);
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'urn:ietf:wg:oauth:2.0:oob'
        );

        // 인증 URL 생성
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send']
        });

        console.log('1. 다음 URL을 브라우저에서 열어주세요:');
        console.log(authUrl);
        console.log('\n2. Gmail 계정으로 로그인하고 권한을 승인해주세요.');
        console.log('3. 표시된 인증 코드를 복사해주세요.\n');

        // 사용자로부터 인증 코드 입력받기
        const code = await new Promise((resolve) => {
            rl.question('인증 코드를 입력하세요: ', resolve);
        });

        // 토큰 교환
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('\n✅ 리프레시 토큰이 성공적으로 생성되었습니다!');
        console.log('\n다음 값을 .env 파일에 추가하세요:');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        
        if (tokens.access_token) {
            console.log(`\n액세스 토큰 (선택사항): ${tokens.access_token}`);
        }

    } catch (error) {
        console.error('❌ 리프레시 토큰 생성 실패:', error.message);
        
        if (error.message.includes('invalid_grant')) {
            console.log('\n💡 해결 방법:');
            console.log('1. 인증 코드가 올바른지 확인하세요');
            console.log('2. 인증 코드를 받은 후 10분 이내에 입력했는지 확인하세요');
            console.log('3. Google Cloud Console에서 OAuth 클라이언트 ID 설정을 확인하세요');
        }
    } finally {
        rl.close();
    }
}

// 스크립트 실행
if (require.main === module) {
    generateRefreshToken();
}

module.exports = { generateRefreshToken };
