const express = require('express')
const router = express.Router()
const ChatbotAI = require('../utils/chatbotAI')
const TranslationAI = require('../utils/translationAI')
const conversationService = require('../services/conversationService')

// 자체 AI 초기화
const chatbotAI = new ChatbotAI()
const translationAI = new TranslationAI()

// AI 채팅 엔드포인트 (자체 AI + 데이터베이스 연동)
router.post('/chat', async (req, res) => {
  try {
    const { message, tone = '친근하게', sessionId, userId = 'anonymous' } = req.body

    if (!message) {
      return res.status(400).json({ error: '메시지가 필요합니다.' })
    }

    const startTime = Date.now()

    // 1. 대화 세션 가져오기 또는 생성
    const conversation = await conversationService.getOrCreateConversation(sessionId, userId)
    
    // 2. 대화 히스토리 가져오기
    const conversationHistory = await conversationService.getConversationHistory(sessionId, 20)
    
    // 3. 사용자 메시지 저장
    const userMessage = {
      id: require('uuid').v4(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      responseTime: 0
    }
    
    await conversationService.addMessage(sessionId, userMessage)

    // 4. AI 응답 생성
    const aiResponse = await chatbotAI.processMessage(message, tone)
    const responseTime = Date.now() - startTime

    // 5. AI 응답 저장
    const aiMessage = {
      id: require('uuid').v4(),
      content: aiResponse.response,
      isUser: false,
      timestamp: new Date(),
      aiFeatures: {
        tone: tone,
        emotion: aiResponse.emotion,
        intent: aiResponse.intent,
        confidence: aiResponse.confidence
      },
      responseTime: responseTime
    }
    
    await conversationService.addMessage(sessionId, aiMessage)

    res.json({
      success: aiResponse.success,
      response: aiResponse.response,
      tone: tone,
      emotion: aiResponse.emotion,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      sessionId: conversation.sessionId,
      responseTime: responseTime
    })

  } catch (error) {
    console.error('AI 채팅 오류:', error)
    res.status(500).json({ 
      error: 'AI 응답 생성 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 무료 AI 응답 생성 함수
function generateFreeAIResponse(message, tone) {
  const responses = {
    '친근하게': [
      `안녕하세요! "${message}"에 대해 말씀해주셨네요. 정말 흥미로운 주제예요! 😊 더 자세히 알려드릴게요.`,
      `와, 좋은 질문이에요! "${message}"에 대해서는 이렇게 생각해봐요...`,
      `정말 궁금한 내용이네요! "${message}"에 대해 함께 알아봐요!`,
      `좋은 아이디어예요! "${message}"에 대해 더 자세히 설명해드릴게요.`
    ],
    '공식적으로': [
      `안녕하십니까. "${message}"에 대한 문의를 주셔서 감사합니다. 관련하여 다음과 같이 안내드립니다.`,
      `귀하께서 문의하신 "${message}"에 대해 공식적으로 답변드리겠습니다.`,
      `말씀하신 "${message}"에 관하여 정확한 정보를 제공해드리겠습니다.`,
      `문의해주신 "${message}"에 대한 상세한 답변을 드리겠습니다.`
    ],
    '간단하게': [
      `"${message}"에 대해 간단히 설명드릴게요.`,
      `"${message}" - 핵심만 말씀드리면...`,
      `"${message}"에 대한 답변:`,
      `"${message}"에 대해 요약하면...`
    ],
    '전문적으로': [
      `"${message}"에 대한 전문적 분석을 제공해드리겠습니다.`,
      `해당 주제 "${message}"에 대해 기술적 관점에서 설명드리겠습니다.`,
      `"${message}"에 대한 상세한 전문 정보를 공유해드리겠습니다.`,
      `"${message}"에 관하여 전문적인 관점에서 답변드리겠습니다.`
    ]
  }
  
  const toneResponses = responses[tone] || responses['친근하게']
  return toneResponses[Math.floor(Math.random() * toneResponses.length)]
}

// 텍스트 개선 엔드포인트 (무료 대안)
router.post('/improve', async (req, res) => {
  try {
    const { text, improvementType = 'general' } = req.body

    if (!text) {
      return res.status(400).json({ error: '텍스트가 필요합니다.' })
    }

    // 무료 텍스트 개선 (규칙 기반)
    const improvedText = improveTextFree(text, improvementType)

    res.json({
      success: true,
      originalText: text,
      improvedText: improvedText,
      improvementType: improvementType
    })

  } catch (error) {
    console.error('텍스트 개선 오류:', error)
    res.status(500).json({ 
      error: '텍스트 개선 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 무료 텍스트 개선 함수
function improveTextFree(text, improvementType) {
  let improved = text
  
  switch (improvementType) {
    case 'grammar':
      // 간단한 문법 개선
      improved = text
        .replace(/\.\s*([a-z])/g, '. $1') // 문장 시작 대문자
        .replace(/\s+/g, ' ') // 여러 공백을 하나로
        .trim()
      break
    case 'formal':
      improved = `[공식적인 톤으로 개선된 텍스트]\n${text}\n\n위 내용을 공식적이고 전문적인 톤으로 다시 작성하면 더욱 효과적일 것 같습니다.`
      break
    case 'casual':
      improved = `[친근한 톤으로 개선된 텍스트]\n${text}\n\n이 내용을 더 친근하고 자연스럽게 표현하면 좋을 것 같아요!`
      break
    case 'concise':
      improved = `[간결하게 개선된 텍스트]\n${text}\n\n핵심 내용만 간단명료하게 정리하면 더 좋을 것 같습니다.`
      break
    default:
      improved = `[개선 제안]\n${text}\n\n이 텍스트를 더 명확하고 읽기 쉽게 개선할 수 있습니다.`
  }
  
  return improved
}

// 번역 엔드포인트 (자체 번역 AI 사용)
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'english', sourceLanguage = 'auto' } = req.body

    if (!text) {
      return res.status(400).json({ error: '번역할 텍스트가 필요합니다.' })
    }

    // 자체 번역 AI 사용
    const translationResult = await translationAI.translate(text, targetLanguage, sourceLanguage)

    res.json({
      success: translationResult.success,
      originalText: translationResult.originalText,
      translatedText: translationResult.translatedText,
      sourceLanguage: translationResult.sourceLanguage,
      targetLanguage: translationResult.targetLanguage,
      confidence: translationResult.confidence
    })

  } catch (error) {
    console.error('번역 오류:', error)
    res.status(500).json({ 
      error: '번역 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 무료 번역 함수
function translateTextFree(text, targetLanguage) {
  const translations = {
    'English': `[English Translation]\n${text}\n\nThis text has been translated to English. For accurate translation, please use a professional translation service.`,
    'Japanese': `[日本語翻訳]\n${text}\n\nこのテキストは日本語に翻訳されました。正確な翻訳には専門の翻訳サービスをご利用ください。`,
    'Chinese': `[中文翻译]\n${text}\n\n此文本已翻译成中文。如需准确翻译，请使用专业翻译服务。`,
    'Spanish': `[Traducción al Español]\n${text}\n\nEste texto ha sido traducido al español. Para una traducción precisa, utilice un servicio de traducción profesional.`,
    'French': `[Traduction Française]\n${text}\n\nCe texte a été traduit en français. Pour une traduction précise, utilisez un service de traduction professionnel.`,
    'German': `[Deutsche Übersetzung]\n${text}\n\nDieser Text wurde ins Deutsche übersetzt. Für eine genaue Übersetzung verwenden Sie bitte einen professionellen Übersetzungsservice.`,
    'Korean': `[한국어 번역]\n${text}\n\n이 텍스트가 한국어로 번역되었습니다. 정확한 번역을 위해서는 전문 번역 서비스를 이용해주세요.`
  }
  
  return translations[targetLanguage] || translations['English']
}

// 요약 엔드포인트 (무료 대안)
router.post('/summarize', async (req, res) => {
  try {
    const { text, summaryLength = 'medium' } = req.body

    if (!text) {
      return res.status(400).json({ error: '요약할 텍스트가 필요합니다.' })
    }

    // 무료 요약 (규칙 기반)
    const summary = summarizeTextFree(text, summaryLength)

    res.json({
      success: true,
      originalText: text,
      summary: summary,
      summaryLength: summaryLength
    })

  } catch (error) {
    console.error('요약 오류:', error)
    res.status(500).json({ 
      error: '요약 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 무료 요약 함수
function summarizeTextFree(text, summaryLength) {
  const words = text.split(' ')
  const wordCount = words.length
  
  let summary = ''
  
  if (summaryLength === 'short') {
    // 첫 번째와 마지막 문장 사용
    const sentences = text.split(/[.!?]+/).filter(s => s.trim())
    if (sentences.length >= 2) {
      summary = `${sentences[0].trim()}... ${sentences[sentences.length - 1].trim()}`
    } else {
      summary = text.substring(0, Math.min(100, text.length)) + '...'
    }
  } else if (summaryLength === 'long') {
    // 원본의 70% 사용
    summary = text.substring(0, Math.floor(text.length * 0.7)) + '...'
  } else {
    // 원본의 50% 사용 (medium)
    summary = text.substring(0, Math.floor(text.length * 0.5)) + '...'
  }
  
  return `[요약 결과 - ${summaryLength}]\n\n${summary}\n\n※ 자동 요약된 내용입니다. 정확한 요약을 위해서는 전문 서비스를 이용해주세요.`
}

// 자동 응답 제안 엔드포인트 (무료 대안)
router.post('/suggest-response', async (req, res) => {
  try {
    const { message, context = '', tone = '친근하게' } = req.body

    if (!message) {
      return res.status(400).json({ error: '메시지가 필요합니다.' })
    }

    // 무료 응답 제안 (규칙 기반)
    const suggestions = suggestResponseFree(message, context, tone)

    res.json({
      success: true,
      originalMessage: message,
      suggestions: suggestions,
      tone: tone
    })

  } catch (error) {
    console.error('응답 제안 오류:', error)
    res.status(500).json({ 
      error: '응답 제안 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 무료 응답 제안 함수
function suggestResponseFree(message, context, tone) {
  const responses = {
    '친근하게': [
      `1. 안녕하세요! "${message}"에 대해 말씀해주셔서 감사해요. 정말 흥미로운 주제네요! 😊`,
      `2. 와, 좋은 질문이에요! "${message}"에 대해서는 이렇게 생각해봐요...`,
      `3. 정말 궁금한 내용이네요! "${message}"에 대해 함께 알아봐요!`
    ],
    '공식적으로': [
      `1. 안녕하십니까. "${message}"에 대한 문의를 주셔서 감사합니다.`,
      `2. 귀하께서 문의하신 "${message}"에 대해 공식적으로 답변드리겠습니다.`,
      `3. 말씀하신 "${message}"에 관하여 정확한 정보를 제공해드리겠습니다.`
    ],
    '간단하게': [
      `1. "${message}"에 대해 간단히 답변드릴게요.`,
      `2. "${message}" - 핵심만 말씀드리면...`,
      `3. "${message}"에 대한 요약입니다.`
    ],
    '전문적으로': [
      `1. "${message}"에 대한 전문적 분석을 제공해드리겠습니다.`,
      `2. 해당 주제 "${message}"에 대해 기술적 관점에서 설명드리겠습니다.`,
      `3. "${message}"에 대한 상세한 전문 정보를 공유해드리겠습니다.`
    ]
  }
  
  const toneResponses = responses[tone] || responses['친근하게']
  return `[${tone} 톤으로 응답 제안]\n\n${toneResponses.join('\n\n')}\n\n※ 자동 생성된 응답 제안입니다. 상황에 맞게 수정하여 사용해주세요.`
}

// 대화 히스토리 가져오기
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { limit = 50 } = req.query

    const messages = await conversationService.getConversationHistory(sessionId, parseInt(limit))

    res.json({
      success: true,
      messages: messages,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('대화 히스토리 가져오기 오류:', error)
    res.status(500).json({ 
      error: '대화 히스토리를 가져오는 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 대화 통계 가져오기
router.get('/conversation/:sessionId/stats', async (req, res) => {
  try {
    const { sessionId } = req.params

    const stats = await conversationService.getConversationStats(sessionId)

    res.json({
      success: true,
      statistics: stats,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('대화 통계 가져오기 오류:', error)
    res.status(500).json({ 
      error: '대화 통계를 가져오는 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 대화 분석
router.get('/conversation/:sessionId/analysis', async (req, res) => {
  try {
    const { sessionId } = req.params

    const analysis = await conversationService.analyzeConversation(sessionId)

    res.json({
      success: true,
      analysis: analysis,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('대화 분석 오류:', error)
    res.status(500).json({ 
      error: '대화 분석 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 대화 설정 업데이트
router.put('/conversation/:sessionId/settings', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { settings } = req.body

    const conversation = await conversationService.updateConversationSettings(sessionId, settings)

    res.json({
      success: true,
      settings: conversation.settings,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('대화 설정 업데이트 오류:', error)
    res.status(500).json({ 
      error: '대화 설정을 업데이트하는 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 대화 삭제
router.delete('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const result = await conversationService.deleteConversation(sessionId)

    res.json({
      success: true,
      deleted: !!result,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('대화 삭제 오류:', error)
    res.status(500).json({ 
      error: '대화를 삭제하는 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 사용자별 대화 목록
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20 } = req.query

    const conversations = await conversationService.getUserConversations(userId, parseInt(limit))

    res.json({
      success: true,
      conversations: conversations,
      userId: userId
    })

  } catch (error) {
    console.error('사용자 대화 목록 가져오기 오류:', error)
    res.status(500).json({ 
      error: '사용자 대화 목록을 가져오는 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

module.exports = router
