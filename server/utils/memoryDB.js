// 메모리 데이터베이스 (MongoDB 없이 사용)
class MemoryDB {
  constructor() {
    this.conversations = new Map()
    this.users = new Map()
    this.posts = new Map()
    this.projects = new Map()
    this.contacts = new Map()
  }

  // 대화 관련 메서드
  createConversation(sessionId, userId = 'anonymous') {
    const conversation = {
      sessionId,
      userId,
      messages: [{
        id: this.generateId(),
        content: '안녕하세요! 저는 AI 어시스턴트입니다. 메시지 작성, 번역, 톤 조절 등 다양한 기능을 도와드릴 수 있어요. 무엇을 도와드릴까요?',
        isUser: false,
        timestamp: new Date(),
        aiFeatures: {
          tone: '친근하게',
          emotion: 'positive',
          intent: 'greeting',
          confidence: 1.0
        }
      }],
      settings: {
        selectedTone: '친근하게',
        language: 'ko',
        isActive: true
      },
      statistics: {
        totalMessages: 1,
        userMessages: 0,
        aiMessages: 1,
        averageResponseTime: 0,
        mostUsedTone: '친근하게',
        lastActivity: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.conversations.set(sessionId, conversation)
    return conversation
  }

  getConversation(sessionId) {
    return this.conversations.get(sessionId)
  }

  addMessage(sessionId, messageData) {
    const conversation = this.conversations.get(sessionId)
    if (!conversation) {
      throw new Error('대화를 찾을 수 없습니다.')
    }

    const message = {
      id: this.generateId(),
      ...messageData,
      timestamp: new Date()
    }

    conversation.messages.push(message)
    conversation.statistics.totalMessages += 1
    
    if (messageData.isUser) {
      conversation.statistics.userMessages += 1
    } else {
      conversation.statistics.aiMessages += 1
    }
    
    conversation.statistics.lastActivity = new Date()
    conversation.updatedAt = new Date()

    return conversation
  }

  getConversationHistory(sessionId, limit = 50) {
    const conversation = this.conversations.get(sessionId)
    if (!conversation) {
      return []
    }

    return conversation.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .reverse()
  }

  updateConversationSettings(sessionId, settings) {
    const conversation = this.conversations.get(sessionId)
    if (!conversation) {
      throw new Error('대화를 찾을 수 없습니다.')
    }

    conversation.settings = { ...conversation.settings, ...settings }
    conversation.updatedAt = new Date()
    return conversation
  }

  getConversationStats(sessionId) {
    const conversation = this.conversations.get(sessionId)
    if (!conversation) {
      return null
    }

    return conversation.statistics
  }

  deleteConversation(sessionId) {
    return this.conversations.delete(sessionId)
  }

  getUserConversations(userId, limit = 20) {
    const userConversations = Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => new Date(b.statistics.lastActivity) - new Date(a.statistics.lastActivity))
      .slice(0, limit)

    return userConversations
  }

  analyzeConversation(sessionId) {
    const conversation = this.conversations.get(sessionId)
    if (!conversation) {
      return null
    }

    const messages = conversation.messages
    const analysis = {
      totalMessages: messages.length,
      userMessages: messages.filter(m => m.isUser).length,
      aiMessages: messages.filter(m => !m.isUser).length,
      averageMessageLength: messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length,
      emotionDistribution: this.analyzeEmotions(messages),
      intentDistribution: this.analyzeIntents(messages),
      toneDistribution: this.analyzeTones(messages),
      conversationDuration: this.calculateDuration(messages),
      mostActiveHour: this.findMostActiveHour(messages)
    }

    return analysis
  }

  analyzeEmotions(messages) {
    const emotions = { positive: 0, negative: 0, neutral: 0 }
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.emotion) {
        emotions[msg.aiFeatures.emotion] = (emotions[msg.aiFeatures.emotion] || 0) + 1
      }
    })
    
    return emotions
  }

  analyzeIntents(messages) {
    const intents = {}
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.intent) {
        intents[msg.aiFeatures.intent] = (intents[msg.aiFeatures.intent] || 0) + 1
      }
    })
    
    return intents
  }

  analyzeTones(messages) {
    const tones = {}
    
    messages.forEach(msg => {
      if (msg.aiFeatures && msg.aiFeatures.tone) {
        tones[msg.aiFeatures.tone] = (tones[msg.aiFeatures.tone] || 0) + 1
      }
    })
    
    return tones
  }

  calculateDuration(messages) {
    if (messages.length < 2) return 0
    
    const firstMessage = messages[0].timestamp
    const lastMessage = messages[messages.length - 1].timestamp
    
    return Math.floor((lastMessage - firstMessage) / 1000 / 60) // 분 단위
  }

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

  generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 기타 데이터베이스 메서드들 (기존 기능 호환)
  createPost(postData) {
    const post = {
      id: this.generateId(),
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.posts.set(post.id, post)
    return post
  }

  getPosts(limit = 10) {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }

  createProject(projectData) {
    const project = {
      id: this.generateId(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.projects.set(project.id, project)
    return project
  }

  getProjects(limit = 10) {
    return Array.from(this.projects.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }

  createContact(contactData) {
    const contact = {
      id: this.generateId(),
      ...contactData,
      createdAt: new Date()
    }
    this.contacts.set(contact.id, contact)
    return contact
  }

  getContacts() {
    return Array.from(this.contacts.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

module.exports = new MemoryDB()
