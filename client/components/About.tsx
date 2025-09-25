'use client'

import { motion } from 'framer-motion'
import { FiUser, FiCode, FiHeart, FiTarget } from 'react-icons/fi'

export default function About() {
  const features = [
    {
      icon: FiUser,
      title: '사용자 중심',
      description: '사용자의 니즈를 최우선으로 생각하며 직관적인 인터페이스를 설계합니다.'
    },
    {
      icon: FiCode,
      title: '깔끔한 코드',
      description: '가독성과 유지보수성을 고려한 깔끔하고 효율적인 코드를 작성합니다.'
    },
    {
      icon: FiHeart,
      title: '열정적인 개발',
      description: '새로운 기술을 배우고 적용하는 것에 대한 끊임없는 열정을 가지고 있습니다.'
    },
    {
      icon: FiTarget,
      title: '목표 지향적',
      description: '명확한 목표를 설정하고 체계적으로 프로젝트를 진행합니다.'
    }
  ]

  return (
    <section id="about" className="section-padding bg-white dark:bg-dark-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">저에 대해</span> 알아보세요
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            프론트엔드 개발자로서 사용자 인터페이스와 경험에 특화된 개발을 하고 있습니다.
            React, Next.js 등 최신 프론트엔드 기술을 활용하여 반응형이고 직관적인 웹 애플리케이션을 만듭니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* 왼쪽: 개인 정보 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              안녕하세요, 저는 <span className="text-gradient">승짱</span>입니다
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              3년간의 프론트엔드 개발 경험을 바탕으로 사용자 중심의 웹 애플리케이션을 개발하고 있습니다. 
              React, Next.js, TypeScript, Tailwind CSS 등 최신 프론트엔드 기술을 활용하여 프로젝트를 진행하며, 
              지속적인 학습과 개선을 통해 더 나은 프론트엔드 개발자가 되기 위해 노력하고 있습니다.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              팀워크를 중시하며, 다른 개발자들과의 협업을 통해 더 나은 결과물을 만들어내는 것을 좋아합니다. 
              새로운 도전을 두려워하지 않고, 문제 해결을 위한 창의적인 접근 방식을 추구합니다.
            </p>
            
            {/* 개인 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">이름</div>
                <div className="font-semibold">승짱</div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">경력</div>
                <div className="font-semibold">5년</div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">직함</div>
                <div className="font-semibold">프론트엔드 개발자</div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">지역</div>
                <div className="font-semibold">서울</div>
              </div>
            </div>
          </motion.div>

          {/* 오른쪽: 특징 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-dark-800 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 기술 스택 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            기술 스택
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* 프론트엔드 기술 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">프론트엔드</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">React</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">70%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Next.js</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">70%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">TypeScript</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">85%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>

            {/* 스타일링 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-4">스타일링</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Tailwind CSS</span>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">90%</span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">CSS3</span>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">99%</span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '99%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">SCSS</span>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">80%</span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>

            {/* 상태 관리 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4">상태 관리</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 dark:text-green-300">Redmine</span>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">85%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 dark:text-green-300">Confluence</span>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">80%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 dark:text-green-300">Jira</span>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">80%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>

            {/* 도구 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-4">도구</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700 dark:text-orange-300">Git</span>
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">90%</span>
                </div>
                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700 dark:text-orange-300">Webpack</span>
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">75%</span>
                </div>
                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700 dark:text-orange-300">Vite</span>
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">85%</span>
                </div>
                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            항상 새로운 프론트엔드 기술을 배우고 적용하는 것에 대한 열정을 가지고 있으며, 
            사용자에게 최고의 경험을 제공하는 것이 제 목표입니다.
          </p>
          <a
            href="#contact"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>함께 일하고 싶으시다면 연락주세요</span>
            <FiTarget size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
