const Conversation = require('../models/Conversation')
const memoryDB = require('../utils/memoryDB')
const { v4: uuidv4 } = require('uuid')

class ConversationService {
  // 새 대화 세션 생성
  async createConversation(sessionId = null, userId = 'anonymous') {
    try {
      const newSessionId = sessionId || uuidv4()
      
      // 메모리 DB 사용 (MongoDB 연결 실패 시)
      const conversation = memoryDB.createConversation(newSessionId, userId)
      return conversation
    } catch (error) {
      console.error('대화 생성 오류:', error)
      throw error
    }
  }

  // 대화 가져오기 또는 생성
  async getOrCreateConversation(sessionId, userId = 'anonymous') {
    try {
      // 메모리 DB에서 대화 찾기
      let conversation = memoryDB.getConversation(sessionId)
      
      if (!conversation) {
        conversation = await this.createConversation(sessionId, userId)
      }
      
      return conversation
    } catch (error) {
      console.error('대화 가져오기 오류:', error)
      throw error
    }
  }

  // 메시지 추가
  async addMessage(sessionId, messageData) {
    try {
      // 메시지 메타데이터 추가
      const enrichedMessage = {
        ...messageData,
        metadata: {
          messageLength: messageData.content.length,
          hasQuestion: messageData.content.includes('?'),
          hasEmotion: this.hasEmotionWords(messageData.content),
          responseTime: messageData.responseTime || 0
        }
      }

      const conversation = memoryDB.addMessage(sessionId, enrichedMessage)
      return conversation
    } catch (error) {
      console.error('메시지 추가 오류:', error)
      throw error
    }
  }

  // 대화 히스토리 가져오기
  async getConversationHistory(sessionId, limit = 50) {
    try {
      return memoryDB.getConversationHistory(sessionId, limit)
    } catch (error) {
      console.error('대화 히스토리 가져오기 오류:', error)
      return []
    }
  }

  // 대화 설정 업데이트
  async updateConversationSettings(sessionId, settings) {
    try {
      return memoryDB.updateConversationSettings(sessionId, settings)
    } catch (error) {
      console.error('대화 설정 업데이트 오류:', error)
      throw error
    }
  }

  // 대화 통계 가져오기
  async getConversationStats(sessionId) {
    try {
      return memoryDB.getConversationStats(sessionId)
    } catch (error) {
      console.error('대화 통계 가져오기 오류:', error)
      return null
    }
  }

  // 사용자별 대화 목록
  async getUserConversations(userId, limit = 20) {
    try {
      return memoryDB.getUserConversations(userId, limit)
    } catch (error) {
      console.error('사용자 대화 목록 가져오기 오류:', error)
      return []
    }
  }

  // 대화 삭제
  async deleteConversation(sessionId) {
    try {
      return memoryDB.deleteConversation(sessionId)
    } catch (error) {
      console.error('대화 삭제 오류:', error)
      throw error
    }
  }

  // 오래된 대화 정리
  async cleanupOldConversations(daysOld = 30) {
    try {
      // 메모리 DB에서는 정리 기능이 제한적
      console.log('메모리 DB에서는 자동 정리가 제한됩니다.')
      return { deletedCount: 0 }
    } catch (error) {
      console.error('대화 정리 오류:', error)
      throw error
    }
  }

  // 감정 단어 감지
  hasEmotionWords(text) {
    const emotionWords = [
      '좋', '행복', '기쁘', '즐거', '만족', '감사', '사랑', '좋아',
      '나쁘', '슬프', '화나', '짜증', '불만', '싫', '힘들', '우울'
    ]
    
    const textLower = text.toLowerCase()
    return emotionWords.some(word => textLower.includes(word))
  }

  // 대화 분석
  async analyzeConversation(sessionId) {
    try {
      return memoryDB.analyzeConversation(sessionId)
    } catch (error) {
      console.error('대화 분석 오류:', error)
      return null
    }
  }

  // 감정 분석
  analyzeEmotions(messages) {
    const emotions = { positive: 0, negative: 0, neutral: 0 }
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.emotion) {
        emotions[msg.aiFeatures.emotion] = (emotions[msg.aiFeatures.emotion] || 0) + 1
      }
    })
    
    return emotions
  }

  // 의도 분석
  analyzeIntents(messages) {
    const intents = {}
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.intent) {
        intents[msg.aiFeatures.intent] = (intents[msg.aiFeatures.intent] || 0) + 1
      }
    })
    
    return intents
  }

  // 톤 분석
  analyzeTones(messages) {
    const tones = {}
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.tone) {
        tones[msg.aiFeatures.tone] = (tones[msg.aiFeatures.tone] || 0) + 1
      }
    })
    
    return tones
  }

  // 대화 지속 시간 계산
  calculateDuration(messages) {
    if (messages.length < 2) return 0
    
    const firstMessage = messages[0].timestamp
    const lastMessage = messages[messages.length - 1].timestamp
    
    return Math.floor((lastMessage - firstMessage) / 1000 / 60) // 분 단위
  }

  // 가장 활발한 시간대 찾기
  findMostActiveHour(messages) {
    const hourCounts = {}
    
    messages.forEach(msg => {
      const hour = new Date(msg.timestamp).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    
    return Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b, '0'
    )
  }
}

module.exports = new ConversationService()
