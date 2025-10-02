'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiHeart, FiMessageSquare, FiCalendar, FiUser, FiTag, FiFileText } from 'react-icons/fi'
import SearchBar from './SearchBar'

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  featured: boolean
  views: number
  likes: number
  comments: any[]
  createdAt: string
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'tech', name: '기술' },
    { id: 'project', name: '프로젝트' },
    { id: 'update', name: '업데이트' }
  ]

  // 샘플 포스트 데이터
  const samplePosts: Post[] = [
    {
      id: '1',
      title: 'Next.js 14 App Router 완벽 가이드',
      content: 'Next.js 14의 새로운 App Router에 대해 자세히 알아보고, 실제 프로젝트에 적용하는 방법을 설명합니다.',
      author: '승짱',
      category: 'tech',
      tags: ['Next.js', 'React', 'Web Development'],
      featured: true,
      views: 1250,
      likes: 89,
      comments: [],
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: '포트폴리오 웹사이트 개발 후기',
      content: '이번에 개발한 포트폴리오 웹사이트의 개발 과정과 사용한 기술, 그리고 배운 점들을 공유합니다.',
      author: '승짱',
      category: 'project',
      tags: ['Portfolio', 'Next.js', 'Tailwind CSS'],
      featured: true,
      views: 890,
      likes: 67,
      comments: [],
      createdAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      title: 'TypeScript와 함께하는 안전한 개발',
      content: 'TypeScript를 사용하여 개발할 때의 장점과 실제 프로젝트에서 활용하는 방법을 소개합니다.',
      author: '승짱',
      category: 'tech',
      tags: ['TypeScript', 'JavaScript', 'Development'],
      featured: false,
      views: 650,
      likes: 45,
      comments: [],
      createdAt: '2024-01-05T09:15:00Z'
    },
    {
      id: '4',
      title: '웹 개발자의 성장 로드맵',
      content: '웹 개발자로서 성장하기 위한 단계별 로드맵과 각 단계에서 학습해야 할 내용들을 정리했습니다.',
      author: '승짱',
      category: 'general',
      tags: ['Career', 'Web Development', 'Learning'],
      featured: false,
      views: 1200,
      likes: 78,
      comments: [],
      createdAt: '2024-01-01T16:45:00Z'
    },
    {
      id: '5',
      title: 'Tailwind CSS로 빠르게 UI 구축하기',
      content: 'Tailwind CSS를 사용하여 빠르고 효율적으로 UI를 구축하는 방법과 팁들을 공유합니다.',
      author: '승짱',
      category: 'tech',
      tags: ['Tailwind CSS', 'CSS', 'UI/UX'],
      featured: false,
      views: 750,
      likes: 52,
      comments: [],
      createdAt: '2023-12-28T11:20:00Z'
    },
    {
      id: '6',
      title: '프로젝트 관리 도구 비교 분석',
      content: 'Jira, Trello, Notion 등 다양한 프로젝트 관리 도구들의 장단점을 비교 분석해보았습니다.',
      author: '승짱',
      category: 'general',
      tags: ['Project Management', 'Tools', 'Productivity'],
      featured: false,
      views: 580,
      likes: 38,
      comments: [],
      createdAt: '2023-12-25T13:10:00Z'
    },
    {
      id: '7',
      title: 'React 18의 새로운 기능들',
      content: 'React 18에서 추가된 Concurrent Features, Suspense, Automatic Batching 등의 새로운 기능들을 자세히 살펴봅니다.',
      author: '승짱',
      category: 'tech',
      tags: ['React', 'React 18', 'Frontend'],
      featured: true,
      views: 980,
      likes: 73,
      comments: [],
      createdAt: '2023-12-20T15:45:00Z'
    },
    {
      id: '8',
      title: '성공적인 사이드 프로젝트 관리법',
      content: '본업과 병행하면서 사이드 프로젝트를 성공적으로 관리하고 완성하는 방법들을 공유합니다.',
      author: '승짱',
      category: 'general',
      tags: ['Side Project', 'Productivity', 'Time Management'],
      featured: false,
      views: 420,
      likes: 31,
      comments: [],
      createdAt: '2023-12-18T10:30:00Z'
    }
  ]

  useEffect(() => {
    // API에서 포스트 데이터 가져오기 (현재는 샘플 데이터 사용)
    setPosts(samplePosts)
    setFilteredPosts(samplePosts)
    setIsLoading(false)
  }, [])

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = posts

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 추가 필터들
    if (activeFilters.dateRange && activeFilters.dateRange !== 'all') {
      const now = new Date()
      filtered = filtered.filter(post => {
        const postDate = new Date(post.createdAt)
        switch (activeFilters.dateRange) {
          case 'this-year':
            return postDate.getFullYear() === now.getFullYear()
          case 'last-year':
            return postDate.getFullYear() === now.getFullYear() - 1
          case 'this-month':
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
          case 'last-month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
            return postDate.getMonth() === lastMonth.getMonth() && postDate.getFullYear() === lastMonth.getFullYear()
          default:
            return true
        }
      })
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchQuery, activeFilters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  if (isLoading) {
    return (
      <section id="posts" className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 border-r-primary-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                게시글을 불러오는 중...
              </h3>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="posts" className="section-padding bg-gray-50 dark:bg-dark-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">게시판</span>에서 정보를 공유합니다
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            개발 과정에서 배운 점들과 새로운 기술에 대한 정보를 공유합니다.
            함께 성장하고 지식을 나누는 공간입니다.
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
            placeholder="게시글을 검색하세요..."
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
                  : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
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
              <span className="font-semibold text-gray-800 dark:text-white ml-2">{filteredPosts.length}</span>개
            </p>
          </motion.div>
        )}

        {/* 포스트 그리드 */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* 포스트 헤더 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.featured && (
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full font-medium">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.category === 'tech' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      post.category === 'project' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      post.category === 'update' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {post.category === 'tech' ? '기술' :
                       post.category === 'project' ? '프로젝트' :
                       post.category === 'update' ? '업데이트' : '일반'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs rounded-md flex items-center gap-1"
                      >
                        <FiTag size={12} />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <FiUser size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* 통계 */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiEye size={14} />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiHeart size={14} />
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMessageSquare size={14} />
                        <span>{formatNumber(post.comments.length)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 읽기 버튼 */}
                <div className="px-6 pb-6">
                  <button className="w-full btn-outline py-2 text-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-200">
                    자세히 읽기
                  </button>
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
              <FiFileText size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              게시글을 찾을 수 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-600">
              검색어나 필터를 변경해보세요.
            </p>
          </motion.div>
        )}

        {/* 더 많은 포스트 보기 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="btn-primary inline-flex items-center space-x-2">
            <span>더 많은 포스트 보기</span>
            <FiMessageSquare size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
