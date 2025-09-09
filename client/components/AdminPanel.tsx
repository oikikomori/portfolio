'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiFileText, FiFolder, FiMessageSquare, FiSettings, FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiX } from 'react-icons/fi'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface Stats {
  totalUsers: number
  totalProjects: number
  totalPosts: number
  totalContacts: number
  activeUsers: number
  pendingContacts: number
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalPosts: 0,
    totalContacts: 0,
    activeUsers: 0,
    pendingContacts: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  const tabs = [
    { id: 'dashboard', name: '대시보드', icon: FiSettings },
    { id: 'users', name: '사용자 관리', icon: FiUsers },
    { id: 'projects', name: '프로젝트 관리', icon: FiFolder },
    { id: 'posts', name: '게시글 관리', icon: FiFileText },
    { id: 'contacts', name: '연락처 관리', icon: FiMessageSquare }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchStats()
    }
  }, [isOpen])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // 실제 API 호출로 대체
      const mockStats: Stats = {
        totalUsers: 156,
        totalProjects: 23,
        totalPosts: 89,
        totalContacts: 45,
        activeUsers: 142,
        pendingContacts: 12
      }
      setStats(mockStats)
    } catch (error) {
      console.error('통계 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const DashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 사용자</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FiUsers className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">+12%</span>
            <span className="ml-2">이번 달</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 프로젝트</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <FiFolder className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">+5%</span>
            <span className="ml-2">이번 달</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 게시글</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <FiFileText className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">+8%</span>
            <span className="ml-2">이번 달</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 사용자</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <FiUsers className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">+15%</span>
            <span className="ml-2">이번 주</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">대기 중 연락처</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingContacts}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <FiMessageSquare className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="text-red-600 dark:text-red-400">+3</span>
            <span className="ml-2">새로운</span>
          </div>
        </motion.div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 활동</h3>
        <div className="space-y-3">
          {[
            { action: '새 사용자 가입', user: '김개발', time: '5분 전' },
            { action: '프로젝트 업데이트', user: '김개발', time: '1시간 전' },
            { action: '새 게시글 작성', user: '김개발', time: '2시간 전' },
            { action: '연락처 메시지 수신', user: '방문자', time: '3시간 전' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-600 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                <span className="text-primary-600 dark:text-primary-400">{activity.user}</span>
                <span className="mx-2">•</span>
                {activity.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">사용자 관리</h3>
        <button className="btn-primary flex items-center space-x-2">
          <FiPlus size={16} />
          <span>새 사용자</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">사용자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">역할</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">가입일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
              {[
                { username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', joined: '2024-01-01' },
                { username: 'user1', email: 'user1@example.com', role: 'user', status: 'active', joined: '2024-01-15' },
                { username: 'user2', email: 'user2@example.com', role: 'user', status: 'inactive', joined: '2024-02-01' }
              ].map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-600">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '사용자'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {user.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        <FiEdit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'users':
        return <UsersTab />
      case 'projects':
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">프로젝트 관리 기능 준비 중...</div>
      case 'posts':
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">게시글 관리 기능 준비 중...</div>
      case 'contacts':
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">연락처 관리 기능 준비 중...</div>
      default:
        return <DashboardTab />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block w-full max-w-6xl bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
            >
              {/* 헤더 */}
              <div className="bg-primary-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">관리자 패널</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <div className="border-b border-gray-200 dark:border-dark-600">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <tab.icon size={16} />
                        <span>{tab.name}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="px-6 py-6 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  renderTabContent()
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
