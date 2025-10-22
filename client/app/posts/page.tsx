'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiEye, FiHeart, FiMessageSquare, FiCalendar, FiUser, FiTag, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import SearchBar from '../../components/SearchBar'

interface Post {
  _id: string
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
  updatedAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'tech', name: '기술' },
    { id: 'project', name: '프로젝트' },
    { id: 'update', name: '업데이트' }
  ]

  // API에서 포스트 데이터 가져오기
  const fetchPosts = async (page = 1, category = 'all', search = '') => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (category !== 'all') params.append('category', category)
      if (search) params.append('search', search)
      
      const response = await fetch(`http://localhost:5000/api/posts?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts)
        setFilteredPosts(data.posts)
        setTotalPages(data.totalPages)
        setCurrentPage(data.currentPage)
      } else {
        console.error('Failed to fetch posts:', data.message)
        // 에러 시 샘플 데이터 사용
        setPosts([])
        setFilteredPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
      setFilteredPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(currentPage, selectedCategory, searchQuery)
  }, [currentPage, selectedCategory, searchQuery])

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = posts

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
  }, [posts, activeFilters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // 삭제 성공 시 목록 새로고침
        fetchPosts(currentPage, selectedCategory, searchQuery)
      } else {
        const data = await response.json()
        alert('삭제 실패: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST'
      })

      if (response.ok) {
        // 좋아요 성공 시 목록 새로고침
        fetchPosts(currentPage, selectedCategory, searchQuery)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-800">
        <div className="container-custom py-16">
          <div className="text-center">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800">
      {/* 헤더 */}
      <div className="bg-white dark:bg-dark-900 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <FiArrowLeft size={20} className="mr-2" />
                홈으로
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                게시판
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FiPlus size={20} />
              <span>글쓰기</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* 검색 및 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* 포스트 헤더 */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* 수정 기능 */}}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="수정"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="삭제"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
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
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <FiHeart size={14} />
                        <span>{formatNumber(post.likes)}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <FiMessageSquare size={14} />
                        <span>{formatNumber(post.comments.length)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 읽기 버튼 */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/posts/${post._id}`}
                    className="w-full btn-outline py-2 text-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-200 inline-block text-center"
                  >
                    자세히 읽기
                  </Link>
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
              <FiMessageSquare size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              게시글을 찾을 수 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-600">
              검색어나 필터를 변경해보세요.
            </p>
          </motion.div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-2"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
