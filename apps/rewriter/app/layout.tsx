import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Footer from '../components/footer'
import Header from '../components/header'
import './globals.css'
import { PHProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'RewritePal | Write Better, Communicate Better, Deliver More',
    template: '%s | RewritePal',
  },
  description: `Your Free AI Writing Tool. Paraphrasing tool, improve any paragraph's readability and rewrite it to make it sound more human-like with this powerful free tool.`,
  keywords: [
    'paraphrasing',
    'rewrite',
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

const PostHogPageView = dynamic(() => import('../lib/PostHogPageView'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <PHProvider>
        <body className={inter.className}>
          <PostHogPageView />
          <div className='container flex flex-col h-screen px-2 md:px-8'>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />

            <Toaster
              position='top-center'
              reverseOrder={false}
              toastOptions={{
                duration: 2000,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </div>
          <SpeedInsights />
        </body>
      </PHProvider>
    </html>
  )
}
