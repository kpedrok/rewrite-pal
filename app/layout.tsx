import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from './components/header'
import './globals.css'

export const runtime = 'edge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grammar Buddy',
  description: 'Your Free AI Writing Assistance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='max-w-screen-lg m-auto'>
          <Header />
          <div className='p-5'>{children}</div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
