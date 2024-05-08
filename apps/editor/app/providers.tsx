'use client'

import Header from '@/components/header'
import { PHProvider } from '@/lib/providers'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { type ReactNode } from 'react'
import { Toaster } from 'sonner'

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: 'light' | 'dark' | 'system'
  }
  return <Toaster theme='light' />
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PHProvider>
      <ThemeProvider attribute='class' disableTransitionOnChange defaultTheme='light'>
        <ToasterProvider />
        <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
          <Header />
          <main className='w-full'>{children}</main>
          {/* <Footer /> */}
        </div>
        <Analytics />
      </ThemeProvider>
    </PHProvider>
  )
}
