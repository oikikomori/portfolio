'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
    // { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    // { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiMail, href: 'mailto:c8c8c81828@gmail.com', label: 'Email' }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-dark-900 text-white relative">
      {/* 상단 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-800 to-dark-900"></div>
      
      <div className="container-custom relative z-10">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* 브랜드 정보 */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gradient mb-4">
                  Portfolio
                </h3>
                <p className="text-gray-300 mb-6 max-w-md">
                  창의적인 웹 솔루션을 만들어내는 프론트엔드 개발자입니다. 
                  사용자 경험을 중시하며, 최신 기술 트렌드를 활용한 프로젝트를 진행합니다.
                </p>
                
                {/* 소셜 링크 */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-primary-600 transition-all duration-200"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 빠른 링크 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'About', href: '#about' },
                  { name: 'Skills', href: '#skills' },
                  { name: 'Projects', href: '#projects' },
                  { name: 'Posts', href: '#posts' },
                  { name: 'Contact', href: '#contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 연락처 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>c8c8c81828@gmail.com</li>
                <li>+82 050-6679-1577</li>
                <li>송파구 사람</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-dark-700"></div>

        {/* 하단 푸터 */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {currentYear} Portfolio. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-sm text-gray-400"
            >
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 상단으로 이동 버튼 */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        aria-label="상단으로 이동"
      >
        <FiArrowUp size={20} />
      </motion.button>
    </footer>
  )
}
