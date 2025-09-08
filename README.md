# 🚀 포트폴리오 웹사이트

Node.js API 서버와 Next.js 프론트엔드로 구축된 현대적인 포트폴리오 웹사이트입니다.

## ✨ 주요 기능

- **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험
- **다크모드 지원**: 사용자 선호도에 따른 테마 전환 및 로컬 스토리지 저장
- **애니메이션**: Framer Motion을 활용한 부드러운 인터랙션
- **검색 및 필터링**: 프로젝트와 게시글을 위한 강력한 검색 및 필터링 시스템
- **게시판**: 개발 관련 포스트와 정보 공유
- **프로젝트 소개**: 포트폴리오 프로젝트 상세 설명
- **연락처 폼**: 방문자와의 소통 채널
- **관리자 패널**: 콘텐츠 관리 및 통계 대시보드
- **SEO 최적화**: 메타 태그, 구조화된 데이터, Open Graph 지원
- **보안 강화**: Rate Limiting, Helmet, CORS 설정
- **로깅 시스템**: 접근 로그 및 에러 로그 관리

## 🛠️ 기술 스택

### 백엔드 (API 서버)
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - ODM
- **JWT** - 인증
- **bcryptjs** - 비밀번호 해싱
- **express-validator** - 입력 검증
- **express-rate-limit** - API 요청 제한
- **helmet** - 보안 헤더
- **morgan** - 로깅
- **multer** - 파일 업로드
- **sharp** - 이미지 처리
- **nodemailer** - 이메일 전송

### 프론트엔드 (클라이언트)
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **React Icons** - 아이콘
- **Axios** - HTTP 클라이언트
- **@tailwindcss/typography** - 타이포그래피 플러그인
- **react-markdown** - 마크다운 렌더링
- **react-syntax-highlighter** - 코드 하이라이팅
- **date-fns** - 날짜 처리

## 📁 프로젝트 구조

```
portfolio-website/
├── server/                 # Node.js API 서버
│   ├── models/            # MongoDB 모델
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어 (인증, Rate Limiting)
│   ├── config/            # 설정 파일
│   ├── uploads/           # 파일 업로드 디렉토리
│   ├── logs/              # 로그 파일들
│   ├── server.js          # 메인 서버 파일
│   ├── package.json       # 서버 의존성
│   └── env.example        # 환경 변수 예시
├── client/                # Next.js 클라이언트
│   ├── app/               # Next.js 14 App Router
│   ├── components/        # React 컴포넌트
│   │   ├── SearchBar.tsx  # 검색 및 필터링 컴포넌트
│   │   ├── AdminPanel.tsx # 관리자 패널
│   │   └── ...            # 기타 컴포넌트들
│   ├── package.json       # 클라이언트 의존성
│   └── tailwind.config.js # Tailwind 설정
├── package.json           # 루트 프로젝트 설정
├── start.bat              # Windows 실행 스크립트
└── README.md              # 프로젝트 설명서
```

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone <repository-url>
cd portfolio-website
```

### 2. 의존성 설치
```bash
npm run install:all
```

### 3. 환경 변수 설정
서버 디렉토리에 `.env` 파일을 생성하고 `env.example`을 참고하여 설정하세요:

```env
# 서버 설정
PORT=5000
NODE_ENV=development

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT 설정
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# 파일 업로드 설정
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# 보안 설정
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. MongoDB 실행
MongoDB가 로컬에서 실행 중인지 확인하세요. 또는 MongoDB Atlas를 사용할 수 있습니다.

### 5. 개발 서버 실행
```bash
npm run dev
```

이 명령어는 다음을 실행합니다:
- API 서버: http://localhost:5000
- 클라이언트: http://localhost:3000

## 📱 주요 페이지 및 기능

### 홈 (Hero Section)
- 인사말과 소개
- 소셜 미디어 링크
- CTA 버튼

### 소개 (About)
- 개인 정보와 경력
- 주요 특징과 장점
- 개인 정보 카드

### 기술 스택 (Skills)
- 프론트엔드 기술 스택
- 각 기술별 숙련도 표시
- 카테고리별 분류

### 프로젝트 (Projects)
- 포트폴리오 프로젝트 소개
- **검색 및 필터링**: 제목, 설명, 기술 스택으로 검색
- **카테고리별 필터링**: 웹, 모바일, 데스크톱, 기타
- **상태별 필터링**: 완료, 진행중, 계획
- **날짜별 필터링**: 올해, 작년, 이번 달 등
- GitHub 및 Live Demo 링크

### 게시판 (Posts)
- 개발 관련 포스트
- **검색 및 필터링**: 제목, 내용, 작성자, 태그로 검색
- **카테고리별 분류**: 기술, 프로젝트, 일반, 업데이트
- **날짜별 필터링**: 시간 범위별 포스트 조회
- 조회수, 좋아요, 댓글 기능

### 연락처 (Contact)
- 연락처 정보
- 메시지 전송 폼
- 업무 시간 및 소셜 링크

### 검색 시스템
- **통합 검색**: 프로젝트와 게시글을 한 번에 검색
- **실시간 검색**: 타이핑과 동시에 결과 표시
- **고급 필터링**: 카테고리, 상태, 날짜 범위 등
- **검색 결과 표시**: 검색어와 결과 개수 표시

### 관리자 패널
- **대시보드**: 통계 및 최근 활동
- **사용자 관리**: 사용자 목록, 권한 관리
- **콘텐츠 관리**: 프로젝트, 게시글, 연락처 관리
- **통계 분석**: 사용자, 콘텐츠, 접근 통계

## 🔧 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/verify` - 토큰 검증
- `PUT /api/auth/profile` - 프로필 업데이트
- `PUT /api/auth/change-password` - 비밀번호 변경
- `POST /api/auth/logout` - 로그아웃

### 프로젝트
- `GET /api/projects` - 프로젝트 목록 (검색, 필터링, 페이지네이션)
- `GET /api/projects/:id` - 특정 프로젝트
- `POST /api/projects` - 새 프로젝트 생성
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제

### 게시판
- `GET /api/posts` - 포스트 목록 (검색, 필터링, 페이지네이션)
- `GET /api/posts/:id` - 특정 포스트
- `POST /api/posts` - 새 포스트 생성
- `POST /api/posts/:id/comments` - 댓글 추가
- `POST /api/posts/:id/like` - 좋아요

### 연락처
- `POST /api/contact` - 연락처 메시지 전송
- `GET /api/contact` - 메시지 목록 (관리자용)

### 시스템
- `GET /api/health` - 서버 상태 확인

## 🔒 보안 기능

- **Rate Limiting**: API 요청 제한으로 DDoS 방지
- **Helmet**: 보안 헤더 설정
- **CORS**: 교차 출처 리소스 공유 제어
- **JWT**: 안전한 인증 토큰
- **bcryptjs**: 비밀번호 해싱
- **express-validator**: 입력 데이터 검증
- **로그 시스템**: 접근 로그 및 에러 로그

## 🎨 커스터마이징

### 색상 테마
`client/tailwind.config.js`에서 색상을 수정할 수 있습니다:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... 더 많은 색상
  }
}
```

### 컴포넌트 수정
각 컴포넌트는 `client/components/` 디렉토리에 있으며, 필요에 따라 수정할 수 있습니다.

### 데이터 수정
샘플 데이터는 각 컴포넌트 파일 내에 정의되어 있으며, 실제 API 연동 시 해당 부분을 수정하면 됩니다.

### 환경 변수
`server/env.example`을 참고하여 필요한 환경 변수를 설정하세요.

## 📦 배포

### 프로덕션 빌드
```bash
npm run build
```

### 서버 실행
```bash
npm start
```

### 환경 변수
프로덕션 환경에서는 다음 환경 변수를 설정하세요:
- `NODE_ENV=production`
- `MONGODB_URI_PROD`: 프로덕션 MongoDB URI
- `JWT_SECRET`: 강력한 JWT 시크릿 키
- `CORS_ORIGIN`: 실제 도메인

## 🧪 테스트

```bash
# 서버 테스트
cd server
npm test

# 린팅
npm run lint
```

## 📊 성능 최적화

- **이미지 최적화**: Sharp를 사용한 이미지 리사이징
- **코드 스플리팅**: Next.js 자동 코드 스플리팅
- **폰트 최적화**: 폰트 프리로딩
- **SEO 최적화**: 메타 태그, 구조화된 데이터
- **캐싱**: 정적 자산 캐싱

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 문의사항이 있으시면 언제든 연락주세요:

- 이메일: contact@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🔄 업데이트 로그

### v1.1.0 (현재)
- ✅ 검색 및 필터링 시스템 추가
- ✅ 관리자 패널 구현
- ✅ 보안 강화 (Rate Limiting, Helmet)
- ✅ 로깅 시스템 추가
- ✅ SEO 최적화
- ✅ 사용자 인증 시스템 개선
- ✅ 파일 업로드 지원
- ✅ 다크모드 로컬 스토리지 저장

### v1.0.0
- ✅ 기본 포트폴리오 웹사이트
- ✅ Node.js API 서버
- ✅ Next.js 프론트엔드
- ✅ 반응형 디자인
- ✅ 다크모드 지원

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
