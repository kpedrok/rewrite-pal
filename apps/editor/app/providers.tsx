'use client'

import Header from '@/components/header'
import useLocalStorage from '@/hooks/use-local-storage'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { Toaster } from 'sonner'

export const AppContext = createContext<{
  font: string
  setFont: Dispatch<SetStateAction<string>>
}>({
  font: 'Default',
  setFont: () => {},
})

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: 'light' | 'dark' | 'system'
  }
  return <Toaster theme='light' />
}

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>('novel__font', 'Default')

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange defaultTheme='system'>
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}>
        <ToasterProvider />
        <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
          <Header />
          <main className='w-full'>{children}</main>
          {/* <Footer /> */}
        </div>
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  )
}
