// 지능형 챗봇 AI 클래스
class ChatbotAI {
  constructor() {
    this.knowledgeBase = new Map() // 지식 베이스
    this.conversationHistory = [] // 대화 히스토리
    this.learningPatterns = new Map() // 학습 패턴
    this.emotionAnalyzer = new EmotionAnalyzer() // 감정 분석기
    this.responseGenerator = new ResponseGenerator() // 응답 생성기
  }

  // 메인 대화 처리 함수
  async processMessage(userMessage, tone = '친근하게') {
    try {
      // 1. 감정 분석
      const emotion = this.emotionAnalyzer.analyze(userMessage)
      
      // 2. 의도 파악
      const intent = this.analyzeIntent(userMessage)
      
      // 3. 컨텍스트 분석
      const context = this.analyzeContext(userMessage)
      
      // 4. 응답 생성
      const response = await this.generateResponse(userMessage, emotion, intent, context, tone)
      
      // 5. 학습 (사용자 피드백 기반)
      this.learnFromInteraction(userMessage, response)
      
      // 6. 대화 히스토리 저장
      this.conversationHistory.push({
        user: userMessage,
        bot: response,
        emotion,
        intent,
        timestamp: new Date()
      })

      return {
        success: true,
        response,
        emotion,
        intent,
        confidence: this.calculateConfidence(intent, context)
      }
    } catch (error) {
      console.error('챗봇 AI 오류:', error)
      return {
        success: false,
        response: '죄송합니다. 처리 중 오류가 발생했습니다.',
        error: error.message
      }
    }
  }

  // 의도 분석
  analyzeIntent(message) {
    const intents = {
      greeting: ['안녕', '하이', 'hello', 'hi', '좋은', '인사'],
      question: ['?', '뭐', '어떻게', '왜', '언제', '어디', '누구'],
      request: ['도와', '해줘', '부탁', '요청', '필요'],
      compliment: ['좋', '멋', '훌륭', '대단', '감사'],
      complaint: ['문제', '불만', '화나', '짜증', '싫'],
      goodbye: ['안녕', '바이', 'bye', '잘가', '다음에']
    }

    const messageLower = message.toLowerCase()
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return intent
      }
    }
    
    return 'general'
  }

  // 컨텍스트 분석
  analyzeContext(message) {
    const context = {
      hasQuestion: message.includes('?'),
      hasEmotion: this.emotionAnalyzer.hasEmotionWords(message),
      messageLength: message.length,
      hasNumbers: /\d/.test(message),
      hasUrls: /http/.test(message),
      previousContext: this.getPreviousContext()
    }
    
    return context
  }

  // 응답 생성
  async generateResponse(message, emotion, intent, context, tone) {
    // 1. 기존 지식에서 답변 찾기
    const knowledgeResponse = this.searchKnowledgeBase(message)
    if (knowledgeResponse) {
      return this.responseGenerator.generateFromKnowledge(knowledgeResponse, tone)
    }

    // 2. 패턴 매칭으로 답변 생성
    const patternResponse = this.matchPatterns(message, intent, emotion)
    if (patternResponse) {
      return this.responseGenerator.generateFromPattern(patternResponse, tone)
    }

    // 3. 컨텍스트 기반 답변 생성
    const contextResponse = this.generateContextualResponse(message, context, emotion, tone)
    return contextResponse
  }

  // 지식 베이스 검색
  searchKnowledgeBase(message) {
    const messageWords = message.toLowerCase().split(' ')
    
    for (const [key, knowledge] of this.knowledgeBase.entries()) {
      const keyWords = key.toLowerCase().split(' ')
      const matchCount = messageWords.filter(word => keyWords.includes(word)).length
      
      if (matchCount >= 2) { // 2개 이상 단어가 일치하면
        return knowledge
      }
    }
    
    return null
  }

  // 패턴 매칭
  matchPatterns(message, intent, emotion) {
    const patterns = {
      greeting: [
        '안녕하세요! 반가워요! 😊',
        '안녕! 오늘 기분은 어때요?',
        '안녕하세요! 무엇을 도와드릴까요?'
      ],
      question: [
        '좋은 질문이네요! 더 자세히 알려드릴게요.',
        '흥미로운 질문이에요! 함께 알아봐요.',
        '궁금한 점이 있으시군요! 도움을 드릴게요.'
      ],
      request: [
        '물론이에요! 도와드릴게요.',
        '네, 무엇이든 도와드릴 수 있어요!',
        '기꺼이 도움을 드리겠습니다.'
      ],
      compliment: [
        '감사해요! 정말 기뻐요! 😊',
        '고마워요! 더 열심히 할게요!',
        '정말 감사합니다! 힘이 나요!'
      ],
      complaint: [
        '죄송해요. 문제를 해결해드릴게요.',
        '이해해요. 더 나은 방법을 찾아볼게요.',
        '미안해요. 개선하도록 노력할게요.'
      ],
      goodbye: [
        '안녕히 가세요! 또 만나요! 👋',
        '좋은 하루 되세요!',
        '다음에 또 만나요!'
      ]
    }

    return patterns[intent] ? patterns[intent][Math.floor(Math.random() * patterns[intent].length)] : null
  }

  // 컨텍스트 기반 응답 생성
  generateContextualResponse(message, context, emotion, tone) {
    const responses = {
      '친근하게': [
        `"${message}"에 대해 말씀해주셨네요! 정말 흥미로운 주제예요! 😊`,
        `와, 좋은 이야기네요! "${message}"에 대해 더 자세히 알려주세요!`,
        `정말 궁금한 내용이에요! "${message}"에 대해 함께 알아봐요!`
      ],
      '공식적으로': [
        `안녕하십니까. "${message}"에 대한 문의를 주셔서 감사합니다.`,
        `귀하께서 말씀하신 "${message}"에 대해 공식적으로 답변드리겠습니다.`,
        `문의해주신 "${message}"에 관하여 정확한 정보를 제공해드리겠습니다.`
      ],
      '간단하게': [
        `"${message}"에 대해 간단히 답변드릴게요.`,
        `"${message}" - 핵심만 말씀드리면...`,
        `"${message}"에 대한 요약입니다.`
      ],
      '전문적으로': [
        `"${message}"에 대한 전문적 분석을 제공해드리겠습니다.`,
        `해당 주제 "${message}"에 대해 기술적 관점에서 설명드리겠습니다.`,
        `"${message}"에 대한 상세한 전문 정보를 공유해드리겠습니다.`
      ]
    }

    const toneResponses = responses[tone] || responses['친근하게']
    return toneResponses[Math.floor(Math.random() * toneResponses.length)]
  }

  // 학습 기능
  learnFromInteraction(userMessage, botResponse) {
    // 사용자 피드백이 있으면 학습
    const feedback = this.getUserFeedback()
    if (feedback) {
      this.updateKnowledgeBase(userMessage, botResponse, feedback)
    }
  }

  // 지식 베이스 업데이트
  updateKnowledgeBase(userMessage, botResponse, feedback) {
    const key = userMessage.toLowerCase()
    const knowledge = {
      question: userMessage,
      answer: botResponse,
      feedback: feedback,
      timestamp: new Date(),
      confidence: feedback === 'positive' ? 1 : 0.5
    }
    
    this.knowledgeBase.set(key, knowledge)
  }

  // 사용자 피드백 수집 (실제로는 UI에서 구현)
  getUserFeedback() {
    // 실제로는 사용자가 좋아요/싫어요 버튼을 클릭하면 호출
    return null // 임시로 null 반환
  }

  // 이전 컨텍스트 가져오기
  getPreviousContext() {
    if (this.conversationHistory.length > 0) {
      return this.conversationHistory[this.conversationHistory.length - 1]
    }
    return null
  }

  // 신뢰도 계산
  calculateConfidence(intent, context) {
    let confidence = 0.5 // 기본 신뢰도
    
    if (intent !== 'general') confidence += 0.2
    if (context.hasQuestion) confidence += 0.1
    if (context.hasEmotion) confidence += 0.1
    if (this.knowledgeBase.has(intent)) confidence += 0.2
    
    return Math.min(confidence, 1.0)
  }
}

// 감정 분석기 클래스
class EmotionAnalyzer {
  constructor() {
    this.positiveWords = ['좋', '행복', '기쁘', '즐거', '만족', '감사', '사랑', '좋아']
    this.negativeWords = ['나쁘', '슬프', '화나', '짜증', '불만', '싫', '힘들', '우울']
    this.neutralWords = ['그냥', '보통', '괜찮', '그저', '일반']
  }

  analyze(message) {
    const messageLower = message.toLowerCase()
    
    const positiveCount = this.positiveWords.filter(word => messageLower.includes(word)).length
    const negativeCount = this.negativeWords.filter(word => messageLower.includes(word)).length
    const neutralCount = this.neutralWords.filter(word => messageLower.includes(word)).length
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      return 'positive'
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      return 'negative'
    } else {
      return 'neutral'
    }
  }

  hasEmotionWords(message) {
    const messageLower = message.toLowerCase()
    return this.positiveWords.some(word => messageLower.includes(word)) ||
           this.negativeWords.some(word => messageLower.includes(word))
  }
}

// 응답 생성기 클래스
class ResponseGenerator {
  generateFromKnowledge(knowledge, tone) {
    return this.applyTone(knowledge.answer, tone)
  }

  generateFromPattern(pattern, tone) {
    return this.applyTone(pattern, tone)
  }

  applyTone(response, tone) {
    const toneModifiers = {
      '친근하게': response,
      '공식적으로': `[공식적인 답변]\n${response}`,
      '간단하게': `[간단한 답변]\n${response}`,
      '전문적으로': `[전문적인 답변]\n${response}`
    }
    
    return toneModifiers[tone] || response
  }
}

module.exports = ChatbotAI
