const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: '액세스 토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: '토큰이 만료되었습니다.' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.' 
      });
    }
    
    console.error('토큰 검증 오류:', error);
    return res.status(500).json({ 
      error: '토큰 검증 중 오류가 발생했습니다.' 
    });
  }
};

// 관리자 권한 확인 미들웨어
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: '인증이 필요합니다.' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: '관리자 권한이 필요합니다.' 
      });
    }

    next();
  } catch (error) {
    console.error('권한 확인 오류:', error);
    return res.status(500).json({ 
      error: '권한 확인 중 오류가 발생했습니다.' 
    });
  }
};

// 선택적 인증 미들웨어 (로그인하지 않은 사용자도 접근 가능하지만, 로그인한 경우 사용자 정보 제공)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // 토큰이 유효하지 않아도 계속 진행
        console.log('선택적 인증 실패:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('선택적 인증 오류:', error);
    next(); // 오류가 발생해도 계속 진행
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
