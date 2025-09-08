const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    const connection = await mongoose.connect(uri);
    console.log(`✅ MongoDB 연결 성공: ${connection.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    throw error;
  }
};

module.exports = connectDB;
