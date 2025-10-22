const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  messages: [{
    id: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isUser: {
      type: Boolean,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    aiFeatures: {
      tone: String,
      emotion: String,
      intent: String,
      confidence: Number,
      translation: String,
      suggestions: [String]
    },
    metadata: {
      messageLength: Number,
      hasQuestion: Boolean,
      hasEmotion: Boolean,
      responseTime: Number
    }
  }],
  settings: {
    selectedTone: {
      type: String,
      default: '친근하게'
    },
    language: {
      type: String,
      default: 'ko'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    aiMessages: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    mostUsedTone: {
      type: String,
      default: '친근하게'
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// 인덱스 설정
// sessionId는 unique: true로 자동 인덱스 생성됨
conversationSchema.index({ userId: 1 })
conversationSchema.index({ 'statistics.lastActivity': -1 })
conversationSchema.index({ createdAt: -1 })

// 미들웨어: 업데이트 시간 자동 설정
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// 메서드: 새 메시지 추가
conversationSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData)
  this.statistics.totalMessages += 1
  
  if (messageData.isUser) {
    this.statistics.userMessages += 1
  } else {
    this.statistics.aiMessages += 1
  }
  
  this.statistics.lastActivity = new Date()
  return this.save()
}

// 메서드: 대화 히스토리 가져오기
conversationSchema.methods.getRecentMessages = function(limit = 50) {
  return this.messages
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .reverse()
}

// 메서드: 통계 업데이트
conversationSchema.methods.updateStatistics = function() {
  const messages = this.messages
  
  // 가장 많이 사용된 톤 계산
  const toneCounts = {}
  messages.forEach(msg => {
    if (msg.aiFeatures && msg.aiFeatures.tone) {
      toneCounts[msg.aiFeatures.tone] = (toneCounts[msg.aiFeatures.tone] || 0) + 1
    }
  })
  
  this.statistics.mostUsedTone = Object.keys(toneCounts).reduce((a, b) => 
    toneCounts[a] > toneCounts[b] ? a : b, '친근하게'
  )
  
  // 평균 응답 시간 계산
  const responseTimes = messages
    .filter(msg => !msg.isUser && msg.metadata && msg.metadata.responseTime)
    .map(msg => msg.metadata.responseTime)
  
  if (responseTimes.length > 0) {
    this.statistics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  }
  
  return this.save()
}

// 정적 메서드: 세션별 대화 찾기
conversationSchema.statics.findBySessionId = function(sessionId) {
  return this.findOne({ sessionId })
}

// 정적 메서드: 사용자별 대화 목록
conversationSchema.statics.findByUserId = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ 'statistics.lastActivity': -1 })
    .limit(limit)
}

// 정적 메서드: 오래된 대화 정리
conversationSchema.statics.cleanupOldConversations = function(daysOld = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)
  
  return this.deleteMany({
    'statistics.lastActivity': { $lt: cutoffDate },
    userId: 'anonymous'
  })
}

module.exports = mongoose.model('Conversation', conversationSchema)
