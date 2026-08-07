import type { Metadata } from 'next'
import FaqPageClient from './FaqPageClient'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about kuuuma.com.',
  openGraph: {
    title: 'FAQ | Portfolio',
    description: 'Frequently asked questions about kuuuma.com.',
  },
}

export default function FaqPage() {
  return <FaqPageClient />
}
