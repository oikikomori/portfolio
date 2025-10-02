'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Posts from '../components/Posts'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로딩 시뮬레이션 (멋있는 로딩 효과를 위해 시간 연장)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-800 relative overflow-hidden">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-white/8 rounded-full animate-ping"></div>
        </div>
        
        {/* 메인 로딩 컨텐츠 */}
        <div className="text-center text-white relative z-10">
          {/* 로고/아이콘 */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                {/* 외부 원 */}
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                {/* 회전하는 원 */}
                <div className="absolute inset-0 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                {/* 내부 원 */}
                <div className="absolute inset-2 border-2 border-white/40 rounded-full"></div>
                {/* 중앙 점 */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
          
          {/* 텍스트 애니메이션 */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent animate-pulse">
              Okuma
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-white/90">
              포트폴리오
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-white/70 text-sm mt-4">
              로딩 중...
            </p>
          </div>
          
          {/* 프로그레스 바 */}
          <div className="mt-8 w-64 mx-auto">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div className="bg-gradient-to-r from-white to-blue-200 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
        
        {/* 하단 파티클 효과 */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Posts />
      <Contact />
      <Footer />
    </main>
  )
}
