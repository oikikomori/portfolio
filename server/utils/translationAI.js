// 번역 AI 클래스
class TranslationAI {
  constructor() {
    this.dictionaries = new Map() // 사전 데이터
    this.grammarRules = new Map() // 문법 규칙
    this.languagePatterns = new Map() // 언어 패턴
    this.initializeDictionaries()
    this.initializeGrammarRules()
    this.initializeLanguagePatterns()
  }

  // 메인 번역 함수
  async translate(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // 1. 언어 감지
      const detectedLanguage = sourceLanguage === 'auto' ? 
        this.detectLanguage(text) : sourceLanguage

      // 2. 전처리
      const preprocessedText = this.preprocess(text)

      // 3. 문장 분리
      const sentences = this.splitSentences(preprocessedText)

      // 4. 번역 실행
      const translatedSentences = []
      for (const sentence of sentences) {
        const translated = await this.translateSentence(sentence, detectedLanguage, targetLanguage)
        translatedSentences.push(translated)
      }

      // 5. 후처리
      const finalTranslation = this.postprocess(translatedSentences.join(' '))

      return {
        success: true,
        originalText: text,
        translatedText: finalTranslation,
        sourceLanguage: detectedLanguage,
        targetLanguage: targetLanguage,
        confidence: this.calculateTranslationConfidence(text, finalTranslation)
      }

    } catch (error) {
      console.error('번역 AI 오류:', error)
      return {
        success: false,
        error: '번역 중 오류가 발생했습니다.',
        details: error.message
      }
    }
  }

  // 언어 감지
  detectLanguage(text) {
    const languagePatterns = {
      korean: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
      english: /[a-zA-Z]/,
      japanese: /[ひらがな|カタカナ|漢字]/,
      chinese: /[一-龯]/,
      spanish: /[ñáéíóúü]/,
      french: /[àâäéèêëïîôöùûüÿç]/,
      german: /[äöüß]/
    }

    for (const [language, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return language
      }
    }

    return 'english' // 기본값
  }

  // 전처리
  preprocess(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ') // 여러 공백을 하나로
      .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ.,!?]/g, '') // 특수문자 제거 (일부 제외)
  }

  // 문장 분리
  splitSentences(text) {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  }

  // 문장 번역
  async translateSentence(sentence, sourceLang, targetLang) {
    // 1. 단어별 번역
    const words = sentence.split(' ')
    const translatedWords = []

    for (const word of words) {
      const translated = this.translateWord(word, sourceLang, targetLang)
      translatedWords.push(translated)
    }

    // 2. 문법 규칙 적용
    const grammarCorrected = this.applyGrammarRules(translatedWords, targetLang)

    // 3. 언어 패턴 적용
    const patternApplied = this.applyLanguagePatterns(grammarCorrected, targetLang)

    return patternApplied
  }

  // 단어 번역
  translateWord(word, sourceLang, targetLang) {
    const key = `${sourceLang}-${targetLang}`
    const dictionary = this.dictionaries.get(key) || new Map()

    // 직접 번역
    if (dictionary.has(word.toLowerCase())) {
      return dictionary.get(word.toLowerCase())
    }

    // 유사 단어 검색
    const similarWord = this.findSimilarWord(word, dictionary)
    if (similarWord) {
      return similarWord
    }

    // 패턴 기반 번역
    return this.translateByPattern(word, sourceLang, targetLang)
  }

  // 유사 단어 찾기
  findSimilarWord(word, dictionary) {
    const wordLower = word.toLowerCase()
    
    for (const [dictWord, translation] of dictionary.entries()) {
      if (this.calculateSimilarity(wordLower, dictWord) > 0.7) {
        return translation
      }
    }
    
    return null
  }

  // 유사도 계산 (간단한 레벤슈타인 거리)
  calculateSimilarity(str1, str2) {
    const matrix = []
    const len1 = str1.length
    const len2 = str2.length

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    const distance = matrix[len2][len1]
    return 1 - (distance / Math.max(len1, len2))
  }

  // 패턴 기반 번역
  translateByPattern(word, sourceLang, targetLang) {
    const patterns = this.languagePatterns.get(`${sourceLang}-${targetLang}`)
    if (!patterns) return word

    for (const [pattern, replacement] of patterns.entries()) {
      if (new RegExp(pattern).test(word)) {
        return word.replace(new RegExp(pattern), replacement)
      }
    }

    return word // 번역할 수 없으면 원본 반환
  }

  // 문법 규칙 적용
  applyGrammarRules(words, targetLang) {
    const rules = this.grammarRules.get(targetLang)
    if (!rules) return words.join(' ')

    let result = words.join(' ')

    for (const [rule, replacement] of rules.entries()) {
      result = result.replace(new RegExp(rule, 'g'), replacement)
    }

    return result
  }

  // 언어 패턴 적용
  applyLanguagePatterns(text, targetLang) {
    const patterns = this.languagePatterns.get(targetLang)
    if (!patterns) return text

    let result = text

    for (const [pattern, replacement] of patterns.entries()) {
      result = result.replace(new RegExp(pattern, 'g'), replacement)
    }

    return result
  }

  // 후처리
  postprocess(text) {
    return text
      .replace(/\s+/g, ' ') // 여러 공백을 하나로
      .trim()
      .replace(/([.!?])\s*([a-z])/g, '$1 $2') // 문장 시작 대문자
      .replace(/\s*([.!?])/g, '$1') // 구두점 앞 공백 제거
  }

  // 번역 신뢰도 계산
  calculateTranslationConfidence(original, translated) {
    const originalWords = original.split(' ').length
    const translatedWords = translated.split(' ').length
    
    // 단어 수가 비슷하면 높은 신뢰도
    const wordRatio = Math.min(originalWords, translatedWords) / Math.max(originalWords, translatedWords)
    
    // 길이 차이가 적으면 높은 신뢰도
    const lengthRatio = Math.min(original.length, translated.length) / Math.max(original.length, translated.length)
    
    return (wordRatio + lengthRatio) / 2
  }

  // 사전 초기화
  initializeDictionaries() {
    // 한국어-영어 사전
    const koEnDict = new Map([
      ['안녕', 'hello'],
      ['감사', 'thank you'],
      ['좋은', 'good'],
      ['나쁜', 'bad'],
      ['사랑', 'love'],
      ['친구', 'friend'],
      ['가족', 'family'],
      ['학교', 'school'],
      ['집', 'home'],
      ['음식', 'food']
    ])
    this.dictionaries.set('korean-english', koEnDict)

    // 영어-한국어 사전
    const enKoDict = new Map([
      ['hello', '안녕'],
      ['thank you', '감사'],
      ['good', '좋은'],
      ['bad', '나쁜'],
      ['love', '사랑'],
      ['friend', '친구'],
      ['family', '가족'],
      ['school', '학교'],
      ['home', '집'],
      ['food', '음식']
    ])
    this.dictionaries.set('english-korean', enKoDict)

    // 한국어-일본어 사전
    const koJaDict = new Map([
      ['안녕', 'こんにちは'],
      ['감사', 'ありがとう'],
      ['좋은', '良い'],
      ['나쁜', '悪い'],
      ['사랑', '愛'],
      ['친구', '友達'],
      ['가족', '家族'],
      ['학교', '学校'],
      ['집', '家'],
      ['음식', '食べ物']
    ])
    this.dictionaries.set('korean-japanese', koJaDict)
  }

  // 문법 규칙 초기화
  initializeGrammarRules() {
    // 영어 문법 규칙
    const englishRules = new Map([
      ['\\b(he|she|it)\\s+(is|was)\\b', '$1 $2'],
      ['\\b(I|you|we|they)\\s+(am|are|were)\\b', '$1 $2'],
      ['\\b(do|does|did)\\s+not\\b', "$1n't"],
      ['\\b(will|would)\\s+not\\b', "$1n't"]
    ])
    this.grammarRules.set('english', englishRules)

    // 한국어 문법 규칙
    const koreanRules = new Map([
      ['\\b(이|가)\\s+(입니다|이에요)\\b', '$1 $2'],
      ['\\b(을|를)\\s+(합니다|해요)\\b', '$1 $2'],
      ['\\b(에|에서)\\s+(있습니다|있어요)\\b', '$1 $2']
    ])
    this.grammarRules.set('korean', koreanRules)
  }

  // 언어 패턴 초기화
  initializeLanguagePatterns() {
    // 한국어-영어 패턴
    const koEnPatterns = new Map([
      ['입니다$', ' is'],
      ['이에요$', ' is'],
      ['해요$', ' do'],
      ['있어요$', ' have'],
      ['좋아요$', ' good'],
      ['나빠요$', ' bad']
    ])
    this.languagePatterns.set('korean-english', koEnPatterns)

    // 영어-한국어 패턴
    const enKoPatterns = new Map([
      ['\\bis\\b', '입니다'],
      ['\\bam\\b', '입니다'],
      ['\\bare\\b', '입니다'],
      ['\\bdo\\b', '해요'],
      ['\\bhave\\b', '있어요'],
      ['\\bgood\\b', '좋아요'],
      ['\\bbad\\b', '나빠요']
    ])
    this.languagePatterns.set('english-korean', enKoPatterns)
  }
}

module.exports = TranslationAI
