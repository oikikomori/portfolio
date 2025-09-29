# Gmail OAuth 2.0 설정 가이드

Gmail의 앱 비밀번호가 더 이상 제공되지 않아 OAuth 2.0 방식으로 이메일 전송을 설정해야 합니다.

## 1. Google Cloud Console 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름을 입력하고 생성

## 2. Gmail API 활성화

1. Google Cloud Console에서 "API 및 서비스" > "라이브러리" 선택
2. "Gmail API" 검색 후 선택
3. "사용" 버튼 클릭하여 API 활성화

## 3. OAuth 2.0 클라이언트 ID 생성

1. "API 및 서비스" > "사용자 인증 정보" 선택
2. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
3. 애플리케이션 유형: "데스크톱 애플리케이션" 선택
4. 이름 입력 후 "만들기" 클릭
5. 생성된 클라이언트 ID와 클라이언트 보안 비밀번호 복사

## 4. OAuth 동의 화면 설정

1. "API 및 서비스" > "OAuth 동의 화면" 선택
2. 사용자 유형: "외부" 선택
3. 앱 정보 입력:
   - **앱 이름**: Portfolio Mail (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인 이메일 주소
   - **개발자 연락처 정보**: 본인 이메일 주소
4. 범위 추가:
   - "범위 추가 또는 삭제" 클릭
   - `https://www.googleapis.com/auth/gmail.send` 추가
5. 테스트 사용자 추가:
   - 본인 이메일 주소 (`c8c8c81828@gmail.com`) 추가
6. 개인정보처리방침 및 서비스 약관 URL 설정:
   - **개인정보처리방침 URL**: `https://your-domain.com/privacy`
   - **서비스 약관 URL**: `https://your-domain.com/terms`
   - (로컬 개발 시: `http://localhost:3000/privacy`, `http://localhost:3000/terms`)

## 5. 리프레시 토큰 생성

리프레시 토큰을 생성하기 위한 스크립트를 실행합니다:

```bash
node scripts/generate-refresh-token.js
```

또는 수동으로 생성하려면:

1. 다음 URL을 브라우저에서 열기 (YOUR_CLIENT_ID를 실제 클라이언트 ID로 교체):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/gmail.send&response_type=code&access_type=offline
```

2. Gmail 계정으로 로그인
3. 권한 승인
4. 표시된 인증 코드 복사
5. 다음 명령어로 리프레시 토큰 생성:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTH_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

## 6. 환경변수 설정

`.env` 파일에 다음 값들을 설정:

```env
SMTP_USER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

## 7. 테스트

서버를 재시작하고 연락처 폼을 통해 이메일 전송을 테스트해보세요.

## 주의사항

- 리프레시 토큰은 안전하게 보관하세요
- 클라이언트 보안 비밀번호는 공개하지 마세요
- 프로덕션 환경에서는 환경변수로만 설정하세요
