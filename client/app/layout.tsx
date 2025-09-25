import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '승짱 - Portfolio',
    template: '%s | 승짱 포트폴리오'
  },
  description: '프론트엔드 개발자 승짱의 포트폴리오 웹사이트. Next.js, React, TypeScript, Tailwind CSS 등을 활용한 프로젝트들과 개발 경험을 공유합니다.',
  keywords: [
    '포트폴리오',
    '웹 개발자',
    '프론트엔드',
    '백엔드',
    'React',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Tailwind CSS'
  ],
  authors: [{ name: '승짱' }],
  creator: '승짱',
  publisher: '승짱',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portfolio-pi-eight-svjrkqfkn0.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://portfolio-pi-eight-svjrkqfkn0.vercel.app/',
    title: 'Portfolio',
    description: '프론트엔드 개발자 승짱의 포트폴리오 웹사이트',
    siteName: '승짱 포트폴리오',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '승짱 포트폴리오',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '승짱 - 포트폴리오',
    description: '프론트엔드 개발자 승짱의 포트폴리오 웹사이트',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "승짱",
              "jobTitle": "프론트엔드 개발자",
              "description": "Next.js, React, Node.js, MongoDB를 활용한 웹 개발자",
              "url": "https://portfolio-pi-eight-svjrkqfkn0.vercel.app/",
              "sameAs": [
                "https://github.com/oikikomori",
                "https://linkedin.com/in/yourusername",
                "https://twitter.com/yourusername"
              ],
              "knowsAbout": [
                "React",
                "Next.js",
                "Node.js",
                "MongoDB",
                "TypeScript",
                "Tailwind CSS"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "자유 개발자"
              }
            })
          }}
        />
        
        {/* 추가 메타 태그 */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="승짱 포트폴리오" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 폰트 프리로드 */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-dark-900 text-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  )
}
