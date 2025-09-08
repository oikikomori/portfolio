'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiTag, FiCalendar, FiFolder } from 'react-icons/fi'
import SearchBar from './SearchBar'

interface Project {
  id: string
  title: string
  description: string
  content: string
  technologies: string[]
  images: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
  category: string
  startDate: string
  endDate: string
  status: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'web', name: '웹' },
    { id: 'mobile', name: '모바일' },
    { id: 'desktop', name: '데스크톱' },
    { id: 'other', name: '기타' }
  ]

  // 샘플 프로젝트 데이터
  const sampleProjects: Project[] = [
    {
      id: '1',
      title: '포트폴리오 웹사이트',
      description: 'Next.js와 Tailwind CSS를 활용한 반응형 포트폴리오 웹사이트',
      content: '개인 포트폴리오를 위한 현대적이고 아름다운 웹사이트입니다. Next.js의 App Router와 Tailwind CSS를 활용하여 구축했으며, 다크모드 지원과 반응형 디자인을 적용했습니다.',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/portfolio',
      liveUrl: 'https://portfolio.example.com',
      featured: true,
      category: 'web',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      status: 'completed'
    },
    {
      id: '2',
      title: 'E-커머스 플랫폼',
      description: '풀스택 E-커머스 웹 애플리케이션',
      content: '사용자 인증, 상품 관리, 결제 시스템을 포함한 완전한 E-커머스 플랫폼입니다. React 프론트엔드와 Node.js 백엔드, MongoDB 데이터베이스를 활용했습니다.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/ecommerce',
      liveUrl: 'https://ecommerce.example.com',
      featured: true,
      category: 'web',
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      status: 'completed'
    },
    {
      id: '3',
      title: '모바일 할일 앱',
      description: 'React Native로 개발한 크로스 플랫폼 할일 관리 앱',
      content: 'iOS와 Android 모두에서 동작하는 할일 관리 애플리케이션입니다. 로컬 저장소와 클라우드 동기화를 지원하며, 직관적인 사용자 인터페이스를 제공합니다.',
      technologies: ['React Native', 'TypeScript', 'AsyncStorage', 'Firebase'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/todo-app',
      liveUrl: null,
      featured: false,
      category: 'mobile',
      startDate: '2023-09-01',
      endDate: '2023-11-01',
      status: 'completed'
    },
    {
      id: '4',
      title: '실시간 채팅 앱',
      description: 'WebSocket을 활용한 실시간 채팅 애플리케이션',
      content: '실시간 메시지 전송과 수신이 가능한 채팅 애플리케이션입니다. WebSocket을 사용하여 실시간 통신을 구현했으며, 사용자 인증과 채팅방 관리 기능을 포함합니다.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/chat-app',
      liveUrl: 'https://chat.example.com',
      featured: false,
      category: 'web',
      startDate: '2023-03-01',
      endDate: '2023-05-01',
      status: 'completed'
    },
    {
      id: '5',
      title: '데스크톱 파일 관리자',
      description: 'Electron 기반의 현대적인 파일 관리 애플리케이션',
      content: '크로스 플랫폼 데스크톱 파일 관리자입니다. Electron과 React를 사용하여 구축했으며, 파일 탐색, 검색, 정렬 등의 기능을 제공합니다.',
      technologies: ['Electron', 'React', 'TypeScript', 'Node.js'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/file-manager',
      liveUrl: null,
      featured: false,
      category: 'desktop',
      startDate: '2023-01-01',
      endDate: '2023-04-01',
      status: 'completed'
    },
    {
      id: '6',
      title: 'AI 이미지 분석 도구',
      description: '머신러닝을 활용한 이미지 분석 및 분류 도구',
      content: 'TensorFlow.js를 사용하여 브라우저에서 실행되는 이미지 분석 도구입니다. 이미지 분류, 객체 감지, 얼굴 인식 등의 기능을 제공합니다.',
      technologies: ['TensorFlow.js', 'React', 'Canvas API', 'WebGL'],
      images: ['/api/placeholder/600/400'],
      githubUrl: 'https://github.com/example/ai-image-tool',
      liveUrl: 'https://ai-image.example.com',
      featured: true,
      category: 'other',
      startDate: '2023-07-01',
      endDate: '2023-10-01',
      status: 'completed'
    }
  ]

  useEffect(() => {
    // API에서 프로젝트 데이터 가져오기 (현재는 샘플 데이터 사용)
    setProjects(sampleProjects)
    setFilteredProjects(sampleProjects)
    setIsLoading(false)
  }, [])

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = projects

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.content.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      )
    }

    // 추가 필터들
    if (activeFilters.status && activeFilters.status !== 'all') {
      filtered = filtered.filter(project => project.status === activeFilters.status)
    }

    if (activeFilters.dateRange && activeFilters.dateRange !== 'all') {
      const now = new Date()
      filtered = filtered.filter(project => {
        const startDate = new Date(project.startDate)
        switch (activeFilters.dateRange) {
          case 'this-year':
            return startDate.getFullYear() === now.getFullYear()
          case 'last-year':
            return startDate.getFullYear() === now.getFullYear() - 1
          case 'this-month':
            return startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear()
          case 'last-month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
            return startDate.getMonth() === lastMonth.getMonth() && startDate.getFullYear() === lastMonth.getFullYear()
          default:
            return true
        }
      })
    }

    setFilteredProjects(filtered)
  }, [projects, selectedCategory, searchQuery, activeFilters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (isLoading) {
    return (
      <section id="projects" className="section-padding bg-white dark:bg-dark-900">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section-padding bg-white dark:bg-dark-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">프로젝트</span>를 소개합니다
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            다양한 기술을 활용하여 개발한 프로젝트들을 소개합니다.
            각 프로젝트는 사용자 경험과 코드 품질을 중시하여 개발되었습니다.
          </p>
        </motion.div>

        {/* 검색 및 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            placeholder="프로젝트를 검색하세요..."
            filters={activeFilters}
            className="max-w-4xl mx-auto"
          />
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* 검색 결과 표시 */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 dark:text-gray-400">
              "<span className="font-semibold text-primary-600 dark:text-primary-400">{searchQuery}</span>" 검색 결과: 
              <span className="font-semibold text-gray-800 dark:text-white ml-2">{filteredProjects.length}</span>개
            </p>
          </motion.div>
        )}

        {/* 프로젝트 그리드 */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group"
              >
                {/* 프로젝트 이미지 */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">프로젝트 이미지</span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* 프로젝트 정보 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {project.status === 'completed' ? '완료' : 
                       project.status === 'in-progress' ? '진행중' : '계획'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* 기술 스택 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-outline text-center py-2 text-sm"
                      >
                        <FiGithub className="inline mr-2" size={16} />
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-center py-2 text-sm"
                      >
                        <FiExternalLink className="inline mr-2" size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FiFolder size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              프로젝트를 찾을 수 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-600">
              검색어나 필터를 변경해보세요.
            </p>
          </motion.div>
        )}

        {/* 더 많은 프로젝트 보기 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center space-x-2"
          >
            <span>더 많은 프로젝트 보기</span>
            <FiGithub size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
