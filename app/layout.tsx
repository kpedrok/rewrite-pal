import Footer from '@rewritepal/components/footer'
import { Header } from '@rewritepal/components/header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const title = 'RewritePal | Write Better, Communicate Better, Deliver More'
const description =
  "Your Free AI Writing Tool. Paraphrasing tool, improve any paragraph's readability and rewrite it to make it sound more human-like with this powerful free tool."

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s | RewritePal',
  },
  description,
  icons: {
    icon: '/images/icons/favicon.svg',
  },
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@CreatedByPed',
  },
  metadataBase: new URL('https://www.rewritepal.com/'),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
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
        <div className='container flex flex-col min-h-screen px-2 md:px-8'>
          <Header />

          <main className='flex flex-col flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
