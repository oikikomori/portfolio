@echo off
echo 🚀 포트폴리오 웹사이트 시작 중...
echo.

echo 📦 의존성 설치 중...
call npm run install:all

echo.
echo 🔧 개발 서버 시작 중...
echo API 서버: http://localhost:5000
echo 클라이언트: http://localhost:3000
echo.

call npm run dev

pause
