'use client'

import { motion } from 'framer-motion'
import { FiCode, FiDatabase, FiServer, FiSmartphone, FiCloud } from 'react-icons/fi'

export default function Skills() {
  const skillCategories = [
    {
      icon: FiCode,
      title: '프론트엔드',
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React', level: 90 },
        { name: 'Next.js', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'JavaScript', level: 95 },
        { name: 'HTML/CSS', level: 95 }
      ]
    },
    {
      icon: FiServer,
      title: '백엔드',
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 80 },
        { name: 'Python', level: 75 },
        { name: 'Django', level: 70 },
        { name: 'Java', level: 65 },
        { name: 'Spring Boot', level: 60 }
      ]
    },
    {
      icon: FiDatabase,
      title: '데이터베이스',
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'MongoDB', level: 80 },
        { name: 'PostgreSQL', level: 75 },
        { name: 'MySQL', level: 70 },
        { name: 'Redis', level: 65 },
        { name: 'Firebase', level: 70 }
      ]
    },
    {
      icon: FiCloud,
      title: 'DevOps & Cloud',
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Docker', level: 75 },
        { name: 'AWS', level: 70 },
        { name: 'Git', level: 90 },
        { name: 'CI/CD', level: 65 },
        { name: 'Linux', level: 80 }
      ]
    },
    {
      icon: FiSmartphone,
      title: '모바일 & 기타',
      color: 'from-indigo-500 to-purple-500',
      skills: [
        { name: 'React Native', level: 70 },
        { name: 'Flutter', level: 60 },
        { name: 'GraphQL', level: 75 },
        { name: 'REST API', level: 85 },
        { name: 'WebSocket', level: 70 }
      ]
    }
  ]

  return (
    <section id="skills" className="section-padding bg-gray-50 dark:bg-dark-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">기술 스택</span>을 소개합니다
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            다양한 프론트엔드 기술을 학습하고 적용하여 프론트엔드 개발자로서의 역량을 키워왔습니다.
            각 기술에 대한 숙련도와 경험을 바탕으로 사용자 경험에 최적화된 솔루션을 제공합니다.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              {/* 카테고리 헤더 */}
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {category.title}
                </h3>
              </div>

              {/* 스킬 리스트 */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: skillIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: skillIndex * 0.05 }}
                        viewport={{ once: true }}
                        className={`h-2 bg-gradient-to-r ${category.color} rounded-full transition-all duration-300`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              지속적인 학습과 성장
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              기술의 발전 속도가 빠른 IT 업계에서 항상 최신 트렌드를 파악하고 학습하고 있습니다. 
              새로운 프레임워크나 라이브러리를 빠르게 습득하여 프로젝트에 적용하는 것에 익숙하며, 
              코드 품질과 성능 최적화에 대한 지속적인 개선을 추구합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full">Agile/Scrum</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full">TDD</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full">Clean Code</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full">Microservices</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full">API Design</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
