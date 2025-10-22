const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 환경에 따라 다른 URI 사용
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD || process.env.MONGODB_URI
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    // MongoDB URI가 없으면 연결하지 않음
    if (!uri) {
      console.log('⚠️ MongoDB URI가 설정되지 않았습니다. 데이터베이스 연결을 건너뜁니다.');
      return;
    }
    
    // 기본 로컬 MongoDB URI 사용 시 경고 메시지
    if (uri === 'mongodb://localhost:27017/portfolio') {
      console.log('ℹ️ 로컬 MongoDB를 사용합니다. MongoDB가 실행 중인지 확인하세요.');
    }
    
    const options = {
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      socketTimeoutMS: 45000, // 45초 소켓 타임아웃
    };

    const connection = await mongoose.connect(uri, options);
    console.log(`✅ MongoDB 연결 성공: ${connection.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    console.log('⚠️ MongoDB 연결 실패, 서버는 계속 실행됩니다.');
    // 연결 실패해도 서버는 계속 실행
    return;
  }
};

module.exports = connectDB;
