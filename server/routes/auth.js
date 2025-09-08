const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginLimiter } = require('../middleware/rateLimit');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// 회원가입
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('사용자명은 3-30자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'),
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.'),
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('이름은 최대 50자까지 가능합니다.'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('성은 최대 50자까지 가능합니다.')
], async (req, res) => {
  try {
    // 검증 오류 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { username, email, password, profile } = req.body;

    // 중복 사용자 확인
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: '이미 사용 중인 사용자명 또는 이메일입니다.'
      });
    }

    // 새 사용자 생성
    const user = new User({
      username,
      email,
      password,
      profile
    });

    await user.save();

    // 이메일 검증 토큰 생성
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // JWT 토큰 생성
    const token = generateToken(user._id);

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        profileCompletion: user.profileCompletion
      },
      token,
      verificationToken
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      error: '회원가입 중 오류가 발생했습니다.'
    });
  }
});

// 로그인
router.post('/login', loginLimiter, [
  body('username')
    .notEmpty()
    .withMessage('사용자명 또는 이메일을 입력해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // 사용자 찾기 (사용자명 또는 이메일로)
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: '비활성화된 계정입니다. 관리자에게 문의하세요.'
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 마지막 로그인 업데이트
    await user.updateLastLogin();

    // JWT 토큰 생성
    const token = generateToken(user._id);

    res.json({
      message: '로그인이 완료되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        profileCompletion: user.profileCompletion,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      error: '로그인 중 오류가 발생했습니다.'
    });
  }
});

// 토큰 검증
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: '토큰이 유효합니다.',
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile,
        profileCompletion: req.user.profileCompletion
      }
    });
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    res.status(500).json({
      error: '토큰 검증 중 오류가 발생했습니다.'
    });
  }
});

// 프로필 업데이트
router.put('/profile', authenticateToken, [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('이름은 최대 50자까지 가능합니다.'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('성은 최대 50자까지 가능합니다.'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('자기소개는 최대 500자까지 가능합니다.'),
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('유효한 웹사이트 URL을 입력해주세요.'),
  body('profile.location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('위치는 최대 100자까지 가능합니다.'),
  body('social.github')
    .optional()
    .isURL()
    .withMessage('유효한 GitHub URL을 입력해주세요.'),
  body('social.linkedin')
    .optional()
    .isURL()
    .withMessage('유효한 LinkedIn URL을 입력해주세요.'),
  body('social.twitter')
    .optional()
    .isURL()
    .withMessage('유효한 Twitter URL을 입력해주세요.'),
  body('social.instagram')
    .optional()
    .isURL()
    .withMessage('유효한 Instagram URL을 입력해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { profile, social } = req.body;
    const updateData = {};

    if (profile) {
      updateData.profile = { ...req.user.profile, ...profile };
    }

    if (social) {
      updateData.social = { ...req.user.social, ...social };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: '프로필이 업데이트되었습니다.',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        social: updatedUser.social,
        profileCompletion: updatedUser.profileCompletion
      }
    });

  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({
      error: '프로필 업데이트 중 오류가 발생했습니다.'
    });
  }
});

// 비밀번호 변경
router.put('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('현재 비밀번호를 입력해주세요.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('새 비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('새 비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // 현재 비밀번호 확인
    const user = await User.findById(req.user._id).select('+password');
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: '현재 비밀번호가 올바르지 않습니다.'
      });
    }

    // 새 비밀번호 설정
    await user.changePassword(newPassword);

    res.json({
      message: '비밀번호가 성공적으로 변경되었습니다.'
    });

  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({
      error: '비밀번호 변경 중 오류가 발생했습니다.'
    });
  }
});

// 로그아웃 (클라이언트에서 토큰 제거)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // 여기서는 서버 측에서 할 수 있는 것이 제한적
    // 실제로는 클라이언트에서 토큰을 제거해야 함
    res.json({
      message: '로그아웃되었습니다.'
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({
      error: '로그아웃 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
