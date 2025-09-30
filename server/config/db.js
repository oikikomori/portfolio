const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 환경에 따라 다른 URI 사용
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD || process.env.MONGODB_URI
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      socketTimeoutMS: 45000, // 45초 소켓 타임아웃
    };

    const connection = await mongoose.connect(uri, options);
    console.log(`✅ MongoDB 연결 성공: ${connection.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    
    // 프로덕션 환경에서는 연결 실패 시 서버를 종료하지 않음
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ 프로덕션 환경에서 MongoDB 연결 실패, 서버는 계속 실행됩니다.');
      return;
    }
    
    throw error;
  }
};

module.exports = connectDB;
