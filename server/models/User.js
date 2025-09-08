const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '사용자명은 필수입니다.'],
    unique: true,
    trim: true,
    minlength: [3, '사용자명은 최소 3자 이상이어야 합니다.'],
    maxlength: [30, '사용자명은 최대 30자까지 가능합니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일 주소를 입력해주세요.']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다.']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, '이름은 최대 50자까지 가능합니다.']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, '성은 최대 50자까지 가능합니다.']
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, '자기소개는 최대 500자까지 가능합니다.']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, '유효한 웹사이트 URL을 입력해주세요.']
    },
    location: {
      type: String,
      maxlength: [100, '위치는 최대 100자까지 가능합니다.']
    }
  },
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// 가상 필드: 전체 이름
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// 가상 필드: 프로필 완성도
userSchema.virtual('profileCompletion').get(function() {
  let completion = 0;
  const fields = [
    this.profile.firstName,
    this.profile.lastName,
    this.profile.bio,
    this.profile.avatar,
    this.profile.website,
    this.profile.location
  ];
  
  fields.forEach(field => {
    if (field) completion += 16.67; // 100% / 6 fields
  });
  
  return Math.round(completion);
});

// JSON 변환 시 가상 필드 포함
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 비밀번호 변경 메서드
userSchema.methods.changePassword = async function(newPassword) {
  this.password = newPassword;
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
  return this.save();
};

// 로그인 업데이트 메서드
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// 이메일 검증 토큰 생성
userSchema.methods.generateEmailVerificationToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24시간
  return token;
};

// 비밀번호 재설정 토큰 생성
userSchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = token;
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1시간
  return token;
};

// 검색 인덱스
userSchema.index({ username: 'text', email: 'text', 'profile.firstName': 'text', 'profile.lastName': 'text' });

module.exports = mongoose.model('User', userSchema);
