import HotjarAnalytics from '@/lib/HotjarAnalytics'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CSPostHogProvider } from './posthog'

// export const runtime = 'edge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RewriteAI',
  description: 'Your Free AI Writing Assistant',
  keywords: [
    'grammar checker',
    'AI writing assistant',
    'proofreading tool',
    'writing tool',
    'grammar tool',
    'free writing assistant',
    'language improvement',
    'online editor',
    'spelling check',
    'punctuation checker',
  ],
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <CSPostHogProvider>
        <body className={inter.className}>
          {children}
          <SpeedInsights />
        </body>
      </CSPostHogProvider>
      <GoogleAnalytics gaId='G-0M61BY9GR2' />
      <HotjarAnalytics />
      <Analytics />
    </html>
  )
}
