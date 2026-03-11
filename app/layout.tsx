import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GATE PREP - Online CBT Platform',
  description: 'Practice mock exams with exact GATE-style interface and detailed analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 selection:bg-blue-200 selection:text-blue-900`}>{children}</body>
    </html>
  )
}
