import Footer from '@rewritepal/components/footer'
import { Header } from '@rewritepal/components/header'
import { ThemeProvider } from '@rewritepal/components/theme-provider'
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <a
            href="#main-content"
            className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 2000,
              style: {
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--popover-foreground)',
              },
            }}
          />
          <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-2 md:px-8">
            <Header />

            <main id="main-content" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
